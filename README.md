# Task Manager

A todo list application built for junior developer recruitment, demonstrating React, TypeScript, test-driven development, and clean code practices.

**Live Demo:** https://task-manager-reuters.netlify.app/

## Features

- **Add tasks** - Create new tasks with validation
- **Edit tasks** - Inline editing with save/cancel
- **Toggle completion** - Mark tasks as complete or active
- **Delete tasks** - Remove tasks permanently
- **Filter views** - View all, active, or completed tasks
- **LocalStorage persistence** - Tasks survive page refresh
- **Responsive design** - Clean, modern task-management UI for desktop and mobile

## Tech Stack

- **React 19** - Functional components with hooks
- **TypeScript 6** - Strong typing, no `any` types
- **Vite 8** - Fast build tool and dev server
- **Vitest 5** - Unit testing with React Testing Library
- **Playwright** - Browser automation testing
- **CSS** - Custom design system, no UI libraries

## Getting Started

### Prerequisites

- Node.js (v20.19+ recommended)
- npm (v10+ recommended)

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Visit http://localhost:5173 in your browser.

### Testing

Run tests in watch mode:

```bash
npm test
```

Run tests once:

```bash
npm run test:run
```

Run tests with UI:

```bash
npm run test:ui
```

Run end-to-end tests:

```bash
npm run test:e2e
```

### Production Build

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/       # React components
│   ├── FilterBar.tsx
│   ├── TaskForm.tsx
│   └── TaskItem.tsx
├── hooks/           # Custom React hooks
│   └── useTasks.ts
├── types/           # TypeScript type definitions
│   └── task.ts
├── utils/           # Utility functions
│   └── storage.ts
├── test/            # Test setup
│   └── setup.ts
├── App.tsx          # Main application component
├── App.css          # Application styles
└── index.css        # Global styles and design system
tests/
└── e2e/
    └── task-manager.spec.ts
```

## Documentation

- **[SPEC.md](SPEC.md)** - Complete functional specification with requirements
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Implementation summary and test results

## Testing

### Unit & Integration Tests

- **25 tests** across 6 Vitest test suites
- All functional requirements covered
- Edge cases covered, including empty input and malformed localStorage data
- React component and hook behavior tested with React Testing Library

### End-to-End Tests

- **8 Playwright E2E tests**
- Covers adding, editing, deleting, completing, filtering, validation, and persistence
- Browser flows verified in Chromium

## Architecture Highlights

- **Custom hook pattern** - `useTasks` encapsulates all state management
- **Storage layer** - Validates data structure and handles errors gracefully
- **Controlled components** - Forms use React controlled inputs
- **Inline editing** - No modals, edit directly in the task list
- **Type-safe** - Strong TypeScript typing throughout

## Development Approach

This project was built using **test-driven development (TDD)**:

1. Wrote functional specification (SPEC.md)
2. Wrote failing tests for all requirements
3. Implemented features to pass tests
4. All 25 tests passing with all functional requirements covered

## AI-Assisted Development

Claude Code was used as the primary implementation tool for this project.

The development workflow followed an AI-first, human-reviewed approach:

1. Defined and reviewed the functional specification.
2. Used AI to analyze the requirements and propose the architecture.
3. Used AI to generate tests before implementation.
4. Reviewed the generated tests and refined them where necessary.
5. Used AI as the primary source for the application implementation.
6. Reviewed the generated code and identified issues during validation.
7. Used AI to address issues found during code review and testing.
8. Validated the final implementation with linting, unit/integration tests, E2E browser tests, and a production build.

All AI-generated output was reviewed, tested, and approved by the developer before being included in the final implementation.

## Browser Support

- Designed for modern browsers including Chrome, Firefox, Safari, and Edge
- Requires localStorage support
- Responsive layout for desktop, tablet, and mobile
- Playwright E2E flows were verified in Chromium
