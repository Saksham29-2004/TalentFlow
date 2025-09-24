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
}
// export let ALL_JOBS: Job[] = Array.from({ length: 23 }, (_, i) => ({
//   id: i + 1,
//   title: `Software Engineer ${i + 1}`,
//   status: (i % 3 === 0 ? 'archived' : 'active') as JobStatus,
//   tags: [TAG_POOL[i % TAG_POOL.length], TAG_POOL[(i + 3) % TAG_POOL.length]],
// }));