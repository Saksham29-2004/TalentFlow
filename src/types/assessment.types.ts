/**
 * Type definitions for assessment-related entities
 * Contains all interfaces and types used in assessment management features
 */

// Question type definitions
interface ShortTextDetails {
  type: 'short-text';
  maxLength?: number;
}

interface LongTextDetails {
  type: 'long-text';
  maxLength?: number;
}

interface SingleChoiceDetails {
  type: 'single-choice';
  options: string[];
}

interface MultiChoiceDetails {
  type: 'multi-choice';
  options: string[];
}

interface NumericDetails {
  type: 'numeric';
  min?: number;
  max?: number;
}

interface FileUploadDetails {
  type: 'file-upload';
}

export type QuestionDetails =
  | ShortTextDetails
  | LongTextDetails
  | SingleChoiceDetails
  | MultiChoiceDetails
  | NumericDetails
  | FileUploadDetails;

export interface Question {
  id: string;
  text: string;
  isRequired: boolean;
  details: QuestionDetails;
  condition?: {
    questionId: string;
    value: any;
  };
  correctAnswer?: any;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
  description?: string;
}

export interface Assessment {
  id: number;
  jobId: number;
  title: string;
  sections: Section[];
  description?: string;
  timeLimit?: number;
  createdAt?: string;
  isActive?: boolean;
}

export interface AssessmentResponse {
  id?: number;
  jobId: number;
  candidateId: number;
  responses: Record<string, any>;
  completedAt?: string;
  score?: number;
}