import Dexie, { type EntityTable } from 'dexie';
import type { Job } from '@/data/JobsData/Jobs.types'; 
import type { Assessment, AssessmentResponse } from '../../data/AssessmentFunctions/assessment';
import type { Candidate } from '../../types/candidate.types';

export class MyDatabase extends Dexie {
  jobs!: EntityTable<Job, 'id'>;
  candidates!: EntityTable<Candidate, 'id'>;
  assessments!: EntityTable<Assessment, 'id'>;
  assessmentResponses!: EntityTable<AssessmentResponse, 'id'>;

  constructor() {
    super('MyMockDatabase');
    
   
    this.version(2).stores({
      jobs: '++id, title, status, order',
      candidates: '++id, jobId, currentStage, *name, email', 
      assessments: '++id, jobId',
      assessmentResponses: '++id, [jobId+candidateId]',
    });
  }
}

export const db = new MyDatabase();

