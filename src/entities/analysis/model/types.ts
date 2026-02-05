export interface ParsedMessage {
  role: 'sender' | 'receiver' | 'unknown';
  content: string;
}

export interface RagContext {
  matched_phrases: Array<{
    id: string;
    text: string;
    category: string;
    severity: number;
    usage_count: number;
  }>;
  similar_cases: Array<{
    id: string;
    title: string;
    description: string;
    damage_amount: number;
    platform: string;
  }>;
  risk_indicators: string[];
  total_reports: number;
}

export interface AnalysisData {
  riskLevel: 'safe' | 'warning' | 'danger';
  riskScore: number;
  summary: string;
  analysis: string;
  reasons: string[];
  detectedPatterns: Array<{
    pattern: string;
    category: string;
    severity: string;
  }>;
  recommendations: string[];
  savedToRag: boolean;
  interpretationSteps?: string[];
  parsedMessages?: ParsedMessage[];
  ragContext?: RagContext;
}

export interface Analysis {
  id: string;
  type: 'chat' | 'image' | 'profile';
  score: number;
  date: number;
  summary: string;
}

export interface UrlCheckResult {
  status: 'safe' | 'warning' | 'danger';
  originalUrl: string;
  finalUrl: string;
  domain: string;
  isHttps: boolean;
  isShortUrl: boolean;
  riskScore: number;
  suspiciousPatterns: string[];
  message: string;
  expansion?: {
    redirectCount: number;
    redirectChain: string[];
  };
}

export interface PatternAnalysis {
  isValid: boolean;
  type?: string;
  warnings?: string[];
  bankName?: string;
}

export interface AdditionalLink {
  name: string;
  url: string;
  description: string;
}

export interface FraudCheckResult {
  status: 'safe' | 'danger';
  type: 'PHONE' | 'ACCOUNT';
  value: string;
  displayValue: string;
  message: string;
  patternAnalysis?: PatternAnalysis;
  bank?: string;
  totalRecords: number;
  recommendations: string[];
  additionalLinks: AdditionalLink[];
}

export interface VerifyResult {
  detectedType: 'URL' | 'PHONE' | 'ACCOUNT';
  detectedTypeLabel: string;
  status: 'safe' | 'warning' | 'danger';
  inputValue: string;
  message: string;
  recommendations: string[];
  // URL specific
  originalUrl?: string;
  finalUrl?: string;
  domain?: string;
  isHttps?: boolean;
  isShortUrl?: boolean;
  riskScore?: number;
  suspiciousPatterns?: string[];
  expansion?: {
    redirectCount: number;
    redirectChain: string[];
  };
  // Phone/Account specific
  value?: string;
  displayValue?: string;
  patternAnalysis?: PatternAnalysis;
  totalRecords?: number;
  additionalLinks?: AdditionalLink[];
}
