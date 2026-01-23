export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export interface EmergencyStep {
  id: string;
  title: string;
  instruction: string;
  warning?: string;
  imagePlaceholder?: string;
  alternatives?: string[];
}

export interface SummaryTemplate {
  fields: string[];
  recommendations: string[];
}

export interface EmergencyFlow {
  id: string;
  category: string;
  icon: string;
  description: string;
  priorityHint: Priority;
  steps: EmergencyStep[];
  nextQuestions: string[];
  summaryTemplate: SummaryTemplate;
}

export interface DispatcherCase {
  id: string;
  category: string;
  priority: Priority;
  reportedAt: Date;
  location: string;
  summary: string;
  status: 'active' | 'pending' | 'resolved';
  suggestedActions: string[];
  suggestedQuestions: string[];
  stepsCompleted: string[];
}

export interface EmergencySummaryData {
  category: string;
  categoryIcon: string;
  priority: Priority;
  stepsCompleted: string[];
  totalSteps: number;
  duration: number; // in seconds
  startTime: Date;
  endTime: Date;
  location?: string;
  notes?: string;
}

export interface NearbyService {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'police' | 'fire';
  address: string;
  distance: string;
  eta: string;
  phone?: string;
  isOpen24h?: boolean;
}
