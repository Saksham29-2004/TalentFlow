import { Routes, Route } from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import HomePage from "../../pages/HomePage";
import JobsList from "../../features/jobs/pages/JobsList";
import JobDetail from "../../features/jobs/pages/JobDetail";
import CandidatesList from "../../Candidates/CandidatesList";
import KanbanBoard from "../../features/candidates/pages/KanbanBoard";
import CandidateProfile from "../../features/candidates/pages/CandidateProfile";
import AssessmentBuilder from "../../features/assessments/pages/AssessmentBuilder";
import AssessmentPage from "../../pages/AssessmentPage";
import NotFoundPage from "../../pages/NotFoundPage";

/**
 * Application routing configuration
 * Defines all routes and their corresponding page components
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        
        {/* Jobs feature routes */}
        <Route path="jobs/jobsList" element={<JobsList />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        
        {/* Assessment feature routes */}
        <Route path="jobs/:jobId/assessment-builder" element={<AssessmentBuilder />} />
        <Route path="assessments" element={<AssessmentPage />} />
        
        {/* Candidates feature routes */}
        <Route path="jobs/:jobId/candidates" element={<CandidatesList />} />
        <Route path="jobs/:jobId/candidates/kanbanview" element={<KanbanBoard />} />
        <Route path="jobs/:jobId/candidates/:candidateId" element={<CandidateProfile />} />

        {/* Fallback route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;