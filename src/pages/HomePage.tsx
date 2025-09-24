import React, { useState, useEffect } from 'react';
import { fetchJobs } from '../services/api/jobService';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [jobStats, setJobStats] = useState({
    activeJobs: 0,
    totalJobs: 0,
    loading: true
  });
  const navigate = useNavigate();

  const handleJobsClick = () => {
    console.log('Navigate to /jobs/jobsList');
    navigate('/jobs/jobsList');
  };

  const handleCandidatesClick = () => {
    navigate('/jobs/1/candidates'); // Navigate to first job's candidates for demo
  };

  const handleAssessmentsClick = () => {
    navigate('/jobs/1/assessment-builder'); // Navigate to first job's assessment builder for demo
  };

  useEffect(() => {
    const loadJobStats = async () => {
      try {
        setJobStats(prev => ({ ...prev, loading: true }));
        
        const activeJobsResponse = await fetchJobs({
          page: 1,
          pageSize: 100,
          status: 'active'
        });
       
        const allJobsResponse = await fetchJobs({
          page: 1,
          pageSize: 1
        });
        
        setJobStats({
          activeJobs: activeJobsResponse.data.length,
          totalJobs: allJobsResponse.totalCount,
          loading: false
        });
      } catch (error) {
        console.error('Failed to load job statistics:', error);
        setJobStats({
          activeJobs: 0,
          totalJobs: 0,
          loading: false
        });
      }
    };

    loadJobStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-25"></div>
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="inline-flex items-center justify-center p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">TalentFlow Pro</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 mb-6 text-balance leading-tight text-center">
              Transform Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Hiring Process
              </span>
            </h1>
            
            <div className="flex justify-center mb-8">
              <p className="text-xl sm:text-2xl text-slate-600 max-w-5xl text-balance leading-relaxed text-center px-4">
                Revolutionize your talent acquisition with intelligent automation, seamless workflows, and actionable analytics that empower HR professionals to make smarter hiring decisions
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleJobsClick}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Get Started
              </button>
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16h6m-7 4h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Demo
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Active Jobs */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider truncate mb-2">Active Jobs</p>
                  {jobStats.loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 sm:h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg w-16 sm:w-20 mb-2"></div>
                    </div>
                  ) : (
                    <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">{jobStats.activeJobs}</p>
                  )}
                  <p className="text-sm text-slate-600 font-medium">Currently hiring</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Jobs */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider truncate mb-2">Total Positions</p>
                  {jobStats.loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 sm:h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-20 sm:w-24 mb-2"></div>
                    </div>
                  ) : (
                    <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2">{jobStats.totalJobs.toLocaleString()}</p>
                  )}
                  <p className="text-sm text-slate-600 font-medium">All time created</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Success Rate */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider truncate mb-2">Success Rate</p>
                  <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent mb-2">92%</p>
                  <p className="text-sm text-slate-600 font-medium">Successful hires</p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 mb-12 sm:mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-3">Quick Actions</h2>
              <p className="text-slate-600 text-lg">Get started with these essential tools</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <button
                onClick={handleJobsClick}
                className="group relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 text-left transition-all duration-300 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 transition-all duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-700 transition-colors">Manage Jobs</h3>
                    <p className="text-slate-600 text-sm">Create and edit job postings</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={handleCandidatesClick}
                className="group relative bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-6 text-left transition-all duration-300 hover:from-green-100 hover:to-emerald-200 hover:border-green-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-600/0 group-hover:from-green-500/5 group-hover:to-emerald-600/5 transition-all duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-green-700 transition-colors">View Candidates</h3>
                    <p className="text-slate-600 text-sm">Review and manage applications</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={handleAssessmentsClick}
                className="group relative bg-gradient-to-br from-purple-50 to-indigo-100 border-2 border-purple-200 rounded-2xl p-6 text-left transition-all duration-300 hover:from-purple-100 hover:to-indigo-200 hover:border-purple-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-600/0 group-hover:from-purple-500/5 group-hover:to-indigo-600/5 transition-all duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-purple-700 transition-colors">Build Assessment</h3>
                    <p className="text-slate-600 text-sm">Create candidate evaluations</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Platform Features */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 mb-12 sm:mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-3">Platform Features</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">Powerful tools designed to transform your recruitment process</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="group text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">Smart Job Matching</h3>
                <p className="text-slate-600 text-balance leading-relaxed">AI-powered candidate matching algorithm that identifies the best-fit candidates based on skills, experience, and cultural alignment</p>
              </div>

              <div className="group text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-100 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-green-700 transition-colors">Streamlined Workflow</h3>
                <p className="text-slate-600 text-balance leading-relaxed">Intuitive kanban boards and automated workflows that guide candidates through each stage of your hiring pipeline seamlessly</p>
              </div>

              <div className="group text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-100 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-700 transition-colors">Analytics & Insights</h3>
                <p className="text-slate-600 text-balance leading-relaxed">Comprehensive analytics dashboard with real-time metrics and insights to optimize your recruitment strategy and improve outcomes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;