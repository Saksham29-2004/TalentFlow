import type { Job } from '../../types/job.types'; 

/**
 * Job-related API service functions
 * Handles all HTTP requests related to jobs
 */

/**
 * Fetches a paginated and filtered list of jobs from the API.
 */
export async function fetchJobs(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  tags?: string[];
}): Promise<{ data: Job[]; totalCount: number }> {
  const queryParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.status) {
    queryParams.append('status', params.status);
  }
  if (params.tags) {
    params.tags.forEach(tag => queryParams.append('tags', tag));
  }
  
  const response = await fetch(`/api/jobs?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  return response.json();
}

/**
 * Creates a new job.
 */
export async function createJob(jobData: Omit<Job, 'id'>): Promise<Job> {
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    throw new Error('Failed to create job');
  }

  return response.json();
}

/**
 * FULLY updates a job (using PUT).
 */
export async function updateJob(jobId: number, jobData: Job): Promise<Job> {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    throw new Error('Failed to update job');
  }

  return response.json();
}

/**
 * PARTIALLY updates a job (using PATCH).
 */
export async function patchJob(jobId: number, updates: Partial<Job>): Promise<Job> {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to patch job');
  }

  return response.json();
}

/**
 * Fetches a single job by its ID.
 */
export async function fetchJobById(jobId: number): Promise<Job> {
  const response = await fetch(`/api/jobs/${jobId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch job with ID ${jobId}`);
  }

  return response.json();
}

/**
 * Saves the new order of jobs.
 */
export async function saveJobOrder(reorderedJobs: Job[]): Promise<void> {
  const response = await fetch('/api/jobs/reorder', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reorderedJobs }),
  });

  if (!response.ok) {
    throw new Error('Failed to save job order(intentional 5% error to check rollback!');
  }
}

/**
 * Deletes a job by its ID.
 */
export async function deleteJob(jobId: number): Promise<void> {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete job');
  }
}

/**
 * Fetches all unique tags.
 */
export async function fetchTags(): Promise<string[]> {
  const response = await fetch('/api/tags');
  
  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }
  
  return response.json();
}