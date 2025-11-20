export interface RegulatorySeal {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'physical' | 'health' | 'environmental';
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
}

export interface DetectedSeal {
  sealId: string;
  sealName: string;
  confidence: number;
  present: boolean;
}

export const REGULATORY_SEALS: RegulatorySeal[] = [
  {
    id: 'ghs01',
    code: 'GHS01',
    name: 'Explosive',
    description: 'Explosive substances and articles',
    category: 'physical'
  },
  {
    id: 'ghs02',
    code: 'GHS02',
    name: 'Flammable',
    description: 'Flammable gases, aerosols, liquids, and solids',
    category: 'physical'
  },
  {
    id: 'ghs03',
    code: 'GHS03',
    name: 'Oxidizing',
    description: 'Oxidizing gases, liquids, and solids',
    category: 'physical'
  },
  {
    id: 'ghs04',
    code: 'GHS04',
    name: 'Compressed Gas',
    description: 'Gases under pressure',
    category: 'physical'
  },
  {
    id: 'ghs05',
    code: 'GHS05',
    name: 'Corrosive',
    description: 'Corrosive to metals and skin corrosion',
    category: 'physical'
  },
  {
    id: 'ghs06',
    code: 'GHS06',
    name: 'Toxic',
    description: 'Acute toxicity (fatal or toxic)',
    category: 'health'
  },
  {
    id: 'ghs07',
    code: 'GHS07',
    name: 'Harmful/Irritant',
    description: 'Harmful if swallowed, skin irritation, eye irritation',
    category: 'health'
  },
  {
    id: 'ghs08',
    code: 'GHS08',
    name: 'Health Hazard',
    description: 'Respiratory sensitization, carcinogenicity, reproductive toxicity',
    category: 'health'
  },
  {
    id: 'ghs09',
    code: 'GHS09',
    name: 'Environmental Hazard',
    description: 'Hazardous to the aquatic environment',
    category: 'environmental'
  },
  {
    id: 'eu-warn',
    code: 'EU-WARN',
    name: 'Warning',
    description: 'General warning symbol for EU compliance',
    category: 'physical'
  },
  {
    id: 'eu-danger',
    code: 'EU-DANGER',
    name: 'Danger',
    description: 'Danger signal word indicator',
    category: 'physical'
  },
  {
    id: 'eu-caution',
    code: 'EU-CAUTION',
    name: 'Caution',
    description: 'Caution signal word indicator',
    category: 'physical'
  },
  {
    id: 'eu-ufh',
    code: 'EU-UFH',
    name: 'UFI Code Required',
    description: 'Unique Formula Identifier requirement indicator',
    category: 'physical'
  },
  {
    id: 'eu-biocide',
    code: 'EU-BPR',
    name: 'Biocidal Product',
    description: 'EU Biocidal Products Regulation compliance',
    category: 'health'
  },
  {
    id: 'eu-reach',
    code: 'EU-REACH',
    name: 'REACH Compliant',
    description: 'Registration, Evaluation, Authorization of Chemicals compliance',
    category: 'environmental'
  }
];
