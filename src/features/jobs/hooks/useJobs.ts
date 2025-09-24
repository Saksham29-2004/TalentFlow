import { useState, useEffect } from 'react';
import * as jobsApi from '../../../services/api/jobService';
import { useDragAndDrop } from './useDragAndDrop';
import type { Job } from '../../../types/job.types'; 

const JOBS_PER_PAGE = 5;

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);     
  const [totalPages, setTotalPages] = useState<number>(0);       

  type JobFilters = {
    search: string;
    status: string;
    tags: string[];
  };
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    status: 'all',
    tags: [],
  });

  const refetchTags = async () => {
    const tags = await jobsApi.fetchTags();
    setAllTags(tags);
  };

  useEffect(() => {
    const getJobsAndTags = async () => {
      setIsLoading(true);
      try {
        // currentPage is always a number now
        const [jobsResponse, tagsResponse] = await Promise.all([
          jobsApi.fetchJobs({
            page: currentPage,
            pageSize: JOBS_PER_PAGE,
            ...filters,
          }),
          jobsApi.fetchTags(),
        ]);

        setJobs(jobsResponse.data);
        setTotalPages(Math.ceil(jobsResponse.totalCount / JOBS_PER_PAGE));
        setAllTags(tagsResponse);
      } catch (err) {
        console.error('Failed to fetch jobs or tags:', err);
        setJobs([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    getJobsAndTags();
  }, [currentPage, filters]);

  const refetchJobs = async () => {
    setIsLoading(true);
    try {
      const resp = await jobsApi.fetchJobs({
        page: currentPage,
        pageSize: JOBS_PER_PAGE,
        ...filters,
      });
      setJobs(resp.data);
      setTotalPages(Math.ceil(resp.totalCount / JOBS_PER_PAGE));
    } catch (err) {
      console.error('Failed to refetch jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJob = async (formData: Omit<Job, 'id'>) => {
    try {
      await jobsApi.createJob(formData);
      refetchJobs();
      refetchTags();
      alert('Job created successfully!');
    } catch {
      alert('Error: Could not create the job.');
    }
  };

  const handleUpdateJob = async (formData: Job) => {
    try {
      await jobsApi.updateJob(formData.id, formData);
      alert('Job updated successfully!');
      refetchJobs();
      refetchTags();
    } catch {
      alert('Error: Could not update the job.');
    }
  };

  const handleFilterChange = <K extends keyof JobFilters>(
    filterName: K,
    value: JobFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    } as JobFilters)); // assert full shape
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };
  const handleReorderJobs = async (reordered: Job[]) => {
    const backup = [...jobs];
    setJobs(reordered);

    try {
      const toSave = reordered.map((job, idx) => ({ ...job, order: idx }));
      await jobsApi.saveJobOrder(toSave);
    } catch {
      console.error('Reorder failed');
      setJobs(backup);
      alert('Error saving new job order; reverting changes.');
    }
  };

  const { handleDragStart, handleDragEnter, handleDragOver, handleDrop } =
    useDragAndDrop(jobs, handleReorderJobs);

  const handleArchive = async (id: number, currentStatus: Job['status']) => {
    const backup = [...jobs];
    const newStatus = (currentStatus === 'active' ? 'archived' : 'active') as Job['status'];

    const updated = jobs.map(job =>
      job.id === id ? { ...job, status: newStatus } : job
    );
    setJobs(updated);

    try {
      await jobsApi.patchJob(id, { status: newStatus });
    } catch {
      setJobs(backup);
      alert('Error: Could not update job status. Reverting changes.');
    }
  };

  return {
    jobs,
    isLoading,
    currentPage,
    totalPages,
    filters,
    allTags,
    handleFilterChange,
    handlePageChange,
    handleCreateJob,
    handleUpdateJob,
    handleArchive,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
  };
};
