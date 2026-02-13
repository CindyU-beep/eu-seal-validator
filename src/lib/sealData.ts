export interface RegulatorySeal {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'physical' | 'health' | 'environmental';
  imageUrl?: string;
}

export interface ValidationResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  fileName: string;
  status: 'pass' | 'fail' | 'warning';
  detectedSeals: DetectedSeal[];
  missingSeals: string[];
  overallConfidence: number;
  aiAnalysis: string;
  productDescription: string;
  annotatedImageUrl?: string;
  /** True when at least one detected seal could not be localized by CV — triggers mandatory human review. */
  requiresHumanReview?: boolean;
}

export interface DetectedSeal {
  sealId: string;
  sealName: string;
  confidence: number;
  present: boolean;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Where the bounding box came from: 'cv' (template matching), 'model' (LLM), or 'human' (manual annotation). */
  localizationSource?: 'cv' | 'model' | 'human';
  /** True when CV template matching failed to localize this seal. */
  localizationFailed?: boolean;
}

export const REGULATORY_SEALS: RegulatorySeal[] = [
  {
    id: 'ghs01',
    code: 'GHS01',
    name: 'Explosive',
    description: 'Explosive substances and articles',
    category: 'physical',
    imageUrl: '/src/assets/seals-compressed/explosive.png'
  },
  {
    id: 'ghs02',
    code: 'GHS02',
    name: 'Flammable',
    description: 'Flammable gases, aerosols, liquids, and solids',
    category: 'physical',
    imageUrl: '/src/assets/seals-compressed/flammable.png'
  },
  {
    id: 'ghs03',
    code: 'GHS03',
    name: 'Oxidizing',
    description: 'Oxidizing gases, liquids, and solids',
    category: 'physical',
    imageUrl: '/src/assets/seals-compressed/oxidising.png'
  },
  {
    id: 'ghs04',
    code: 'GHS04',
    name: 'Compressed Gas',
    description: 'Gases under pressure',
    category: 'physical',
    imageUrl: '/src/assets/seals-compressed/gas-under-pressure.png'
  },
  {
    id: 'ghs05',
    code: 'GHS05',
    name: 'Corrosive',
    description: 'Corrosive to metals and skin corrosion',
    category: 'physical',
    imageUrl: '/src/assets/seals-compressed/corrosive.png'
  },
  {
    id: 'ghs06',
    code: 'GHS06',
    name: 'Toxic',
    description: 'Acute toxicity (fatal or toxic)',
    category: 'health',
    imageUrl: '/src/assets/seals-compressed/acute-toxicity.png'
  },
  {
    id: 'ghs07',
    code: 'GHS07',
    name: 'Harmful/Irritant',
    description: 'Harmful if swallowed, skin irritation, eye irritation',
    category: 'health',
    imageUrl: '/src/assets/seals-compressed/serious-health-hazard.png'
  },
  {
    id: 'ghs08',
    code: 'GHS08',
    name: 'Health Hazard',
    description: 'Respiratory sensitization, carcinogenicity, reproductive toxicity',
    category: 'health',
    imageUrl: '/src/assets/seals-compressed/health-hazard.png'
  },
  {
    id: 'ghs09',
    code: 'GHS09',
    name: 'Environmental Hazard',
    description: 'Hazardous to the aquatic environment',
    category: 'environmental',
    imageUrl: '/src/assets/seals-compressed/hazardous-to-environment.png'
  }
];
