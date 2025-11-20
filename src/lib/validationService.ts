import { REGULATORY_SEALS, type ValidationResult, type DetectedSeal } from './sealData';

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
1. Carefully examine the image for any GHS pictograms (diamond-shaped hazard symbols with red borders)
2. Identify each pictogram present in the image
3. For each identified pictogram, provide a confidence score (0-100)
4. List any pictograms that appear to be missing or unclear
5. Provide an overall assessment of the label's compliance quality

Return your analysis as a JSON object with this exact structure:
{
  "detectedSeals": [
    {
      "sealId": "ghs01",
      "sealName": "Explosive",
      "confidence": 95,
      "present": true
    }
  ],
  "overallConfidence": 85,
  "complianceStatus": "pass",
  "summary": "Detailed analysis of what you found, including image quality, pictogram clarity, and any concerns"
}

Note: 
- complianceStatus should be "pass" if all detected seals are clear and confidence is high (>80%), "warning" if confidence is moderate (60-80%) or image quality is poor, "fail" if critical issues are found
- Only include seals that you actually detect in the image
- Be thorough but conservative in your assessments`;

  try {
    const response = await window.spark.llm(promptText, 'gpt-4o', true);
    const analysis = JSON.parse(response);

    const detectedSealIds = new Set(
      analysis.detectedSeals.map((seal: DetectedSeal) => seal.sealId)
    );
    
    const missingSeals = REGULATORY_SEALS
      .filter((seal) => !detectedSealIds.has(seal.id))
      .map((seal) => seal.name);

    const result: ValidationResult = {
      id: `val-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      imageUrl: imageBase64,
      fileName,
      status: analysis.complianceStatus || 'warning',
      detectedSeals: analysis.detectedSeals || [],
      missingSeals,
      overallConfidence: analysis.overallConfidence || 0,
      aiAnalysis: analysis.summary || 'No detailed analysis available.'
    };

    return result;
  } catch (error) {
    console.error('Validation error:', error);
    throw new Error('Failed to validate image. Please try again.');
  }
}
