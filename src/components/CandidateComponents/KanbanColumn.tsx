import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CandidateCard from './CandidateCard';
import type { Candidate } from '../../types/candidate.types';

interface KanbanColumnProps {
  id: string;
  title: string;
  candidates: Candidate[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const getStageHeaderStyle = (stage: string) => {
    switch (stage) {
        case 'Hired': return 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-emerald-200';
        case 'Rejected': return 'bg-gradient-to-br from-red-400 via-rose-500 to-pink-600 shadow-rose-200';
        case 'Interview': return 'bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 shadow-violet-200';
        case 'Screening': return 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 shadow-amber-200';
        case 'Applied': default: return 'bg-gradient-to-br from-blue-400 via-sky-500 to-cyan-600 shadow-sky-200';
    }
};

const getColumnBackground = (stage: string) => {
    switch (stage) {
        case 'Hired': return 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50/30';
        case 'Rejected': return 'bg-gradient-to-b from-rose-50 via-white to-rose-50/30';
        case 'Interview': return 'bg-gradient-to-b from-violet-50 via-white to-violet-50/30';
        case 'Screening': return 'bg-gradient-to-b from-amber-50 via-white to-amber-50/30';
        case 'Applied': default: return 'bg-gradient-to-b from-sky-50 via-white to-sky-50/30';
    }
};

const getStagePattern = (stage: string) => {
    switch (stage) {
        case 'Hired': return 'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_80%,_rgba(16,185,129,0.1),_transparent_50%)] before:pointer-events-none';
        case 'Rejected': return 'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_80%_20%,_rgba(244,63,94,0.1),_transparent_50%)] before:pointer-events-none';
        case 'Interview': return 'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.1),_transparent_50%)] before:pointer-events-none';
        case 'Screening': return 'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_80%_80%,_rgba(245,158,11,0.1),_transparent_50%)] before:pointer-events-none';
        case 'Applied': default: return 'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_20%,_rgba(14,165,233,0.1),_transparent_50%)] before:pointer-events-none';
    }
};

const getStageIcon = (stage: string) => {
    switch (stage) {
        case 'Hired': 
            return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
        case 'Rejected': 
            return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
        case 'Interview': 
            return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
        case 'Screening': 
            return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
        case 'Applied': default: 
            return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
    }
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  id, 
  title, 
  candidates, 
  searchTerm, 
  onSearchChange 
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const filteredCandidates = useMemo(() => {
    if (!searchTerm) return candidates;
    const lowercasedTerm = searchTerm.toLowerCase();
    return candidates.filter(c =>
      c.name.toLowerCase().includes(lowercasedTerm) ||
      c.email.toLowerCase().includes(lowercasedTerm)
    );
  }, [candidates, searchTerm]);

  const totalCount = candidates.length;
  const filteredCount = filteredCandidates.length;

  return (
    <div className={`w-full max-w-sm md:w-1/3 flex-shrink-0 rounded-2xl flex flex-col shadow-2xl transition-all duration-500 hover:shadow-3xl transform hover:-translate-y-1 relative overflow-hidden gradient-animate ${getColumnBackground(title)} ${getStagePattern(title)}`}>
      
      {/* Animated Header */}
      <div className={`p-6 ${getStageHeaderStyle(title)} shadow-2xl relative overflow-hidden gradient-animate`}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm shimmer-effect"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-white drop-shadow-lg transform transition-transform duration-300 hover:scale-110">
                {getStageIcon(title)}
              </div>
              <h3 className="font-bold text-xl capitalize text-white drop-shadow-lg tracking-wide">{title}</h3>
            </div>
            <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold shadow-lg border border-white/30">
              {searchTerm ? `${filteredCount} / ${totalCount}` : totalCount}
            </div>
          </div>
          
          <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full p-4 pl-12 text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/30 transition-all duration-300 shadow-inner"
              />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      </div>
      
      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto relative z-10 kanban-scroll">
        <SortableContext
          items={filteredCandidates.map(c => c.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div 
            ref={setNodeRef} 
            className={`p-6 space-y-4 min-h-full transition-all duration-500 ${
              isOver ? 'bg-white/30 backdrop-blur-md' : ''
            }`}
          >
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map(candidate => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))
            ) : (
              <div className={`text-center py-20 transition-all duration-500 ${
                isOver ? 'scale-105' : ''
              }`}>
                <div className={`border-3 border-dashed rounded-3xl p-8 transition-all duration-500 ${
                  isOver ? 'border-gray-400 bg-white/20 backdrop-blur-sm scale-105' : 'border-gray-300/50'
                }`}>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isOver ? 'bg-gray-200 scale-110' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-8 h-8 transition-colors duration-500 ${isOver ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className={`text-lg font-medium transition-colors duration-500 ${isOver ? 'text-gray-700' : 'text-gray-500'}`}>
                      {searchTerm ? 'No matching candidates' : 'Drop candidates here'}
                  </p>
                  <p className={`text-sm mt-2 transition-colors duration-500 ${isOver ? 'text-gray-600' : 'text-gray-400'}`}>
                      Drag and drop to organize your pipeline
                  </p>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
