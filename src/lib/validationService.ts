import { REGULATORY_SEALS, type ValidationResult, type DetectedSeal } from './sealData';
import { drawBoundingBoxes } from './imageUtils';

export async function validateProductLabel(
  imageBase64: string,
  fileName: string
): Promise<ValidationResult> {
  const sealsList = REGULATORY_SEALS.map(
    (seal) => `${seal.code} - ${seal.name}: ${seal.description}`
  ).join('\n');

  const promptText = `You are an expert EU regulatory compliance validator specializing in CLP/GHS hazard pictograms and product labeling.

Analyze the uploaded product label image and identify which EU regulatory hazard pictograms (seals) are present.

Here are the 15 reference EU regulatory seals to check for:
${sealsList}

Your task:
1. First, describe what product you observe in the image (e.g., "This appears to be a laundry detergent bottle...", "This is a cleaning spray container...", etc.)
2. Carefully examine the image for any GHS pictograms (diamond-shaped hazard symbols with red borders)
3. Identify each pictogram present in the image
4. For each identified pictogram, provide a confidence score (0-100)
5. For each identified pictogram, provide normalized bounding box coordinates (x, y, width, height as decimals 0-1)
6. List any pictograms that appear to be missing or unclear
7. Provide an overall assessment of the label's compliance quality

IMAGE TO ANALYZE:
${imageBase64}

Return your analysis as a JSON object with this exact structure:
{
  "productDescription": "This appears to be a [product type] with [notable visual characteristics]. The label shows [brand/text/imagery observations].",
  "detectedSeals": [
    {
      "sealId": "ghs01",
      "sealName": "Explosive",
      "confidence": 95,
      "present": true,
      "boundingBox": {
        "x": 0.1,
        "y": 0.2,
        "width": 0.15,
        "height": 0.15
      }
    }
  ],
  "overallConfidence": 85,
  "complianceStatus": "pass",
  "summary": "Detailed analysis of what you found, including image quality, pictogram clarity, and any concerns"
}

Note: 
- productDescription should be a clear, concise description of what the product appears to be based on visual observation
- complianceStatus should be "pass" if all detected seals are clear and confidence is high (>80%), "warning" if confidence is moderate (60-80%) or image quality is poor, "fail" if critical issues are found
- Only include seals that you actually detect in the image
- Be thorough but conservative in your assessments
- Bounding box coordinates should be normalized (0-1 range) where x and y are top-left corner positions, width and height are dimensions`;

  try {
    const response = await window.spark.llm(promptText, 'gpt-4o', true);
    
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

    const detectedSealIds = new Set(
      analysis.detectedSeals.map((seal: DetectedSeal) => seal.sealId)
    );
    
    const missingSeals = REGULATORY_SEALS
      .filter((seal) => !detectedSealIds.has(seal.id))
      .map((seal) => seal.name);

    let annotatedImageUrl: string | undefined;
    
    try {
      const annotations = analysis.detectedSeals
        .filter((seal: DetectedSeal) => seal.boundingBox)
        .map((seal: DetectedSeal) => ({
          sealName: seal.sealName,
          confidence: seal.confidence,
          boundingBox: seal.boundingBox!
        }));
      
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
      overallConfidence: analysis.overallConfidence || 0,
      aiAnalysis: analysis.summary || 'No detailed analysis available.',
      productDescription: analysis.productDescription || 'Product description not available.',
      annotatedImageUrl
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
