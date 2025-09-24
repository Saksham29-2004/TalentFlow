import { http } from 'msw';
import { db } from '../db';
import type { Job } from '@/data/JobsData/Jobs.types'; 

// Utility function to simulate artificial latency and error rate
const simulateLatencyAndErrors = async (isWriteOperation = false) => {
  // Add artificial latency (200-1200ms)
  const delay = Math.floor(Math.random() * 1000) + 200; // 200-1200ms
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate error rate (5-10% for write operations)
  if (isWriteOperation && Math.random() < 0.075) { // 7.5% average error rate
    throw new Error('Simulated server error');
  }
};

export const jobsHandlers = [
  http.get('/api/jobs', async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.get('status');
    const tags = url.searchParams.getAll('tags');
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

    let query;

    if (status && status !== 'all') {
      query = db.jobs.where('status').equals(status);
    } else {
      query = db.jobs.toCollection();
    }

    if (search) {
      query = query.filter(job => 
        job.title.toLowerCase().includes(search)
      );
    }

    if (tags.length > 0) {
      query = query.filter(job => 
        tags.every(tag => job.tags.includes(tag))
      );
    }

    const sortedJobs = await query.sortBy('order');

    const totalCount = sortedJobs.length;
    
    const paginatedJobs = sortedJobs.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    return Response.json({
      data: paginatedJobs,
      totalCount: totalCount,
    });
  }),

  http.patch('/api/jobs/reorder', async ({ request }) => {
    console.log("MSW: Intercepted PATCH /api/jobs/reorder");

    try {
      await simulateLatencyAndErrors(true); // Write operation
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Simulated server error';
      return new Response(JSON.stringify({ message: errorMessage }), { status: 500 });
    }

    const { reorderedJobs } = await request.json() as { reorderedJobs: Job[] };
    
   
    const jobsToUpdate = reorderedJobs.map((job, index) => ({
      ...job,
      order: index,
    }));
  
    
    await db.jobs.bulkPut(jobsToUpdate);
  
    return new Response(null, { status: 204 });
  }),

  
  http.get('/api/tags', async () => {
    const allJobs = await db.jobs.toArray();
    const uniqueTags = new Set<string>();
    allJobs.forEach(job => job.tags.forEach(tag => uniqueTags.add(tag)));
    return Response.json(Array.from(uniqueTags).sort());
  }),

  http.post('/api/jobs', async ({ request }) => {
    try {
      await simulateLatencyAndErrors(true); // Write operation
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Simulated server error';
      return new Response(JSON.stringify({ message: errorMessage }), { status: 500 });
    }

    const newJobData = await request.json() as Omit<Job, 'id'>;
    const newId = await db.jobs.add(newJobData);
    const newJob = await db.jobs.get(newId);
    return Response.json(newJob, { status: 201 }); 
  }),

  http.patch('/api/jobs/:id', async ({ request, params }) => {
    try {
      await simulateLatencyAndErrors(true); // Write operation
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Simulated server error';
      return new Response(JSON.stringify({ message: errorMessage }), { status: 500 });
    }

    const jobId = Number(params.id);
    const updates = await request.json() as Partial<Job>; 
    await db.jobs.update(jobId, updates);
    const updatedJob = await db.jobs.get(jobId);
    return Response.json(updatedJob);
  }),

  http.put('/api/jobs/:id', async ({ request, params }) => {
    try {
      await simulateLatencyAndErrors(true); // Write operation
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Simulated server error';
      return new Response(JSON.stringify({ message: errorMessage }), { status: 500 });
    }

    const jobId = Number(params.id);
    const updatedJobData = await request.json() as Job;
    await db.jobs.put(updatedJobData, jobId);
    const updatedJob = await db.jobs.get(jobId);
    return Response.json(updatedJob);
  }),

  http.get('/api/jobs/:id', async ({ params }) => {
    const jobId = Number(params.id);
    const job = await db.jobs.get(jobId);
    if (job) {
      return Response.json(job);
    } else {
      return new Response(JSON.stringify({ message: 'Job not found' }), { status: 404 });
    }
  }),
  
  http.delete('/api/jobs/:id', async ({ params }) => {
    try {
      await simulateLatencyAndErrors(true); // Write operation
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Simulated server error';
      return new Response(JSON.stringify({ message: errorMessage }), { status: 500 });
    }

    const jobId = Number(params.id);
    await db.jobs.delete(jobId);
    return new Response(null, { status: 204 });
  }),
 

];