import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found Page
 * Displays when user navigates to invalid route
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Go to Home
            </Link>
            
            <div className="flex justify-center space-x-4">
              <Link
                to="/jobs"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                View Jobs
              </Link>
              
              <Link
                to="/candidates"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                View Candidates
              </Link>
              
              <Link
                to="/assessments"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                View Assessments
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-gray-400">
          <p>Lost? These links might help you find your way.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;