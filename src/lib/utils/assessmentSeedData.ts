import type { Assessment, Question } from '../../types/assessment.types';

export function generateSeedAssessments(jobs: any[]): Omit<Assessment, 'id'>[] {
  const assessments: Omit<Assessment, 'id'>[] = [];

  // Question pools for different assessment types
  const technicalQuestions = [
    {
      text: 'Describe your experience with system design and scalability challenges. Provide a specific example of a system you designed or improved.',
      details: { type: 'long-text' as const, maxLength: 2000 }
    },
    {
      text: 'Which of the following are best practices for writing maintainable code? (Select all that apply)',
      details: { type: 'multi-choice' as const, options: ['Write descriptive variable names', 'Use consistent indentation', 'Add meaningful comments', 'Keep functions small and focused', 'Use global variables extensively'] }
    },
    {
      text: 'What is the time complexity of binary search in a sorted array?',
      details: { type: 'single-choice' as const, options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'] }
    },
    {
      text: 'What is your favorite programming language and why?',
      details: { type: 'short-text' as const, maxLength: 500 }
    },
    {
      text: 'Explain the difference between SQL and NoSQL databases. When would you choose one over the other?',
      details: { type: 'long-text' as const, maxLength: 2000 }
    },
    {
      text: 'Which of these are valid HTTP status codes? (Select all that apply)',
      details: { type: 'multi-choice' as const, options: ['200 OK', '404 Not Found', '500 Internal Server Error', '301 Moved Permanently', '999 Invalid Code'] }
    },
    {
      text: 'What does API stand for?',
      details: { type: 'single-choice' as const, options: ['Application Programming Interface', 'Advanced Programming Integration', 'Automated Program Interaction', 'Application Process Integration'] }
    },
    {
      text: 'Describe a challenging debugging experience you had. What was the problem and how did you solve it?',
      details: { type: 'long-text' as const, maxLength: 2000 }
    }
  ];

  const behavioralQuestions = [
    {
      text: 'Tell me about a time when you had to work with a difficult team member. How did you handle the situation?',
      details: { type: 'long-text' as const, maxLength: 2000 }
    },
    {
      text: 'Describe a project where you had to learn a new technology quickly. How did you approach it?',
      details: { type: 'long-text' as const, maxLength: 2000 }
    },
    {
      text: 'What motivates you most in your work?',
      details: { type: 'short-text' as const, maxLength: 500 }
    },
    {
      text: 'Give an example of a time when you had to make a difficult decision with limited information.',
      details: { type: 'long-text' as const, maxLength: 2000 }
    },
    {
      text: 'How do you prefer to receive feedback?',
      details: { type: 'single-choice' as const, options: ['In person during regular meetings', 'Via written communication', 'Immediately when issues arise', 'During formal review periods'] }
    },
    {
      text: 'Describe a time when you had to meet a tight deadline. How did you prioritize your tasks?',
      details: { type: 'long-text' as const, maxLength: 2000 }
    }
  ];

  const cultureQuestions = [
    {
      text: 'What type of work environment do you thrive in?',
      details: { type: 'short-text' as const, maxLength: 500 }
    },
    {
      text: 'Which of these values resonate most with you? (Select all that apply)',
      details: { type: 'multi-choice' as const, options: ['Innovation', 'Collaboration', 'Quality', 'Speed', 'Learning', 'Customer Focus'] }
    },
    {
      text: 'How do you stay updated with industry trends and best practices?',
      details: { type: 'long-text' as const, maxLength: 1500 }
    },
    {
      text: 'What\'s most important to you in a company?',
      details: { type: 'single-choice' as const, options: ['Growth opportunities', 'Work-life balance', 'Compensation', 'Company mission', 'Team culture'] }
    }
  ];

  jobs.forEach(job => {
    // Generate 3-4 assessments per job
    const assessmentCount = Math.floor(Math.random() * 2) + 3; // 3 or 4 assessments
    
    for (let i = 0; i < assessmentCount; i++) {
      const assessmentTypes = ['Technical Assessment', 'Behavioral Interview', 'Culture Fit', 'Skills Evaluation'];
      const assessmentType = assessmentTypes[i] || assessmentTypes[Math.floor(Math.random() * assessmentTypes.length)];
      
      let questions: Question[] = [];
      
      if (assessmentType === 'Technical Assessment') {
        // Mix of technical questions, ensure at least 10
        const selectedQuestions = technicalQuestions.sort(() => 0.5 - Math.random()).slice(0, Math.max(10, Math.floor(Math.random() * 6) + 8));
        questions = selectedQuestions.map((q, idx) => ({ 
          ...q, 
          id: `${job.id || (job as any).title.replace(/\s+/g, '_')}-tech-${i}-${idx}`,
          isRequired: Math.random() > 0.3
        }));
      } else if (assessmentType === 'Behavioral Interview') {
        // Behavioral questions with some technical mixed in
        const behavSelected = behavioralQuestions.sort(() => 0.5 - Math.random()).slice(0, 8);
        const techSelected = technicalQuestions.sort(() => 0.5 - Math.random()).slice(0, 4);
        questions = [...behavSelected, ...techSelected].map((q, idx) => ({ 
          ...q, 
          id: `${job.id || (job as any).title.replace(/\s+/g, '_')}-behav-${i}-${idx}`,
          isRequired: Math.random() > 0.3
        }));
      } else if (assessmentType === 'Culture Fit') {
        // Culture questions with behavioral mix
        const cultureSelected = cultureQuestions.sort(() => 0.5 - Math.random()).slice(0, 6);
        const behavSelected = behavioralQuestions.sort(() => 0.5 - Math.random()).slice(0, 6);
        questions = [...cultureSelected, ...behavSelected].map((q, idx) => ({ 
          ...q, 
          id: `${job.id || (job as any).title.replace(/\s+/g, '_')}-culture-${i}-${idx}`,
          isRequired: Math.random() > 0.3
        }));
      } else {
        // Skills evaluation - mix of all types
        const allQuestions = [...technicalQuestions, ...behavioralQuestions, ...cultureQuestions];
        const selectedQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, Math.max(12, Math.floor(Math.random() * 8) + 10));
        questions = selectedQuestions.map((q, idx) => ({ 
          ...q, 
          id: `${job.id || (job as any).title.replace(/\s+/g, '_')}-skills-${i}-${idx}`,
          isRequired: Math.random() > 0.3
        }));
      }

      assessments.push({
        jobId: job.id || job.title,
        title: `${job.title} - ${assessmentType}`,
        sections: [
          {
            id: `section-${job.id || job.title}-${i}-1`,
            title: `${assessmentType} Questions`,
            questions: questions
          }
        ]
      });
    }
  });

  return assessments;
}