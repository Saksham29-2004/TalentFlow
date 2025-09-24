import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as jobsApi from '../../../services/api/jobService';
import type { Job } from '../../../types/job.types'; 

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      setIsLoading(true);
      try {
        const fetchedJob = await jobsApi.fetchJobById(parseInt(jobId));
        setJob(fetchedJob);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleDelete = async () => {
    if (!jobId) return;
    const isConfirmed = window.confirm("Are you sure you want to delete this job? This action cannot be undone.");
    if (isConfirmed) {
      try {
        await jobsApi.deleteJob(parseInt(jobId));
        alert("Job deleted successfully.");
        navigate('/jobs/jobsList');
      } catch (error) {
        console.error("Failed to delete job:", error);
        alert("Error: Could not delete the job.");
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading job details...</div>;
  }

  if (!job) {
    return <div className="p-8 text-center text-red-500">Job not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* --- THIS IS THE FIX --- */}
      {/* A "Back to All Jobs" link is now present for consistent navigation. */}
      <div className="mb-6">
          <Link to="/jobs/jobsList" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w.3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to All Jobs
          </Link>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{job.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                    <span className={`capitalize inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${job.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                        {job.status}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 shadow-sm">
                            {tag}
                        </span>
                    ))}
                </div>
              </div>
          </div>
      </div>
      
      {/* Management Actions - Row Layout */}
      <div className="space-y-4">
        {/* Candidates Row */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
          <div className="flex items-center justify-between p-6">
          
            <div>
              <h2 className="text-xl font-semibold mb-1 text-gray-800">Candidates</h2>
              <p className="text-gray-600 mb-4 text-sm">View and manage the candidates who have applied for this role.</p>
              <Link to={`/jobs/${jobId}/candidates`} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:underline">
                View Candidates &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow group">
          <div className="flex items-start gap-4">
           
            <div>
              <h2 className="text-xl font-semibold mb-1 text-gray-800">Assessments</h2>
              <p className="text-gray-600 mb-4 text-sm">Manage skills assessments for this role.</p>
              <Link to={`/jobs/${jobId}/assessment-builder`} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:underline">
                Manage Assessments &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-red-700"></h3>
        <div className="mt-2 flex justify-between items-center bg-red-50 p-4 rounded-lg">
           <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Delete Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

