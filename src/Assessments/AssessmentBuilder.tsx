import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Assessment, Section } from '../data/AssessmentFunctions/assessment';
import SectionEditor from '../components/AssessmentComponents/SectionEditor';
import AssessmentPreview from '../components/AssessmentComponents/AssessmentPreview';
import { useAssessmentBuilder } from '../hooks/AssessmentHooks/useAssessmentBuilder';
import './assessment-animations.css';

const SaveButton: React.FC<{ isDirty: boolean; onClick: () => void; }> = ({ isDirty, onClick }) => {
    return (
        <button 
          onClick={onClick} 
          disabled={!isDirty} 
          className={`group relative inline-flex items-center justify-center px-6 py-3 font-semibold rounded-2xl shadow-lg transition-all duration-300 ${
            isDirty 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <svg className={`w-5 h-5 mr-2 transition-transform ${isDirty && 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
          <span className="relative">Save Changes</span>
        </button>
    );
};

const AssessmentBuilder: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { 
    assessments,
    setAssessments,
    isLoading, 
    handleCreateAssessment,
    handleUpdateAssessment,
    handleDeleteAssessment,
  } = useAssessmentBuilder(jobId);

  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleSelectForEdit = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsDirty(false); 
  };
  
  const handleCreateAndEdit = async () => {
      const newAssessment = await handleCreateAssessment();
      if (newAssessment) {
          handleSelectForEdit(newAssessment);
      }
  };

  const handleLocalUpdate = (updatedAssessment: Assessment) => {
    setSelectedAssessment(updatedAssessment);
    setAssessments(prev => prev.map(a => a.id === updatedAssessment.id ? updatedAssessment : a));
    setIsDirty(true);
  };

  const handleSaveChanges = () => {
    if (selectedAssessment) {
      handleUpdateAssessment(selectedAssessment);
      setIsDirty(false); 
    }
  };
  
  const handleAddSection = () => {
    if (!selectedAssessment) return;
    const newSection: Section = { id: `sec-${Date.now()}`, title: 'New Section', questions: [] };
    handleLocalUpdate({ ...selectedAssessment, sections: [...selectedAssessment.sections, newSection] });
  };

  const handleUpdateSection = (updatedSection: Section) => {
    if (!selectedAssessment) return;
    handleLocalUpdate({
      ...selectedAssessment,
      sections: selectedAssessment.sections.map(s => s.id === updatedSection.id ? updatedSection : s),
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!selectedAssessment) return;
    handleLocalUpdate({
      ...selectedAssessment,
      sections: selectedAssessment.sections.filter(s => s.id !== sectionId),
    });
  };

  const handleTitleChange = (newTitle: string) => {
    if (!selectedAssessment) return;
    handleLocalUpdate({ ...selectedAssessment, title: newTitle });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Assessments...</div>;
  }
  
  if (selectedAssessment) {
    const allQuestions = selectedAssessment.sections.flatMap(s => s.questions);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-200/20 to-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-40 h-40 bg-gradient-to-br from-cyan-200/20 to-blue-300/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-purple-300/20 rounded-full blur-2xl"></div>
        </div>

        {/* Elegant Header */}
        <div className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setSelectedAssessment(null)} 
                  className="group flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-gray-600 hover:text-gray-800 hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Back to List</span>
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      Assessment Studio
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Interactive Content Builder</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${isDirty ? 'bg-amber-400' : 'bg-green-400'}`}></div>
                  <span className="text-xs font-medium text-gray-600">
                    {isDirty ? 'Unsaved changes' : 'All changes saved'}
                  </span>
                </div>
                
                <SaveButton isDirty={isDirty} onClick={handleSaveChanges} />
              </div>
            </div>
          </div>
        </div>
        {/* Main Editor Area */}
        <div className="flex-1 flex relative z-10">
          {/* Left Panel - Editor */}
          <div className="w-1/2 flex flex-col">
            <div className="h-full flex flex-col p-8 space-y-6">
              {/* Assessment Title */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                  <label className="block text-sm font-semibold text-gray-600 mb-3">Assessment Title</label>
                  <input 
                    type="text" 
                    value={selectedAssessment.title} 
                    onChange={(e) => handleTitleChange(e.target.value)} 
                    className="w-full text-2xl font-bold bg-transparent border-0 focus:outline-none text-gray-800 placeholder-gray-400 resize-none"
                    placeholder="Enter assessment title..."
                  />
                </div>
              </div>

              {/* Sections Container */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-custom">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Content Sections
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    {selectedAssessment.sections.length} sections
                  </span>
                </div>
                
                {selectedAssessment.sections.map((section) => (
                  <div key={section.id} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/10 to-blue-200/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
                      <div className="p-1">
                        <SectionEditor 
                          section={section} 
                          allQuestions={allQuestions} 
                          updateSection={handleUpdateSection} 
                          deleteSection={() => handleDeleteSection(section.id)} 
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Section Button */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <button 
                    onClick={handleAddSection} 
                    className="relative w-full flex items-center justify-center gap-3 py-6 bg-white/40 backdrop-blur-sm text-gray-600 font-semibold border-2 border-dashed border-gray-200 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span>Add New Section</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Right Panel - Live Preview */}
          <div className="w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-blue-50/40 backdrop-blur-sm"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
            
            <div className="relative h-full flex flex-col p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Live Preview</h2>
                    <p className="text-sm text-gray-500">Real-time assessment view</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 font-medium">Live</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
                  <AssessmentPreview assessment={selectedAssessment} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 relative overflow-hidden">
      {/* Crazy Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-white animate-ping`}
              style={{
                width: Math.random() * 100 + 20 + 'px',
                height: Math.random() * 100 + 20 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's',
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Navigation */}
      <div className="fixed top-6 left-6 right-6 z-50">
        <div className="bg-black/80 backdrop-blur-xl rounded-full p-4 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between">
            <Link 
              to={`/jobs/${jobId}`}
              className="flex items-center space-x-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full text-white font-bold transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>BACK TO JOB</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-black text-white mb-1">{assessments.length}</div>
                <div className="text-xs text-white/70 uppercase tracking-widest">ASSESSMENTS</div>
              </div>
              
              <button 
                onClick={handleCreateAndEdit}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black rounded-full shadow-xl transform hover:scale-110 transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-lg">CREATE NOW</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Hexagon Layout */}
      <div className="pt-32 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-8xl font-black text-white mb-4 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              ASSESSMENTS
            </h1>
            <p className="text-2xl text-white/90 font-bold uppercase tracking-wider">
              SKILLS EVALUATION CENTER
            </p>
          </div>

          {/* Assessment Cards in Hexagon Pattern */}
          {assessments.length > 0 ? (
            <div className="relative">
              {/* Center hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl z-10">
                <div className="text-center">
                  <div className="text-2xl font-black text-gray-900">{assessments.length}</div>
                  <div className="text-xs text-gray-600 uppercase font-bold">Total</div>
                </div>
              </div>

              {/* Assessment cards in circular pattern */}
              <div className="relative w-full h-96">
                {assessments.map((assessment, index) => {
                  const angle = (index * 360) / assessments.length;
                  const radius = 200;
                  const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                  const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                  
                  const colors = [
                    'from-purple-600 to-blue-600',
                    'from-green-500 to-teal-500',
                    'from-pink-500 to-rose-500',
                    'from-yellow-400 to-red-500',
                    'from-indigo-500 to-purple-600',
                    'from-cyan-400 to-blue-500'
                  ];

                  return (
                    <div
                      key={assessment.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      }}
                    >
                      <div className="transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                        <div className={`w-40 h-40 bg-gradient-to-br ${colors[index % colors.length]} rounded-3xl p-6 shadow-2xl border-4 border-white/20 hover:border-white/40 cursor-pointer`}>
                          <div className="transform" style={{ transform: `rotate(-${angle}deg)` }}>
                            <div className="text-center h-full flex flex-col justify-between">
                              <div>
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                  <span className="text-2xl font-black text-white">#{index + 1}</span>
                                </div>
                                <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-2">
                                  {assessment.title}
                                </h3>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex justify-center space-x-2">
                                  <button 
                                    onClick={() => handleSelectForEdit(assessment)}
                                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <Link 
                                    to={`/jobs/${jobId}/assessment-preview/${assessment.id}`}
                                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </Link>
                                </div>
                                <div className="text-xs text-white/70 font-semibold">
                                  {assessment.sections.length}S • {assessment.sections.reduce((total, section) => total + section.questions.length, 0)}Q
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border-8 border-dashed border-white/30">
                <svg className="w-20 h-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-4xl font-black text-white mb-4 uppercase">EMPTY SPACE</h3>
              <p className="text-xl text-white/80 mb-8 font-bold">
                NO ASSESSMENTS FOUND IN THE SYSTEM
              </p>
              <button 
                onClick={handleCreateAndEdit}
                className="px-12 py-4 bg-white text-red-500 font-black text-xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 uppercase"
              >
                START BUILDING
              </button>
            </div>
          )}

          {/* Bottom Stats Bar */}
          {assessments.length > 0 && (
            <div className="fixed bottom-6 left-6 right-6 z-50">
              <div className="bg-black/80 backdrop-blur-xl rounded-full p-4 border border-white/20">
                <div className="flex items-center justify-around text-center">
                  <div>
                    <div className="text-2xl font-black text-white">{assessments.length}</div>
                    <div className="text-xs text-white/70 uppercase font-bold">ASSESSMENTS</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">
                      {assessments.reduce((total, assessment) => 
                        total + assessment.sections.reduce((sectionTotal, section) => 
                          sectionTotal + section.questions.length, 0
                        ), 0
                      )}
                    </div>
                    <div className="text-xs text-white/70 uppercase font-bold">QUESTIONS</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">
                      {assessments.reduce((total, assessment) => total + assessment.sections.length, 0)}
                    </div>
                    <div className="text-xs text-white/70 uppercase font-bold">SECTIONS</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-green-400">100%</div>
                    <div className="text-xs text-white/70 uppercase font-bold">ACTIVE</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
        
        {/* Assessment List - Table Style */}
        {assessments.length > 0 ? (
          <div className="bg-gray-800/30 backdrop-blur border border-gray-700/50 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700/50 bg-gray-800/50">
              <h2 className="text-lg font-bold text-white">Assessment Library</h2>
            </div>
            
            <div className="divide-y divide-gray-700/30">
              {assessments.map((assessment, index) => (
                <div key={assessment.id} className="group hover:bg-gray-700/20 transition-colors duration-200">
                  <div className="flex items-center justify-between p-6">
                    {/* Left: Assessment Info */}
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        index % 3 === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                        index % 3 === 1 ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                        'bg-gradient-to-br from-green-500 to-teal-500'
                      } shadow-lg`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {assessment.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{assessment.sections.length} sections</span>
                          <span>•</span>
                          <span>{assessment.sections.reduce((total, section) => total + section.questions.length, 0)} questions</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Actions */}
                    <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Link 
                        to={`/jobs/${jobId}/assessment-preview/${assessment.id}`}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-sm font-medium">Preview</span>
                      </Link>
                      
                      <button 
                        onClick={() => handleSelectForEdit(assessment)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/30 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-600/50">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">No Assessments Found</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Start building your first assessment to evaluate candidate skills.
              </p>
              <button 
                onClick={handleCreateAndEdit}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Assessment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentBuilder;

