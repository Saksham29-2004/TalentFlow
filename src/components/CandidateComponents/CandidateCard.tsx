import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Candidate } from '../../types/candidate.types';
import { Link } from 'react-router-dom';

interface CandidateCardProps {
  candidate: Candidate;
  isDragOverlay?: boolean;
}

const getAvatarGradient = (name: string) => {
  const gradients = [
    'bg-gradient-to-br from-purple-400 to-pink-400',
    'bg-gradient-to-br from-blue-400 to-indigo-400', 
    'bg-gradient-to-br from-green-400 to-teal-400',
    'bg-gradient-to-br from-orange-400 to-red-400',
    'bg-gradient-to-br from-cyan-400 to-blue-400',
    'bg-gradient-to-br from-pink-400 to-rose-400',
    'bg-gradient-to-br from-indigo-400 to-purple-400',
    'bg-gradient-to-br from-teal-400 to-green-400',
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
};

const getCardAccent = (stage: string) => {
  switch (stage) {
    case 'Hired': return 'border-l-emerald-400 shadow-emerald-100';
    case 'Rejected': return 'border-l-rose-400 shadow-rose-100';
    case 'Interview': return 'border-l-violet-400 shadow-violet-100';
    case 'Screening': return 'border-l-amber-400 shadow-amber-100';
    case 'Applied': default: return 'border-l-sky-400 shadow-sky-100';
  }
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, isDragOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: candidate.id.toString(),
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms ease',
  };

  const cardContent = (
    <div className="relative">
      {/* Status indicator dot */}
      <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
      
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center space-x-4 flex-1">
          <div className={`w-12 h-12 ${getAvatarGradient(candidate.name)} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transform transition-transform duration-200 hover:scale-110`}>
            {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800 text-base truncate">{candidate.name}</h3>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-500 font-medium">ID: {candidate.id}</span>
            </div>
            <p className="text-sm text-gray-600 truncate mb-2">{candidate.email}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-gray-500">Applied today</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-gray-500">Hot lead</span>
              </div>
            </div>
          </div>
        </div>
        
        {!isDragOverlay && (
          <div
            className="drag-handle cursor-grab active:cursor-grabbing p-2.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200 flex-shrink-0 ml-2"
            {...listeners}
            {...attributes}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  const cardClasses = `bg-white border-l-4 ${getCardAccent(candidate.currentStage)} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden card-hover-bounce ripple-effect ${
    isDragging ? 'opacity-60 shadow-2xl scale-105 rotate-3' : ''
  } ${isDragOverlay ? 'rotate-6 shadow-3xl cursor-grabbing scale-110 ring-4 ring-blue-200 pulse-glow-effect' : ''}`;

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      style={style}
      className={cardClasses}
    >
      {/* Subtle background pattern with shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-gray-50/30 pointer-events-none shimmer-effect"></div>
      
      {isDragOverlay ? (
        <div className="p-5 relative z-10">{cardContent}</div>
      ) : (
        <Link
          to={`/jobs/${candidate.jobId}/candidates/${candidate.id}`}
          className="block no-underline text-current p-5 relative z-10"
        >
          {cardContent}
        </Link>
      )}
    </div>
  );
};

export default CandidateCard;

