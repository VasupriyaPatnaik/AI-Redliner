export interface Document {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'failed';
  conflicts?: number;
  gaps?: number;
  irrelevant?: number;
  playbook?: string;
  uploadDate: string;
  thumbnail?: string;
  content?: DocumentSection[];
}

export interface DocumentSection {
  type: 'normal' | 'section' | 'redline' | 'gap' | 'irrelevant' | 'fulfilled';
  text: string;
  note?: string;
}

export interface Playbook {
  id: string;
  name: string;
  rules: number;
  lastUpdated: string;
  createdBy: string;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  type: 'required' | 'forbidden' | 'conditional';
  category: string;
}

export interface AnalyticsSummary {
  documentsAnalyzed: number;
  timeSaved: string;
  complianceRate: string;
  commonIssues: string[];
}