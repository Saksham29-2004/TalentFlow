# TalentFlow

**TalentFlow** is a modern, scalable, and feature-rich platform for managing jobs, candidates, and technical assessments in recruitment pipelines. Built with React, Vite, and TypeScript, TalentFlow emphasizes a highly organized, industry-standard code structure, modularity, and ease of extensibility.

---

## Table of Contents

- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Project Architecture](#project-architecture)
- [Known Issues & Limitations](#known-issues--limitations)
- [Technical Decisions](#technical-decisions)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Job Management:** Create, view, and manage job postings.
- **Candidate Pipeline:** Kanban board and candidate profiles for streamlined workflow.
- **Assessments:** Build and preview candidate assessments for jobs.
- **Mock API/Data Layer:** Powered by MSW and IndexedDB for local development.
- **Modern UI:** Built with React and Tailwind CSS for a responsive experience.

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18.x)
- [Yarn](https://yarnpkg.com/) or npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Saksham29-2004/TalentFlow.git
   cd TalentFlow
   ```

2. **Install dependencies:**
   ```sh
   yarn install
   # or
   npm install
   ```

3. **Start the development server:**
   ```sh
   yarn dev
   # or
   npm run dev
   ```

4. **Open in browser:**

   Visit [http://localhost:5173](http://localhost:5173) (or as indicated in the terminal).

---

## Project Architecture

TalentFlow follows a **feature-based modular structure** for maximum scalability and maintainability.

```
src/
├── app/                 # Core app setup (layout, routing)
│   ├── layout/
│   └── routing/
├── assets/              # Static files (images, styles, fonts)
├── components/          # Reusable UI components (buttons, modals, layout)
│   └── common/
├── features/            # Domain-driven modules
│   ├── jobs/
│   ├── candidates/
│   └── assessments/
├── lib/                 # Library configs, API clients, utilities
│   ├── api/
│   ├── database/
│   └── utils/
├── pages/               # Top-level route pages
├── services/            # Service layer (API, data, business logic)
├── types/               # Global/shared TypeScript types
├── main.tsx             # Application entry point (bootstraps MSW, app render)
└── App.tsx              # Root component
```

**Highlights:**

- **Feature Modules:** Each domain (`jobs`, `candidates`, `assessments`) contains its own `components`, `hooks`, `pages`, `types`, and `services`.
- **Reusable Components:** Placed under `components/common/ui`, such as `Button`, `Input`, `Modal`, etc.
- **Service Layer:** All business logic and API calls are abstracted in `services/`.
- **Utilities & Lib:** Shared helpers, API configurations, and mock database handlers live in `lib/`.
- **Strict Naming Conventions:** PascalCase for components, camelCase for hooks & utilities, and consistent directory naming.

For a detailed structure, see [`src/PROJECT_STRUCTURE.md`](src/PROJECT_STRUCTURE.md).

---

## Known Issues & Limitations

- **Back-end Integration:** The project currently uses [Mock Service Worker (MSW)](https://mswjs.io/) and IndexedDB for local data persistence; there is no real back-end API yet.
- **Auth & Authorization:** No authentication/authorization flows are implemented.
- **Testing:** Automated tests (unit/integration) are not yet included.
- **Accessibility:** Some UI components may lack full accessibility support.
- **Production-readiness:** This project serves as a scalable prototype and may require further enhancements for production use.

---

## Technical Decisions

- **Feature-based Structure:** To enable scalability and maintain clear separation of concerns, each business domain is isolated in its own directory.
- **React, Vite, and TypeScript:** Chosen for performance, type safety, and modern development experience.
- **MSW + IndexedDB:** Used for rapid prototyping and local development without server dependencies. Database seeding ensures demo data is available.
- **Tailwind CSS:** Enables consistent, utility-first styling and rapid UI development.
- **Strict Typing & Linting:** TypeScript is enforced throughout, and code style is maintained via Prettier/eslint.
- **Routing:** React Router is used for client-side routing with a centralized route configuration.
- **Consistent Naming:** Files and directories follow clear conventions (see `PROJECT_STRUCTURE.md` for details).

---

## Contributing

Pull requests and suggestions are welcome! Please open an issue to discuss your ideas or report bugs.

---

## License

[MIT](LICENSE)
