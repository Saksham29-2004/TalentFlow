import type { Candidate } from '../../types/candidate.types';

const STAGES = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'] as const;

const FIRST_NAMES = [
    'Alexandra', 'Benjamin', 'Catherine', 'Daniel', 'Elena', 'Felix', 'Gabriela', 'Hassan',
    'Isabella', 'James', 'Kiran', 'Lucas', 'Maria', 'Nathan', 'Olivia', 'Priya',
    'Quinn', 'Raj', 'Sophia', 'Thomas', 'Uma', 'Viktor', 'Wei', 'Xander',
    'Yasmin', 'Zoe', 'Adrian', 'Beatrice', 'Carlos', 'Diana', 'Eric', 'Fatima'
];

const LAST_NAMES = [
    'Anderson', 'Brown', 'Chen', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris',
    'Johnson', 'Kumar', 'Lee', 'Martinez', 'Nguyen', 'O\'Connor', 'Patel', 'Rodriguez',
    'Smith', 'Thompson', 'Williams', 'Zhang', 'Miller', 'Wilson', 'Moore', 'Taylor',
    'Jackson', 'White', 'Martin', 'Clark', 'Lewis', 'Walker', 'Hall', 'Young'
];

export function generateSeedCandidatesWithJobIds(actualJobIds: number[]): Omit<Candidate, 'id'>[] {
    const candidates: Omit<Candidate, 'id'>[] = [];
    const totalCandidates = 1000; // Exactly 1000 candidates as specified
    const totalJobs = actualJobIds.length;
    
    console.log('🔥 CANDIDATE GENERATION: Using actual job IDs:', actualJobIds);
    
    // Ensure every job gets at least 3 candidates by distributing them first
    const guaranteedCandidatesPerJob = 3;
    const guaranteedTotal = totalJobs * guaranteedCandidatesPerJob;
    const extraCandidates = totalCandidates - guaranteedTotal;
    
    // Generate realistic names and emails
    let candidateIndex = 0;
    
    // First, distribute guaranteed candidates to each job using ACTUAL job IDs
    for (let i = 0; i < actualJobIds.length; i++) {
        const jobId = actualJobIds[i]; // Use actual job ID from database
        
        for (let j = 0; j < guaranteedCandidatesPerJob; j++) {
            // Pick a random stage for this candidate
            const randomStage = STAGES[Math.floor(Math.random() * STAGES.length)];
            
            const randomFirstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
            const randomLastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
            const name = `${randomFirstName} ${randomLastName}`;
            const email = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${candidateIndex + 1}@example.com`;
            
            // Create realistic stage history
            const stageHistory = [];
            const baseTime = Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000; // Random time in last 30 days
            
            // Add progression through stages up to current stage
            const stageIndex = STAGES.indexOf(randomStage);
            let timeOffset = 0;
            
            for (let historyIndex = 0; historyIndex <= stageIndex; historyIndex++) {
                if (STAGES[historyIndex] !== 'Rejected' || historyIndex === stageIndex) {
                    stageHistory.push({
                        stage: STAGES[historyIndex],
                        timestamp: new Date(baseTime + timeOffset).toISOString(),
                    });
                    timeOffset += Math.random() * 7 * 24 * 60 * 60 * 1000; // Random 0-7 days between stages
                }
            }
            
            // Generate some random notes for variety (not all candidates have notes)
            let notes = [];
            if (Math.random() < 0.3) { // 30% of candidates have notes
                const numNotes = Math.floor(Math.random() * 3) + 1; // 1-3 notes
                for (let noteIndex = 0; noteIndex < numNotes; noteIndex++) {
                    const noteTexts = [
                        'Great technical skills demonstrated during initial screening.',
                        'Strong communication skills, would be a good culture fit.',
                        'Impressive portfolio and GitHub contributions.',
                        'Previous experience aligns well with our requirements.',
                        'Highly motivated candidate with excellent problem-solving abilities.',
                        'Good leadership potential based on previous roles.',
                        'Strong analytical thinking and attention to detail.',
                    ];
                    notes.push({
                        noteId: noteIndex + 1,
                        text: noteTexts[Math.floor(Math.random() * noteTexts.length)],
                        timestamp: new Date(baseTime + Math.random() * timeOffset).toISOString(),
                    });
                }
            }
            
            candidates.push({
                jobId, // Use actual job ID from database
                name,
                email,
                currentStage: randomStage,
                stageHistory,
                notes: notes.length > 0 ? notes : undefined,
                order: candidateIndex, // For drag-drop ordering
            });
            
            candidateIndex++;
        }
    }
    
    // Then distribute remaining candidates randomly across actual job IDs
    for (let i = 0; i < extraCandidates; i++) {
        // Randomly assign to actual job IDs
        const jobId = actualJobIds[Math.floor(Math.random() * actualJobIds.length)];
        const randomStage = STAGES[Math.floor(Math.random() * STAGES.length)];
        
        const randomFirstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const randomLastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const name = `${randomFirstName} ${randomLastName}`;
        const email = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${candidateIndex + 1}@example.com`;
        
        // Create realistic stage history
        const stageHistory = [];
        const baseTime = Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000; // Random time in last 30 days
        
        // Add progression through stages up to current stage
        const stageIndex = STAGES.indexOf(randomStage);
        let timeOffset = 0;
        
        for (let historyIndex = 0; historyIndex <= stageIndex; historyIndex++) {
            if (STAGES[historyIndex] !== 'Rejected' || historyIndex === stageIndex) {
                stageHistory.push({
                    stage: STAGES[historyIndex],
                    timestamp: new Date(baseTime + timeOffset).toISOString(),
                });
                timeOffset += Math.random() * 7 * 24 * 60 * 60 * 1000; // Random 0-7 days between stages
            }
        }
        
        // Generate some random notes for variety (not all candidates have notes)
        let notes = [];
        if (Math.random() < 0.3) { // 30% of candidates have notes
            const numNotes = Math.floor(Math.random() * 3) + 1; // 1-3 notes
            for (let noteIndex = 0; noteIndex < numNotes; noteIndex++) {
                const noteTexts = [
                    'Great technical skills demonstrated during initial screening.',
                    'Strong communication skills, would be a good culture fit.',
                    'Impressive portfolio and GitHub contributions.',
                    'Previous experience aligns well with our requirements.',
                    'Highly motivated candidate with excellent problem-solving abilities.',
                    'Good leadership potential based on previous roles.',
                    'Strong analytical thinking and attention to detail.',
                ];
                notes.push({
                    noteId: noteIndex + 1,
                    text: noteTexts[Math.floor(Math.random() * noteTexts.length)],
                    timestamp: new Date(baseTime + Math.random() * timeOffset).toISOString(),
                });
            }
        }
        
        candidates.push({
            jobId, // Use actual job ID from database
            name,
            email,
            currentStage: randomStage,
            stageHistory,
            notes: notes.length > 0 ? notes : undefined,
            order: candidateIndex, // For drag-drop ordering
        });
        
        candidateIndex++;
    }
    
    console.log('🔥 CANDIDATE GENERATION: Created candidates distribution by job:', 
        actualJobIds.reduce((acc, jobId) => {
            acc[jobId] = candidates.filter(c => c.jobId === jobId).length;
            return acc;
        }, {} as { [key: number]: number }));
    
    // Shuffle candidates for more realistic distribution
    return candidates.sort(() => Math.random() - 0.5);
}

export function generateSeedCandidates(totalJobs: number): Omit<Candidate, 'id'>[] {
    const candidates: Omit<Candidate, 'id'>[] = [];
    const totalCandidates = 1000; // Exactly 1000 candidates as specified
    
    // More realistic stage distribution
    const stageDistribution = {
        'Applied': 0.35,      // 35% - Most candidates in initial stage
        'Screening': 0.25,    // 25% - Many get through to screening
        'Interview': 0.20,    // 20% - Fewer make it to interview
        'Hired': 0.08,        // 8% - Small percentage hired
        'Rejected': 0.12      // 12% - Some rejected at various stages
    };
    
    // Calculate candidates per stage
    let candidatesPerStage: { [key in typeof STAGES[number]]: number } = {} as any;
    let remaining = totalCandidates;
    
    STAGES.slice(0, -1).forEach(stage => {
        const count = Math.floor(totalCandidates * stageDistribution[stage]);
        candidatesPerStage[stage] = count;
        remaining -= count;
    });
    candidatesPerStage['Rejected'] = remaining; // Assign remaining to last stage

    // Generate realistic names and emails
    let candidateIndex = 0;
    
    // Ensure every job gets at least 2-3 candidates by distributing them first
    const guaranteedCandidatesPerJob = 3;
    const guaranteedTotal = totalJobs * guaranteedCandidatesPerJob;
    const extraCandidates = totalCandidates - guaranteedTotal;
    
    // First, distribute guaranteed candidates to each job
    for (let jobId = 1; jobId <= totalJobs; jobId++) {
        for (let i = 0; i < guaranteedCandidatesPerJob; i++) {
            // Pick a random stage for this candidate
            const randomStage = STAGES[Math.floor(Math.random() * STAGES.length)];
            
            const randomFirstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
            const randomLastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
            const name = `${randomFirstName} ${randomLastName}`;
            const email = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${candidateIndex + 1}@example.com`;
            
            // Create realistic stage history
            const stageHistory = [];
            const baseTime = Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000; // Random time in last 30 days
            
            // Add progression through stages up to current stage
            const stageIndex = STAGES.indexOf(randomStage);
            let timeOffset = 0;
            
            for (let historyIndex = 0; historyIndex <= stageIndex; historyIndex++) {
                if (STAGES[historyIndex] !== 'Rejected' || historyIndex === stageIndex) {
                    stageHistory.push({
                        stage: STAGES[historyIndex],
                        timestamp: new Date(baseTime + timeOffset).toISOString(),
                    });
                    timeOffset += Math.random() * 7 * 24 * 60 * 60 * 1000; // Random 0-7 days between stages
                }
            }
            
            // Generate some random notes for variety (not all candidates have notes)
            let notes = [];
            if (Math.random() < 0.3) { // 30% of candidates have notes
                const numNotes = Math.floor(Math.random() * 3) + 1; // 1-3 notes
                for (let noteIndex = 0; noteIndex < numNotes; noteIndex++) {
                    const noteTexts = [
                        'Great technical skills demonstrated during initial screening.',
                        'Strong communication skills, would be a good culture fit.',
                        'Impressive portfolio and GitHub contributions.',
                        'Previous experience aligns well with our requirements.',
                        'Highly motivated candidate with excellent problem-solving abilities.',
                        'Good leadership potential based on previous roles.',
                        'Strong analytical thinking and attention to detail.',
                    ];
                    notes.push({
                        noteId: noteIndex + 1,
                        text: noteTexts[Math.floor(Math.random() * noteTexts.length)],
                        timestamp: new Date(baseTime + Math.random() * timeOffset).toISOString(),
                    });
                }
            }
            
            candidates.push({
                jobId,
                name,
                email,
                currentStage: randomStage,
                stageHistory,
                notes: notes.length > 0 ? notes : undefined,
                order: candidateIndex, // For drag-drop ordering
            });
            
            candidateIndex++;
        }
    }
    
    // Then distribute remaining candidates randomly
    for (let i = 0; i < extraCandidates; i++) {
        // Randomly assign to jobs but maintain stage distribution as much as possible
        const jobId = Math.floor(Math.random() * totalJobs) + 1;
        const randomStage = STAGES[Math.floor(Math.random() * STAGES.length)];
        
        const randomFirstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const randomLastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const name = `${randomFirstName} ${randomLastName}`;
        const email = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${candidateIndex + 1}@example.com`;
        
        // Create realistic stage history
        const stageHistory = [];
        const baseTime = Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000; // Random time in last 30 days
        
        // Add progression through stages up to current stage
        const stageIndex = STAGES.indexOf(randomStage);
        let timeOffset = 0;
        
        for (let historyIndex = 0; historyIndex <= stageIndex; historyIndex++) {
            if (STAGES[historyIndex] !== 'Rejected' || historyIndex === stageIndex) {
                stageHistory.push({
                    stage: STAGES[historyIndex],
                    timestamp: new Date(baseTime + timeOffset).toISOString(),
                });
                timeOffset += Math.random() * 7 * 24 * 60 * 60 * 1000; // Random 0-7 days between stages
            }
        }
        
        // Generate some random notes for variety (not all candidates have notes)
        let notes = [];
        if (Math.random() < 0.3) { // 30% of candidates have notes
            const numNotes = Math.floor(Math.random() * 3) + 1; // 1-3 notes
            for (let noteIndex = 0; noteIndex < numNotes; noteIndex++) {
                const noteTexts = [
                    'Great technical skills demonstrated during initial screening.',
                    'Strong communication skills, would be a good culture fit.',
                    'Impressive portfolio and GitHub contributions.',
                    'Previous experience aligns well with our requirements.',
                    'Highly motivated candidate with excellent problem-solving abilities.',
                    'Good leadership potential based on previous roles.',
                    'Strong analytical thinking and attention to detail.',
                ];
                notes.push({
                    noteId: noteIndex + 1,
                    text: noteTexts[Math.floor(Math.random() * noteTexts.length)],
                    timestamp: new Date(baseTime + Math.random() * timeOffset).toISOString(),
                });
            }
        }
        
        candidates.push({
            jobId,
            name,
            email,
            currentStage: randomStage,
            stageHistory,
            notes: notes.length > 0 ? notes : undefined,
            order: candidateIndex, // For drag-drop ordering
        });
        
        candidateIndex++;
    }
    
    // Shuffle candidates for more realistic distribution
    return candidates.sort(() => Math.random() - 0.5);
}