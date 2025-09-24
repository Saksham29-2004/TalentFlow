import { db } from './db';
import type { Job } from '@/data/JobsData/Jobs.types'; 
import { generateSeedCandidates } from '../CandidatesFunctions/mockCandidates';
import { generateSeedAssessments } from '../AssessmentFunctions/assessment';

// Generate exactly 25 jobs with mixed active/archived status
function generateRandomJobs(): Omit<Job, 'id'>[] {
  const jobTitles = [
    'Senior Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist',
    'DevOps Engineer', 'Frontend Developer', 'Backend Developer', 'Mobile Developer',
    'Technical Lead', 'QA Engineer', 'Business Analyst', 'Marketing Manager',
    'Sales Representative', 'HR Specialist', 'Financial Analyst', 'Operations Manager',
    'Customer Success Manager', 'Content Writer', 'Graphic Designer', 'Project Manager',
    'Security Engineer', 'Machine Learning Engineer', 'Cloud Architect', 'Scrum Master',
    'Full Stack Developer'
  ];

  const departments = ['Engineering', 'Product', 'Design', 'Data & Analytics', 'Sales', 'Marketing', 'HR', 'Operations'];
  const locations = ['New York', 'San Francisco', 'Austin', 'Seattle', 'Remote', 'Los Angeles', 'Chicago', 'Boston'];
  const experiences = ['Entry', 'Mid', 'Senior', 'Staff', 'Principal'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  const techTags = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'MongoDB', 'PostgreSQL'];
  const skillTags = ['Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Critical Thinking', 'Creativity', 'Adaptability'];

  return Array.from({ length: 25 }, (_, i) => {
    const isActive = Math.random() > 0.3; // 70% active, 30% archived
    const randomTechTags = techTags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2);
    const randomSkillTags = skillTags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
    const allTags = [...randomTechTags, ...randomSkillTags];

    return {
      title: jobTitles[i],
      department: departments[Math.floor(Math.random() * departments.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      experience: experiences[Math.floor(Math.random() * experiences.length)],
      employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
      status: isActive ? 'active' : 'archived' as 'active' | 'archived',
      priority: Math.floor(Math.random() * 5) + 1,
      tags: allTags,
      order: i,
      datePosted: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 90 days
      description: `We are seeking a talented ${jobTitles[i]} to join our ${departments[Math.floor(Math.random() * departments.length)]} team. This role offers exciting opportunities to work with cutting-edge technologies and make a significant impact on our products.`,
      requirements: [
        `${Math.floor(Math.random() * 5) + 3}+ years of experience in relevant field`,
        `Strong proficiency in ${randomTechTags[0]} and ${randomTechTags[1] || 'related technologies'}`,
        'Excellent problem-solving and communication skills',
        'Experience working in agile development environments',
        'Bachelor\'s degree in Computer Science or equivalent experience'
      ]
    };
  });
}

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await db.transaction('rw', [db.jobs, db.candidates, db.assessments, db.assessmentResponses], async () => {
      await db.jobs.clear();
      await db.candidates.clear();
      await db.assessments.clear();
      await db.assessmentResponses.clear();
    });

    console.log('🧹 Cleared existing data');

    // Generate and seed exactly 25 jobs
    const jobs = generateRandomJobs();
    await db.jobs.bulkAdd(jobs);
    console.log(`✅ Generated and seeded ${jobs.length} jobs (${jobs.filter(j => j.status === 'active').length} active, ${jobs.filter(j => j.status === 'archived').length} archived)`);

    // Generate and seed exactly 1000 candidates
    const candidates = generateSeedCandidates(jobs.length);
    await db.candidates.bulkAdd(candidates);
    console.log(`✅ Generated and seeded ${candidates.length} candidates across all jobs`);

    // Generate comprehensive assessments (3-4 per job, 10+ questions each)
    const assessments = generateSeedAssessments(jobs);
    await db.assessments.bulkAdd(assessments);
    console.log(`✅ Generated and seeded ${assessments.length} comprehensive assessments with 10+ questions each`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   • ${jobs.length} jobs (${jobs.filter(j => j.status === 'active').length} active, ${jobs.filter(j => j.status === 'archived').length} archived)`);
    console.log(`   • ${candidates.length} candidates with realistic stage distribution`);
    console.log(`   • ${assessments.length} assessments with comprehensive question sets`);
    console.log('   • Artificial latency (200-1200ms) and 5-10% error rate enabled on write endpoints');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}