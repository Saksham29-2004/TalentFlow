import React, { useState, useEffect } from 'react';


 import type { Job,JobStatus } from '@/data/JobsData/Jobs.types';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Job | Omit<Job, 'id'>) => void;
  initialData: Job | null;
  allTags: string[];
}

const defaultFormData: Omit<Job, 'id'> = {
  title: '',
  status: 'active',
  tags: [],
  order: 0,
};

const JobForm: React.FC<JobFormProps> = ({ isOpen, onClose, onSubmit, initialData, allTags }) => {
  const [formData, setFormData] = useState<Omit<Job, 'id'>>(defaultFormData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
       
        const { id, ...initialFormData } = initialData;
        setFormData(initialFormData);
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      // Handle different input types appropriately
      let processedValue: string | number = value;
      
      if (type === 'number') {
        processedValue = Number(value);
      }
      
      return {
        ...prev,
        [name]: name === 'status' ? value as JobStatus : processedValue,
      };
    });
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => {
      const currentTags = prev.tags;
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all required fields have values
    const submitData = {
      title: formData.title || '',
      status: formData.status || 'active',
      tags: formData.tags || [],
      order: formData.order || 0,
    };
    
    if (initialData) {
      onSubmit({ ...submitData, id: initialData.id });
    } else {
      onSubmit(submitData);
    }
  };

  if (!isOpen) return null;

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
      <div 
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-lg mx-4 transform transition-all duration-300 animate-scale-in border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-8 pb-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-slate-800">
                {isEditMode ? 'Edit Job' : 'Create New Job'}
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-slate-600 mb-8">
            {isEditMode ? 'Update job information and settings' : 'Fill in the details to create a new job posting'}
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {/* Job Title */}
          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-semibold mb-3" htmlFor="title">
              Job Title
            </label>
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 placeholder-slate-400"
                required
              />
            </div>
          </div>
          
          {/* Status */}
          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-semibold mb-3" htmlFor="status">
              Job Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 cursor-pointer"
            >
              <option value="active">🟢 Active</option>
              <option value="inactive">⚫ Inactive</option>
              <option value="pending">🟡 Pending</option>
            </select>
          </div>
          
          {/* Tags */}
          <div className="mb-8">
            <label className="block text-slate-700 text-sm font-semibold mb-3">
              Job Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    formData.tags.includes(tag)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Selected tags:</span> {formData.tags.join(', ')}
                </p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {isEditMode ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;