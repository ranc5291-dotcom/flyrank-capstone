Project folder structure for ai-prompt-studio

- docs/: Project documentation, design notes, architecture decisions, and longer-form guides.
- scripts/: Build, deployment, and utility scripts (e.g., local dev helpers, release helpers).
- tests/: Unit, integration, and end-to-end test suites and helpers.
- .github/workflows/: CI workflows (GitHub Actions) to run tests, builds, and deployments.

- src/: Application source code (existing). Subfolders:
  - src/components/: Reusable UI components.
  - src/pages/: Page-level components / routes (if using a router or SSG framework).
  - src/hooks/: Custom React hooks and stateful logic.
  - src/lib/: Small libraries and wrappers (API clients, feature modules).
  - src/styles/: Global styles, theme variables, CSS modules.
  - src/utils/: Small utility functions and helpers.
  - src/types/: Shared TypeScript types and interfaces.

- public/: Static assets served as-is. Subfolders:
  - public/assets/images/: Image assets (icons, illustrations).
  - public/assets/fonts/: Local font files.

- package.json, tsconfig*.json, vite.config.ts, README.md: existing project config and metadata.

Why these folders exist

- Separation of concerns: keeps UI, logic, types, and assets organized so contributors can find and modify code quickly.
- Scalability: as the app grows, new features map to existing folders without cluttering the root.
- CI/CD readiness: `.github/workflows` and `scripts` make automation and releases reproducible.
- Tests: a top-level `tests` folder keeps automated tests clearly separated from implementation.

Placeholders

Each newly created empty folder contains a `.gitkeep` file so the directories are tracked by git even when empty.
