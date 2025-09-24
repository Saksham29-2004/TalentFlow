/**
 * Professional project structure restructuring plan
 * This file documents the new industry-standard structure
 */

export interface DirectoryStructure {
  src: {
    // Application core
    app: {
      layout: ['RootLayout.tsx'];
      routing: ['AppRoutes.tsx'];
      store?: ['store.ts', 'storeProvider.tsx']; // For future state management
    };

    // Static assets
    assets: {
      images: ['react.svg', 'logo.png', 'icons/*'];
      styles: ['globals.css', 'app.css', 'components.css'];
      fonts?: string[];
    };

    // Reusable components
    components: {
      common: {
        ui: [
          'Button.tsx',
          'Input.tsx', 
          'Modal.tsx',
          'Pagination.tsx',
          'LoadingSpinner.tsx',
          'ErrorBoundary.tsx'
        ];
        forms: [
          'FormField.tsx',
          'SearchInput.tsx',
          'FilterPanel.tsx'
        ];
        layout: [
          'Header.tsx',
          'Sidebar.tsx',
          'Footer.tsx'
        ];
      };
    };

    // Feature modules (domain-driven)
    features: {
      jobs: {
        components: [
          'JobCard.tsx',
          'JobForm.tsx', 
          'JobFilters.tsx',
          'JobList.tsx'
        ];
        hooks: [
          'useJobs.tsx',
          'useJobDragAndDrop.tsx'
        ];
        pages: [
          'JobListPage.tsx',
          'JobDetailPage.tsx',
          'JobCreatePage.tsx'
        ];
        types: ['job.types.ts'];
        services: ['jobService.ts'];
      };

      candidates: {
        components: [
          'CandidateCard.tsx',
          'CandidateProfile.tsx',
          'KanbanColumn.tsx',
          'CandidateNotes.tsx'
        ];
        hooks: ['useCandidates.tsx'];
        pages: [
          'CandidateListPage.tsx',
          'CandidateBoardPage.tsx',
          'CandidateProfilePage.tsx'
        ];
        types: ['candidate.types.ts'];
        services: ['candidateService.ts'];
      };

      assessments: {
        components: [
          'AssessmentBuilder.tsx',
          'QuestionEditor.tsx',
          'SectionEditor.tsx',
          'AssessmentPreview.tsx',
          'AssessmentRuntime.tsx'
        ];
        hooks: ['useAssessmentBuilder.tsx'];
        pages: [
          'AssessmentBuilderPage.tsx',
          'AssessmentPreviewPage.tsx'
        ];
        types: ['assessment.types.ts'];
        services: ['assessmentService.ts'];
      };
    };

    // Library configurations and utilities
    lib: {
      api: [
        'client.ts',          // Base API client configuration
        'interceptors.ts'     // Request/response interceptors
      ];
      database: [
        'db.ts',              // Database configuration
        'browser.ts',         // Browser database setup
        'seed.ts',            // Database seeding
        'handlers/',          // MSW handlers directory
      ];
      utils: [
        'formatters.ts',      // Data formatting utilities
        'validators.ts',      // Validation utilities
        'helpers.ts',         // General helper functions
        'constants.ts'        // Application constants
      ];
    };

    // Page-level components (route components)
    pages: [
      'HomePage.tsx',
      'NotFoundPage.tsx',
      'ErrorPage.tsx'
    ];

    // API service layer
    services: {
      api: [
        'jobService.ts',
        'candidateService.ts', 
        'assessmentService.ts',
        'baseService.ts'      // Base service with common functionality
      ];
      data: [
        'mockDataGenerators.ts',
        'dataTransformers.ts'
      ];
    };

    // TypeScript type definitions
    types: [
      'job.types.ts',
      'candidate.types.ts',
      'assessment.types.ts',
      'common.types.ts',    // Shared/common types
      'api.types.ts'        // API-related types
    ];

    // Entry files
    files: [
      'main.tsx',           // Application entry point
      'App.tsx',            // Root App component
      'vite-env.d.ts'       // Vite environment types
    ];
  };
}

/**
 * Naming conventions used:
 * 
 * 1. Files: PascalCase for React components, camelCase for utilities
 *    - Components: JobCard.tsx, CandidateProfile.tsx
 *    - Hooks: useJobs.tsx, useCandidates.tsx
 *    - Services: jobService.ts, candidateService.ts
 *    - Types: job.types.ts, candidate.types.ts
 *    - Utils: formatters.ts, validators.ts
 * 
 * 2. Directories: camelCase
 *    - features/jobs/, components/common/ui/
 * 
 * 3. Feature-based organization:
 *    - Each domain (jobs, candidates, assessments) has its own folder
 *    - Components, hooks, pages, types, and services are co-located within features
 * 
 * 4. Separation of concerns:
 *    - /components/common/ - Reusable UI components
 *    - /features/ - Domain-specific functionality
 *    - /lib/ - External library configurations and utilities
 *    - /services/ - Business logic and API calls
 *    - /types/ - Global type definitions
 * 
 * 5. Industry best practices:
 *    - Clear separation between UI components and business logic
 *    - Feature-based folder structure for scalability
 *    - Consistent naming patterns
 *    - Proper type definitions organization
 *    - Service layer separation
 */