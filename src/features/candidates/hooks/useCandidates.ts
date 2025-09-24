import { useState, useEffect, useMemo } from 'react';
import * as candidateApi from '../../../services/api/candidateService';
import type { Candidate } from '../../../types/candidate.types';


export const useCandidates = (jobId: number | undefined) => {
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stageFilter, setStageFilter] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // If there's no valid jobId, we clear the data and stop loading.
    if (!jobId) {
      setAllCandidates([]);
      setIsLoading(false);
      return;
    }

    const getCandidates = async () => {
      setIsLoading(true);
      try {
        // The API function expects a number and a string, which are guaranteed here.
        const data = await candidateApi.fetchCandidatesForJob(jobId, stageFilter);
        setAllCandidates(data);
      } catch (error) {
          console.error(`Failed to fetch candidates for job ${jobId}:`, error);
          setAllCandidates([]); // Safely reset to an empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    
    getCandidates();
  }, [jobId, stageFilter]);

  // Memoized filtering logic to improve performance.
  const searchedCandidates = useMemo(() => {
    if (!searchTerm) {
      return allCandidates;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return (allCandidates || []).filter(c =>
      c.name.toLowerCase().includes(lowercasedTerm) ||
      c.email.toLowerCase().includes(lowercasedTerm)
    );
  }, [allCandidates, searchTerm]);

  return {
    isLoading,
    searchedCandidates,
    searchTerm,
    setSearchTerm,
    stageFilter,
    setStageFilter,
    setAllCandidates,
  };
};

