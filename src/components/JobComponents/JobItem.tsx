import React from 'react';
import { Link } from 'react-router-dom';
import type { Job } from '@/data/JobsData/Jobs.types'; 

interface JobItemProps {
  job: Job;
  index: number;
  onArchive: (id: number, currentStatus: string) => void;
  onEdit: (job: Job) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

const JobItem: React.FC<JobItemProps> = ({
  job,
  index,
  onArchive,
  onEdit,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(job);
  };

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onArchive(job.id, job.status);
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-move group ${
        job.status === 'archived' ? 'opacity-70 bg-gray-50 border-gray-300' : 'hover:border-blue-300'
      }`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="flex justify-between items-start gap-6">
        {/* Main Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start gap-4 mb-3">
            {/* Job Icon */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
              job.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <svg 
                className={`w-6 h-6 ${job.status === 'active' ? 'text-blue-600' : 'text-gray-500'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
              </svg>
            </div>
            
            {/* Title and Status */}
            <div className="flex-grow min-w-0">
              <Link to={`/jobs/${job.id}`} className="no-underline group-hover:no-underline">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                  {job.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  job.status === 'active' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {job.status}
                </span>
                <span className="text-sm text-gray-500">
                  • Job ID: #{job.id}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Additional Info */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Created recently</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>0 applications</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleEditClick}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          
          <button
            className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
              job.status === 'active'
                ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500'
                : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
            }`}
            onClick={handleArchiveClick}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {job.status === 'active' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 10-10" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              )}
            </svg>
            {job.status === 'active' ? 'Archive' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobItem;
