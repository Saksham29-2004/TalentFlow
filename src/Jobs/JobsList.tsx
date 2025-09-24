import React, { useState } from 'react';
import type { Job } from '../data/JobsData/Jobs.types'; 
import { useJobs } from '../hooks/JobsHooks/useJobs';
import JobItem from '../components/JobComponents/JobItem';
import Pagination from '../components/pagination';
import JobFilters from './JobFilters';
import JobForm from '../components/JobComponents/JobForm';

const JobsList: React.FC = () => {
  const {
    jobs,
    isLoading,
    currentPage,
    totalPages,
    filters,
    allTags,
    handleFilterChange,
    handleArchive,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
    handlePageChange,
    handleCreateJob,
    handleUpdateJob,
  } = useJobs();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleFormSubmit = (formData: Job | Omit<Job, 'id'>) => {
    if ('id' in formData) {
      handleUpdateJob(formData);
    } else {
      handleCreateJob(formData);
    }
    handleCloseModal();
  };

  const handleArchiveClick = (id: number, status: string) => {
    handleArchive(id, status as Job['status']);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                jobs
              </h1>
              <p className="text-gray-600">
                Create, manage, and track all your job postings in one place.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-6 py-3 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2 -ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Job
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-8">
          <JobFilters
            filters={filters}
            allTags={allTags}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Job List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="space-y-4">
                {jobs.map((job, idx) => (
                  <JobItem
                    key={job.id}
                    job={job}
                    index={idx}
                    onArchive={handleArchiveClick}
                    onEdit={handleOpenEditModal}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDrop}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  isLoading={isLoading}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-12">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Jobs Found
                </h3>
                <p className="text-gray-600 mb-6">
                  No jobs match your current search and filter criteria.
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your First Job
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Job Form Modal */}
        <JobForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          initialData={editingJob}
          allTags={allTags}
        />
      </div>
    </div>
  );
};

export default JobsList;