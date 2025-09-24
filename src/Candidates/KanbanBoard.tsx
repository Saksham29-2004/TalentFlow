import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';

import type { Candidate } from '../types/candidate.types';
import { useCandidates } from '../hooks/CandidatesHook/useCandidates';
import * as candidateApi from '../api/candidatesApi/candidateApi';

import KanbanColumn from '../components/CandidateComponents/KanbanColumn';
import CandidateCard from '../components/CandidateComponents/CandidateCard';
import '../components/CandidateComponents/kanban-animations.css';

const stages = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'];

const KanbanBoard: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = jobId ? parseInt(jobId, 10) : undefined;

  const { searchedCandidates, setAllCandidates, isLoading } = useCandidates(numericJobId);
  
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [columnSearchTerms, setColumnSearchTerms] = useState<{ [key: string]: string }>({});

  const candidatesByStage = useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage] = (searchedCandidates || []) 
        .filter(c => c.currentStage === stage)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return acc;
    }, {} as { [key: string]: Candidate[] });
  }, [searchedCandidates]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!searchedCandidates) return;

    const candidate = searchedCandidates.find(c => c.id.toString() === active.id.toString());
    setActiveCandidate(candidate || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);
    
    if (!over || !searchedCandidates) return;

    const activeId = Number(active.id);
    const originalCandidates = [...searchedCandidates]; 
    const activeCandidate = originalCandidates.find(c => c.id === activeId);
    
    if (!activeCandidate) return;

    const overId = over.id.toString();
    const activeContainer = activeCandidate.currentStage;

    let overContainer: string | undefined;
    if (stages.includes(overId)) {
      overContainer = overId;
    } else {
      const overCandidate = originalCandidates.find(c => c.id.toString() === overId);
      overContainer = overCandidate?.currentStage;
    }

    if (!overContainer || activeContainer === overContainer) {
      return;
    }
    
    const updatedCandidate: Candidate = {
      ...activeCandidate,
      currentStage: overContainer as Candidate['currentStage'],
      stageHistory: [
        ...activeCandidate.stageHistory,
        { stage: overContainer, timestamp: new Date().toISOString() }
      ]
    };

    setAllCandidates(prev =>
      (prev || []).map(c => (c.id === updatedCandidate.id ? updatedCandidate : c))
    );

    try {
        await candidateApi.updateCandidate(updatedCandidate);
    } catch (error) {
        console.error("Failed to update candidate stage:", error);
        setAllCandidates(originalCandidates); 
    }
  };

  const handleColumnSearchChange = (stage: string, value: string) => {
    setColumnSearchTerms(prev => ({ ...prev, [stage]: value }));
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Kanban Board...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Header */}
      <div className="flex-shrink-0 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Breadcrumb */}
          <div className="mb-4">
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
          
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                Candidates
              </h1>
              <p className="text-blue-100 text-lg drop-shadow-sm">
                Visualize and manage candidates through different hiring stages. Drag and drop to move candidates between stages.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to={`/jobs/${jobId}/candidates`} 
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl shadow-2xl hover:bg-white/20 hover:border-white/30 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                List View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-8 relative z-10">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="h-full flex gap-10 min-w-max pb-6">
            {stages.map((stage, index) => (
              <div key={stage} className={`kanban-float column-${index + 1}`}>
                <KanbanColumn
                  id={stage}
                  title={stage}
                  candidates={candidatesByStage[stage] || []}
                  searchTerm={columnSearchTerms[stage] || ''}
                  onSearchChange={(value) => handleColumnSearchChange(stage, value)}
                />
              </div>
            ))}
          </div>
          
          <DragOverlay>
            {activeCandidate ? (
              <CandidateCard candidate={activeCandidate} isDragOverlay={true} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;

