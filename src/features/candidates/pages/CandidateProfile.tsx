import {useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Candidate } from '../../../types/candidate.types';
import Note from '../components/Note';
import NoteInput from '../components/NoteInput';

import { getCandidateById, addNoteToCandidate, deleteNoteFromCandidate } from '../../../services/api/candidateService';

const CandidateProfile: React.FC = () => {
  const { jobId, candidateId } = useParams<{ jobId: string; candidateId: string }>();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (candidateId) {
      const loadCandidate = async () => {
        setIsLoading(true);
        try {
          const fetchedCandidate = await getCandidateById(parseInt(candidateId, 10));
          setCandidate(fetchedCandidate);
        } catch (error) {
          console.error("Failed to fetch candidate:", error);
          setCandidate(null);
        } finally {
          setIsLoading(false);
        }
      };
      loadCandidate();
    }
  }, [candidateId]);

  const handleSaveNote = async (noteText: string) => {
    if (!candidate) return;

    try {
      // Call the API and update the state with the returned candidate, which includes the new note.
      const updatedCandidate = await addNoteToCandidate(candidate.id, noteText);
      setCandidate(updatedCandidate);
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("Error: Could not save note.");
    }
  };

  const handleDeleteNote = async (noteIdToDelete: number) => {
    if (!candidate) return;

    // Store the original state in case we need to roll back
    const originalCandidate = { ...candidate };
    
    // Optimistically remove the note from the UI for a fast response
    const updatedNotes = (candidate.notes || []).filter(note => note.noteId !== noteIdToDelete);
    setCandidate({ ...candidate, notes: updatedNotes });

    // Call the API to delete the note from the database
    try {
      await deleteNoteFromCandidate(candidate.id, noteIdToDelete);
    } catch (error) {
      console.error("Failed to delete note:", error);
      // If the API call fails, revert the UI to its original state
      setCandidate(originalCandidate);
      alert("Error: Could not delete the note.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading candidate...</div>;
  }

  if (!candidate) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-semibold">Candidate not found.</p>
        <Link to={`/jobs/${jobId}/candidates`} className="text-blue-500 hover:underline mt-4 block">
          &larr; Back to Candidate List
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/jobs/${jobId}/candidates`} className="text-blue-600 hover:underline">&larr; Back to List</Link>
        <span className="text-gray-300">|</span>
        <Link to={`/jobs/${jobId}/candidates/kanbanview`} className="text-blue-600 hover:underline">Back to Kanban</Link>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-12">
        <h1 className="text-4xl font-bold text-gray-900">{candidate.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{candidate.email}</p>
        <p className="mt-4">
          Current Stage:
          <span className="ml-2 font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {candidate.currentStage}
          </span>
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-8 border-b pb-2">Timeline</h2>
        <div className="relative">
          <div className="absolute left-0 top-2 h-1 w-full bg-blue-200"></div>
          <div className="relative flex justify-between">
            {candidate.stageHistory.map((entry, index) => (
              <div key={index} className="flex flex-col items-center text-center w-40">
                <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white z-10"></div>
                <p className="font-bold text-lg mt-2">{entry.stage}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(entry.timestamp).toLocaleString('en-IN', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Notes</h2>
        <NoteInput onSave={handleSaveNote} />
        <div className="mt-6 space-y-4">
          {candidate.notes && candidate.notes.length > 0 ? (
            candidate.notes.map((note) => (
              <Note
                key={note.noteId}
                text={note.text}
                timestamp={note.timestamp}
                onDelete={() => handleDeleteNote(note.noteId)}
              />
            ))
          ) : (
            <p className="text-gray-500 italic p-4">No notes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;

