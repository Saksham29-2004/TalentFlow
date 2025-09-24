import React from 'react';
import type { Section, Question } from '../../data/AssessmentFunctions/assessment';
import QuestionEditor from './QuestionEditor';

interface SectionEditorProps {
  section: Section;
  allQuestions: Question[]; 
  updateSection: (updatedSection: Section) => void;
  deleteSection: () => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, allQuestions, updateSection, deleteSection }) => {
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      isRequired: false,
      details: { type: 'short-text' },
    };
    updateSection({ ...section, questions: [...section.questions, newQuestion] });
  };

  const handleDeleteQuestion = (questionIdToDelete: string) => {
    updateSection({ ...section, questions: section.questions.filter(q => q.id !== questionIdToDelete) });
  };
  
  const handleUpdateQuestion = (updatedQuestion: Question) => {
    updateSection({ ...section, questions: section.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q) });
  };

  const handleTitleChange = (newTitle: string) => {
    updateSection({ ...section, title: newTitle });
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm relative group">
      <button 
        onClick={deleteSection} 
        className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" 
        aria-label="Delete section"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <input 
        type="text" 
        value={section.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="text-xl font-bold text-gray-800 border-b w-full p-1 mb-4" 
        placeholder="Section Title" 
      />
      
      <div className="pl-4 border-l-2 border-gray-200 space-y-4">
        {section.questions.map(q => (
          <QuestionEditor 
            key={q.id} 
            question={q} 
            allQuestions={allQuestions} 
            updateQuestion={handleUpdateQuestion}
            deleteQuestion={() => handleDeleteQuestion(q.id)} 
          />
        ))}
      </div>
      
      <button onClick={handleAddQuestion} className="mt-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm">
        + Add Question
      </button>
    </div>
  );
};

export default SectionEditor;