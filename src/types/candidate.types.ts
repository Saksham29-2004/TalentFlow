/**
 * Type definitions for candidate-related entities
 * Contains all interfaces and types used in candidate management features
 */

export type CandidateStage = 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';

export interface Note {
  noteId: number;
  text: string;
  timestamp: string;
}

export interface StageHistoryEntry {
  stage: string;
  timestamp: string;
}

export interface Candidate {
  id: number;
  jobId: number;
  name: string;
  email: string;
  order?: number;
  currentStage: CandidateStage;
  stageHistory: StageHistoryEntry[];
  notes?: Note[];
}

export const CANDIDATE_STAGES: readonly CandidateStage[] = [
  'Applied', 
  'Screening', 
  'Interview', 
  'Hired', 
  'Rejected'
] as const;