import React from 'react';

interface JobFiltersProps {
  filters: {
    search: string;
    status: string;
    tags: string[]; 
  };
  allTags: string[];
  onFilterChange: (filterName: 'search' | 'status' | 'tags', value: any) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ filters, allTags, onFilterChange }) => {
  const handleTagClick = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    
    onFilterChange('tags', newTags);
  };

  const clearAllTags = () => {
    onFilterChange('tags', []);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Jobs</h3>
        
        {/* Search and Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search jobs by title..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Jobs</option>
            <option value="archived">Archived Jobs</option>
          </select>
        </div>
      </div>
      
      {/* Tags Section */}
      {allTags.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Filter by Tags
            </h4>
            {filters.tags.length > 0 && (
              <button
                onClick={clearAllTags}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 hover:bg-blue-50 rounded-md transition-colors duration-200"
              >
                Clear All ({filters.tags.length})
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const isSelected = filters.tags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-200'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  <span className="mr-1.5">#</span>
                  {tag}
                  {isSelected && (
                    <svg className="ml-1.5 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          
          {filters.tags.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Active filters:</span> {filters.tags.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobFilters;