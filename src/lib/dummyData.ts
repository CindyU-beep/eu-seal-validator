import { type ValidationResult } from './sealData';

const now = Date.now();

const dummyImages = [
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e6f7ff"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23333" font-family="Arial" font-size="24"%3EAll-Purpose Cleaner%3C/text%3E%3Crect x="160" y="80" width="80" height="80" fill="%234CAF50" stroke="%23000" stroke-width="3" transform="rotate(45 200 120)"/%3E%3Ctext x="200" y="135" text-anchor="middle" fill="%23fff" font-size="48"%3E✓%3C/text%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f0e6ff"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23333" font-family="Arial" font-size="24"%3EGlass Cleaner%3C/text%3E%3Ccircle cx="200" cy="120" r="40" fill="%239C27B0" stroke="%23000" stroke-width="3"/%3E%3Cpath d="M 185 105 Q 200 95 215 105 M 185 130 Q 200 140 215 130" stroke="%23fff" stroke-width="3" fill="none"/%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23fff3e0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23333" font-family="Arial" font-size="24"%3EDisinfectant Spray%3C/text%3E%3Cpolygon points="200,80 160,140 240,140" fill="%23FF9800" stroke="%23000" stroke-width="3"/%3E%3Ctext x="200" y="125" text-anchor="middle" fill="%23000" font-size="32"%3E!%3C/text%3E%3C/svg%3E',
];
const fileNames = [
  

];
export const dummyValidation
    id: 'dummy-1',
    imageUrl: dummyImages[0
  'bleach.jpg',
  'floor-cleaner.jpg'
];

export const dummyValidationResults: ValidationResult[] = [
   
    id: 'dummy-1',
    timestamp: now - 3600000,
    imageUrl: dummyImages[0],
    fileName: fileNames[0],
    status: 'pass',
    detectedSeals: [
      { sealId: 'ghs07', sealName: 'Harmful/Irritant', confidence: 95, present: true },
      { sealId: 'eu-reach', sealName: 'REACH Compliant', confidence: 89, present: true }
    ],
    missingSeals: [],
    overallConfidence: 92,
    aiAnalysis: 'Label is fully compliant with EU regulations. All required hazard symbols and safety information are clearly displayed and meet regulatory standards.'
  },
  {
    id: 'dummy-2',
    timestamp: now - 86400000,
    imageUrl: dummyImages[1],
    fileName: fileNames[1],
    status: 'pass',
    detectedSeals: [
      { sealId: 'ghs07', sealName: 'Harmful/Irritant', confidence: 94, present: true },
      { sealId: 'eu-reach', sealName: 'REACH Compliant', confidence: 87, present: true }
    ],
    missingSeals: [],
    overallConfidence: 91,
    aiAnalysis: 'Product label meets all required compliance standards. Hazard communication is clear and appropriate for the product category.'
  },
  {
    id: 'dummy-3',
    timestamp: now - 172800000,
    imageUrl: dummyImages[2],
    fileName: fileNames[2],
    status: 'warning',
    detectedSeals: [
      { sealId: 'ghs07', sealName: 'Harmful/Irritant', confidence: 96, present: true },
      { sealId: 'eu-danger', sealName: 'Danger', confidence: 88, present: true },
      { sealId: 'eu-reach', sealName: 'REACH Compliant', confidence: 90, present: true }
    ],
    missingSeals: [],
    overallConfidence: 92,
    aiAnalysis: 'Label is compliant but includes additional hazard warnings. Ensure all safety precautions are clearly communicated to users.'
  },
  {
    missingSeals: 
    aiAnalysis: 'Label is missi
  },
    id: 'dummy-5',
    imageUrl: dummy
    status: 'pass',
      { sealId: 'ghs07', sealName: 'Harmful/Irritant', confidence: 93, present:
    ],
    overallConfidence: 92,
    productDescription: 'F
];
















