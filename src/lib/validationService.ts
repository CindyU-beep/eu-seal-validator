import { REGULATORY_SEALS, type ValidationResult, type DetectedSeal } from './sealData';
import { drawBoundingBoxes } from './imageUtils';
import { callAzureOpenAI } from './azureOpenAI';

/**
 * Call the server-side CV template-matching endpoint to get bounding boxes.
 */
async function locateSealsViaCV(
  imageBase64: string,
  detectedSealIds: string[]
): Promise<Array<{ sealId: string; localized: boolean; boundingBox: { x: number; y: number; width: number; height: number } | null; matchScore: number }>> {
  const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3001';
  const res = await fetch(`${backendUrl}/api/locate-seals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, detectedSealIds }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Seal localization request failed');
  }
  const data = await res.json();
  return data.results;
}

export async function validateProductLabel(
  imageBase64: string,
  fileName: string
): Promise<ValidationResult> {
  const sealsList = REGULATORY_SEALS.map(
    (seal) => `${seal.code} - ${seal.name}: ${seal.description}`
  ).join('\n');

  // ── Stage 1: LLM Classification (no bounding boxes) ──────────────────
  const promptText = `You are an expert EU regulatory compliance validator specialising in CLP/GHS hazard pictograms and product labelling.

Analyse the uploaded product label image and identify which EU regulatory hazard pictograms (seals) are present.

Reference EU regulatory seals:
${sealsList}

Your task:
1. Describe the product you observe in the image
2. Carefully examine the image for GHS pictograms (diamond-shaped hazard symbols with red borders and white background)
3. Identify each pictogram present — check for:
   - GHS01 Explosive (Exploding Bomb)
   - GHS02 Flammable (Flame)
   - GHS03 Oxidising (Flame over circle)
   - GHS04 Gas Under Pressure (Gas cylinder)
   - GHS05 Corrosive (Two test tubes pouring onto hand & metal bar)
   - GHS06 Acute Toxicity (Skull and crossbones)
   - GHS07 Health Hazard (Exclamation mark)
   - GHS08 Serious Health Hazard (Human silhouette with star-shaped explosion in chest)
   - GHS09 Hazardous to Environment (Dead tree & fish)
4. For each identified pictogram, provide a confidence score (0-100)
5. Provide an overall compliance assessment

Return JSON:
{
  "productDescription": "Description of the product",
  "detectedSeals": [
    {
      "sealId": "GHS01",
      "sealName": "Explosive",
      "confidence": 95,
      "present": true
    }
  ],
  "overallConfidence": 85,
  "complianceStatus": "pass",
  "summary": "Detailed analysis"
}

Rules:
- complianceStatus: "pass" (>80% confidence, all clear), "warning" (60-80% or poor quality), "fail" (critical issues)
- Only include seals you actually detect
- Be thorough but conservative
- Do NOT include bounding box coordinates — localization is handled separately`;

  try {
    // ── Stage 1: Call LLM for classification ────────────────────────────
    const response = await callAzureOpenAI(promptText, imageBase64);
    
    let analysis;
    try {
      analysis = JSON.parse(response);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response was:', response);
      throw new Error('Failed to parse validation response. Please try again.');
    }

    if (!analysis.detectedSeals || !Array.isArray(analysis.detectedSeals)) {
      console.error('Invalid response structure:', analysis);
      throw new Error('Invalid response format from validation service.');
    }

    // Fix case-sensitivity: LLM may return "GHS01" but REGULATORY_SEALS uses "ghs01"
    const detectedSealIds = new Set(
      analysis.detectedSeals.map((seal: DetectedSeal) => seal.sealId.toUpperCase())
    );
    
    const missingSeals = REGULATORY_SEALS
      .filter((seal) => !detectedSealIds.has(seal.code.toUpperCase()))
      .map((seal) => seal.name);

    // Calculate overall confidence as the average of detected seal confidences
    const overallConfidence = analysis.detectedSeals.length > 0
      ? Math.round(
          analysis.detectedSeals.reduce((sum: number, seal: DetectedSeal) => sum + seal.confidence, 0) /
          analysis.detectedSeals.length
        )
      : 0;

    // ── Stage 2: CV Template Matching for bounding boxes ────────────────
    let requiresHumanReview = false;

    try {
      const sealIdsToLocate = analysis.detectedSeals
        .filter((s: DetectedSeal) => s.present)
        .map((s: DetectedSeal) => s.sealId);

      if (sealIdsToLocate.length > 0) {
        console.log('[CV] Requesting localization for:', sealIdsToLocate);
        const cvResults = await locateSealsViaCV(imageBase64, sealIdsToLocate);
        console.log('[CV] Results:', JSON.stringify(cvResults, null, 2));

        // Merge CV bounding boxes into the detected seals
        for (const cvResult of cvResults) {
          const seal = analysis.detectedSeals.find(
            (s: DetectedSeal) => s.sealId.toUpperCase() === cvResult.sealId.toUpperCase()
          );
          if (!seal) continue;

          if (cvResult.localized && cvResult.boundingBox) {
            seal.boundingBox = cvResult.boundingBox;
            seal.localizationSource = 'cv';
            seal.localizationFailed = false;
            console.log(`[CV] ${seal.sealId}: localized via CV (score=${cvResult.matchScore})`);
          } else {
            // Use best-effort box if available (even below threshold), but flag for review
            if (cvResult.boundingBox) {
              seal.boundingBox = cvResult.boundingBox;
              seal.localizationSource = 'cv';
              console.log(`[CV] ${seal.sealId}: using best-effort box (score=${cvResult.matchScore}, below threshold)`);
            }
            seal.localizationFailed = true;
            seal.localizationSource = undefined;
            requiresHumanReview = true;
          }
        }
      }
    } catch (cvError) {
      console.error('[CV] Localization FAILED — all seals marked for human review:', cvError);
      // Mark all seals as needing human review
      for (const seal of analysis.detectedSeals) {
        seal.localizationFailed = true;
      }
      requiresHumanReview = true;
    }

    // ── Stage 3: Generate annotated image ───────────────────────────────
    let annotatedImageUrl: string | undefined;
    
    try {
      const annotations = analysis.detectedSeals
        .filter((seal: DetectedSeal) => seal.boundingBox)
        .map((seal: DetectedSeal) => ({
          sealName: seal.sealName,
          confidence: seal.confidence,
          boundingBox: seal.boundingBox!,
          localizationSource: seal.localizationSource,
        }));
      
      console.log(`[Annotate] Drawing ${annotations.length} bounding box(es) on image`);
      if (annotations.length > 0) {
        annotatedImageUrl = await drawBoundingBoxes(imageBase64, annotations);
      }
    } catch (annotationError) {
      console.warn('Failed to generate annotated image:', annotationError);
    }

    const result: ValidationResult = {
      id: `val-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      imageUrl: imageBase64,
      fileName,
      status: analysis.complianceStatus || 'warning',
      detectedSeals: analysis.detectedSeals || [],
      missingSeals,
      overallConfidence,
      aiAnalysis: analysis.summary || 'No detailed analysis available.',
      productDescription: analysis.productDescription || 'Product description not available.',
      annotatedImageUrl,
      requiresHumanReview,
    };

    return result;
  } catch (error) {
    console.error('Validation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to validate image. Please try again.');
  }
}
