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
- **Responsive design** — tested at mobile (375px) and desktop (1280px) widths
- **Deployed to Vercel** — with client-side routing support (SPA rewrites)

## Upcoming / Not Yet Built

These are part of the original project scope but are planned for later weeks or as stretch goals:

- **AI Workflow Builder** — goal-based prompt chains (e.g. "Apply for Internship" → Resume → Cover Letter → Interview Prep)
- **AI Chat** — streaming responses, stop generation, multiple conversations (Gemini API)
- **Prompt Quality Analyzer** — scoring and improvement suggestions for prompts
- **AI Model Recommendation** — suggests the best model for a given prompt
- **Accessibility Playground** — modal, tabs, and disclosure components built from scratch
- **Version history** for prompts
- **Team workspace** / collaboration
- **Prompt analytics**
- **Privacy scanner**

## Getting Started

```bash
git clone https://github.com/ranc5291-dotcom/flyrank-capstone.git
cd flyrank-capstone
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Development Notes

This project was built with AI (Claude) as a development assistant — used for debugging TypeScript build errors, diagnosing a Tailwind v4 dark-mode configuration issue, resolving Git merge conflicts, and implementing features like Settings export/import and the collection-assignment picker on prompt cards. See submission notes for detailed examples of AI-assisted debugging and manual corrections made along the way.

## Author

HN Charan

## License

See [LICENSE](./LICENSE)