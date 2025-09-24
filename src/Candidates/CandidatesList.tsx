import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCandidates } from '../hooks/CandidatesHook/useCandidates';
import type { Candidate } from '../types/candidate.types';

const getStageBadgeColor = (stage: Candidate['currentStage']) => {
    switch (stage) {
        case 'Hired':
            return 'bg-green-50 text-green-700 border-green-200';
        case 'Rejected':
            return 'bg-red-50 text-red-700 border-red-200';
        case 'Interview':
            return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'Screening':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'Applied':
        default:
            return 'bg-blue-50 text-blue-700 border-blue-200';
    }
};


const CandidatesList: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = jobId ? parseInt(jobId, 10) : undefined;

  const {
    isLoading,
    searchedCandidates,
    searchTerm,
    setSearchTerm,
    stageFilter,
    setStageFilter,
  } = useCandidates(numericJobId);

  // 1. Create a ref for the scrolling element
  const parentRef = React.useRef(null);

  // 2. Set up the virtualizer hook with larger size for enhanced cards
  const rowVirtualizer = useVirtualizer({
    count: searchedCandidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180, // Increased height for enhanced cards
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link 
            to={`/jobs/${jobId}`} 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Job Details
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Candidates
              </h1>
              <p className="text-gray-600">
                Track and manage all candidates for this job position. Click any profile to view detailed information.
              </p>
            </div>
            <Link 
              to={`/jobs/${jobId}/candidates/kanbanview`} 
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 hover:border-gray-400"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Kanban View
            </Link>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or skills..."
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <select
              value={stageFilter || 'all'}
              onChange={(e) => setStageFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm min-w-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="all">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          {/* Results Count */}
          {!isLoading && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {searchedCandidates.length > 0 ? (
                  <>
                    Showing <span className="font-semibold">{searchedCandidates.length}</span> candidate{searchedCandidates.length !== 1 ? 's' : ''}
                    {stageFilter && stageFilter !== 'all' && (
                      <> in <span className="font-semibold">{stageFilter}</span> stage</>
                    )}
                  </>
                ) : (
                  'No candidates found matching your criteria'
                )}
              </p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading candidates...</p>
            </div>
          ) : searchedCandidates && searchedCandidates.length > 0 ? (
            <div ref={parentRef} className="max-h-[70vh] overflow-auto">
              <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                {rowVirtualizer.getVirtualItems().map(virtualItem => {
                  const candidate = searchedCandidates[virtualItem.index];
                  return (
                    <div
                      key={virtualItem.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      className="px-1"
                    >
                      <Link 
                        to={`/jobs/${jobId}/candidates/${candidate.id}`} 
                        className="block no-underline text-current group"
                      >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 p-6 mx-2 my-2 group-hover:bg-blue-50">
                          <div className="flex items-center gap-6">
                            {/* Professional Avatar */}
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                <span className="text-white font-bold text-xl">
                                  {candidate.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              {/* Online Status Indicator */}
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            
                            {/* Candidate Information */}
                            <div className="flex-grow min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div className="min-w-0 flex-grow">
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                                    {candidate.name}
                                  </h3>
                                  <p className="text-gray-600 truncate text-sm font-medium">
                                    {candidate.email}
                                  </p>
                                </div>
                                
                                {/* Stage Badge */}
                                <span className={`ml-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border ${getStageBadgeColor(candidate.currentStage)} shadow-sm`}>
                                  <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                                  {candidate.currentStage}
                                </span>
                              </div>

                              {/* Additional Info Row */}
                              <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Applied 2 days ago</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Screening Score: 85%</span>
                                </div>
                              </div>

                              {/* Skills/Tags */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {['React', 'TypeScript', 'Node.js'].map((skill, index) => (
                                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border">
                                    {skill}
                                  </span>
                                ))}
                              </div>

                              {/* Progress Bar */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500 min-w-0">Progress:</span>
                                <div className="flex-grow bg-gray-200 rounded-full h-2">
                                  <div className={`h-2 rounded-full transition-all duration-300 ${
                                    candidate.currentStage === 'Applied' ? 'bg-blue-500 w-1/5' :
                                    candidate.currentStage === 'Screening' ? 'bg-yellow-500 w-2/5' :
                                    candidate.currentStage === 'Interview' ? 'bg-purple-500 w-3/5' :
                                    candidate.currentStage === 'Hired' ? 'bg-green-500 w-full' :
                                    'bg-red-500 w-4/5'
                                  }`}></div>
                                </div>
                                <span className="text-xs font-medium text-gray-500">
                                  {candidate.currentStage === 'Applied' ? '20%' :
                                   candidate.currentStage === 'Screening' ? '40%' :
                                   candidate.currentStage === 'Interview' ? '60%' :
                                   candidate.currentStage === 'Hired' ? '100%' : '80%'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Action Arrow */}
                            <div className="flex-shrink-0 ml-4">
                              <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No Candidates Found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                {stageFilter && stageFilter !== 'all' 
                  ? `No candidates found in the ${stageFilter} stage matching your search criteria. Try adjusting your filters or search terms.`
                  : 'No candidates match your current search criteria. Try adjusting your filters or search terms to find relevant candidates.'
                }
              </p>
              {(searchTerm || (stageFilter && stageFilter !== 'all')) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStageFilter('all');
                  }}
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidatesList;