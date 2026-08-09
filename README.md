# AI Prompt Studio

**Build, Organize and Execute AI Workflows**

A productivity workspace for managing, iterating on, and organizing AI prompts — built as part of the FlyRank Frontend AI Engineering Internship.

## Live Demo

- **App:** https://flyrank-capstone-dun.vercel.app
- **Repo:** https://github.com/ranc5291-dotcom/flyrank-capstone

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v6
- React Hook Form
- jsPDF (PDF export)
- Groq API (AI Chat + Prompt Analyzer)
- Vitest + React Testing Library (component tests)
- Playwright (end-to-end tests, desktop + mobile)
- GitHub Actions (CI: type check, unit tests, E2E tests)

## Features (Completed)

- **Dashboard** — stats overview, recent prompts, favourites, quick actions
- **Prompt Library** — search, filter by category/model, sort, keyboard navigation
- **Add/Edit Prompt** — form with validation, category and model assignment
- **Favorites** — star and view favourite prompts
- **Collections** — organize prompts into folders, assign/remove from prompt cards
- **Imported Prompts** — dedicated view for prompts brought in via JSON import
- **Settings** — dark mode, default AI model, export/import data (JSON), clear all data
- **Health page** — live system status with fetched test data
- **Authentication (UI-only)** — login/guest flow with persisted session state, no backend
- **Dark mode** — full app-wide theme toggle, persisted across sessions
- **Responsive design** — tested at mobile (375px) and desktop (1280px) widths, including a collapsible off-canvas sidebar on mobile
- **AI Workspace** — combined Chat and Prompt Analyzer interface:
  - **AI Chat** — streaming responses via Groq, stop generation, retry on error, distinct copy for network/timeout/rate-limit errors
  - **Prompt Analyzer** — quality score, strengths, weaknesses, and suggestions for any pasted prompt, with a live lifecycle indicator (Reading → Evaluating → Generating → Completed)
  - **Optimized Prompt** — auto-generates an improved version of the analyzed prompt, with one-click copy and save-to-library
  - **AI Orb** — an animated indicator that idles with the app's gradient identity and shifts color/speed while the AI is actively "thinking"; respects `prefers-reduced-motion` and disables cursor-tilt on touch devices
- **Deployed to Vercel** — with client-side routing support (SPA rewrites)

## Testing

- **Component tests (Vitest + React Testing Library):** 25 tests covering chat input validation, message rendering and error states, the Prompt Analyzer's full lifecycle, and the Optimized Prompt section's copy/save flows
- **End-to-end tests (Playwright):** two full user journeys — analyzing a prompt end-to-end and saving it to the library, and recovering from an API failure via Retry — run against both desktop and mobile viewports
- **CI (GitHub Actions):** every push to `main` runs a type check, the full Vitest suite, and the full Playwright suite before deploying

npm run test # Vitest component tests
npm run test:e2e # Playwright end-to-end tests
npm run typecheck # TypeScript check


## Upcoming / Not Yet Built

These are part of the original project scope but are planned for later weeks or as stretch goals:

- **AI Workflow Builder** — goal-based prompt chains (e.g. "Apply for Internship" → Resume → Cover Letter → Interview Prep)
- **AI Model Recommendation** — suggests the best model for a given prompt
- **Accessibility Playground** — modal, tabs, and disclosure components built from scratch
- Version history for prompts
- Team workspace / collaboration
- Prompt analytics
- Privacy scanner

## Getting Started

git clone https://github.com/ranc5291-dotcom/flyrank-capstone.git
cd flyrank-capstone
npm install
npm run dev


## Author

HN Charan

## License

See [LICENSE](https://github.com/ranc5291-dotcom/flyrank-capstone/blob/main/LICENSE)