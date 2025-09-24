/**
 * Type definitions for job-related entities
 * Contains all interfaces and types used in jobs features
 */

export const TAG_POOL = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'JavaScript', 'AWS', 'Docker',
    'Remote', 'Full-time', 'Contract', 'Part-time', 'GraphQL', 'REST API', 'MongoDB', 'PostgreSQL',
    'Senior', 'Mid-Level', 'Junior', 'Lead', 'CSS', 'HTML', 'Vue.js', 'Angular',
    'Kubernetes', 'DevOps', 'CI/CD', 'Agile', 'Scrum', 'Machine Learning', 'AI', 'Data Science'
];

export type JobStatus = 'active' | 'archived' | 'inactive';

export interface Job {
  id: number;
  title: string;
  status: JobStatus;
  tags: string[];
  order: number;
  department?: string;
  location?: string;
  experience?: string;
  employmentType?: string;
  priority?: number;
  datePosted?: string;
  description?: string;
  requirements?: string[];
}