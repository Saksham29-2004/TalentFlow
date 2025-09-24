export interface Candidate {
  id: number;
  jobId: number;
  name: string;
  email: string;
  order?: number;
  currentStage: 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';
  stageHistory: { stage: string; timestamp: string }[];
  notes?: Note[];
}
export interface Note {
  noteId: number,
  text: string;
  timestamp: string;
}

const STAGES = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'] as const;

const FIRST_NAMES = [
    // Tech-focused diverse professional names
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
    
    for (const stage of STAGES) {
        const candidatesInThisStage = candidatesPerStage[stage];
        
        for (let i = 0; i < candidatesInThisStage; i++) {
            // Randomly assign to jobs (more realistic distribution)
            const jobId = Math.floor(Math.random() * totalJobs) + 1;
            
            const randomFirstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
            const randomLastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
            const name = `${randomFirstName} ${randomLastName}`;
            const email = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${candidateIndex + 1}@example.com`;
            
            // Create realistic stage history
            const stageHistory = [];
            const baseTime = Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000; // Random time in last 30 days
            
            // Add progression through stages up to current stage
            const stageIndex = STAGES.indexOf(stage);
            let timeOffset = 0;
            
            for (let historyIndex = 0; historyIndex <= stageIndex; historyIndex++) {
                if (STAGES[historyIndex] !== 'Rejected' || historyIndex === stageIndex) {
                    stageHistory.push({
                        stage: STAGES[historyIndex],
                        timestamp: new Date(baseTime + timeOffset).toISOString()
                    });
                    timeOffset += Math.random() * 7 * 24 * 60 * 60 * 1000; // Add 0-7 days between stages
                }
            }
            
            // Add some realistic notes for a portion of candidates
            const notes = [];
            if (Math.random() < 0.3) { // 30% of candidates have notes
                const noteTemplates = [
                    "Strong technical background, good communication skills",
                    "Excellent problem-solving abilities, team player",
                    "Great experience with required technologies",
                    "Needs more experience in leadership role",
                    "Very enthusiastic, quick learner",
                    "Good cultural fit, innovative thinker",
                    "Solid background, available immediately",
                    "Impressive portfolio, creative problem solver"
                ];
                
                notes.push({
                    noteId: candidateIndex + 1,
                    text: noteTemplates[Math.floor(Math.random() * noteTemplates.length)],
                    timestamp: new Date(baseTime + Math.random() * timeOffset).toISOString()
                });
            }

            candidates.push({
                jobId: jobId,
                name: name,
                email: email,
                currentStage: stage,
                order: i,
                stageHistory: stageHistory,
                notes: notes,
            });
            
            candidateIndex++;
        }
    }
    
    console.log(`Generated exactly ${candidates.length} candidates distributed across ${totalJobs} jobs`);
    console.log('Stage distribution:', Object.fromEntries(
        STAGES.map(stage => [stage, candidates.filter(c => c.currentStage === stage).length])
    ));
    
    return candidates;
}

