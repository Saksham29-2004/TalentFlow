import React from 'react';

interface NoteProps {
  text: string;
  timestamp: string;
  onDelete: () => void;
}

const Note: React.FC<NoteProps> = ({ text, timestamp, onDelete }) => {
  const renderTextWithMentions = (noteText: string) => {
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = noteText.split(mentionRegex);

    return parts.map((part, index) => {
      if (index % 3 === 1) {
        return (
          <span key={index} className="font-semibold bg-blue-100 text-blue-800 rounded px-1 py-0.5">
            @{part}
          </span>
        );
      }
      if (index % 3 === 0) {
        return part;
      }
      return null;
    });
  };

  return (
    <div className="group flex items-start gap-4 p-4">
     
      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">
        HR
      </div>
      <div className="flex-grow bg-white p-4 rounded-lg border border-gray-200 transition-shadow duration-200 hover:shadow-md relative">
       
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 bg-red-500 hover:bg-red-50 hover:text-red-600 opacity-100 group-hover:opacity-100 transition-all"
          aria-label="Delete note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <div className="flex items-center mb-1">
            <p className="font-semibold text-sm text-gray-800">HR Team</p>
            <p className="text-xs text-gray-400 ml-2">
              {new Date(timestamp).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
        </div>
        
        <p className="text-gray-700 whitespace-pre-wrap">{renderTextWithMentions(text)}</p>
      </div>
    </div>
  );
};

export default Note;