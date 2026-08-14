# AI Prompt Studio

**Build, Organize and Execute AI Workflows**

AI Prompt Studio is a production-ready AI productivity workspace for creating, analyzing, optimizing, organizing, and reusing AI prompts. It was built as the capstone project for the **FlyRank Frontend AI Engineering Internship**.

The project combines prompt management, meaningful LLM integration, authentication, structured AI output validation, resilient error handling, automated testing, accessibility-focused UI, and production deployment.

---

## Live Demo

- **Application:** https://flyrank-capstone-dun.vercel.app
- **Login:** https://flyrank-capstone-dun.vercel.app/login
- **Repository:** https://github.com/ranc5291-dotcom/flyrank-capstone

---

## Project Brief

AI Prompt Studio helps students, developers, creators, and AI users improve the quality of their prompts and organize them into a reusable workspace.

Instead of treating AI as only a chatbot, the application provides dedicated AI tools for **prompt analysis and optimization**, allowing users to understand why a prompt may be weak and generate a clearer, more effective version.

The project was chosen to demonstrate how an AI capability can be integrated into a complete frontend product rather than added as a standalone chatbot.

---

# Features

## Dashboard

- Workspace statistics
- Recent prompts
- Favorite prompts
- Quick actions
- Prompt activity overview

## Prompt Library

- Create prompts
- Edit prompts
- Delete prompts
- Search prompts
- Filter by category
- Filter by AI model
- Sort prompts
- Keyboard-friendly navigation
- Favorite/unfavorite prompts

## Collections

- Create prompt collections
- Organize prompts into folders
- Add prompts to collections
- Remove prompts from collections

## Imported Prompts

- Import prompts from JSON
- Dedicated imported-prompts view
- Preserve imported prompt information

## Settings

- Dark/light theme
- Default AI model selection
- Export workspace data as JSON
- Import workspace data from JSON
- Clear workspace data

## Authentication

Authentication is powered by Firebase Authentication.

Supported authentication methods:

- Google Sign-In
- Continue as Guest using Firebase Anonymous Authentication

Authentication behavior:

```text
Login
  ↓
Firebase Authentication
  ↓
Authenticated application
  ↓
Protected routes
  ↓
Refresh
  ↓
Session remains authenticated
  ↓
Sign out
  ↓
/login

AI Workspace

The AI Workspace combines multiple AI-powered capabilities into one interface.

AI Chat

The AI Chat provides real-time streaming responses using the Groq API.

Features include:

Streaming responses
Stop generation
Retry after failure
Network error handling
Timeout handling
Rate-limit error handling
Server/API error handling
Responsive chat interface
Accessible chat controls

The Groq API key is kept server-side and is never exposed directly to the browser.

Prompt Analyzer

Prompt Analyzer evaluates the quality of a user's prompt.

It returns:

Quality score from 0–100
Strengths
Weaknesses
Actionable suggestions

The interface provides a visual lifecycle:

Reading
   ↓
Evaluating
   ↓
Generating
   ↓
Completed

The analyzer is designed to evaluate the supplied prompt as data, rather than accidentally following instructions contained inside that prompt.

Prompt Optimizer

After analyzing a prompt, users can generate an improved version.

The optimizer:

Preserves the original intent
Improves clarity
Adds useful context where appropriate
Improves output expectations
Returns a structured optimized prompt

Users can:

Copy the optimized prompt
Save it directly to the Prompt Library
AI Orb

The AI Workspace includes an animated AI Orb that acts as a visual indicator of AI activity.

The Orb:

Uses the application's gradient visual identity
Changes animation behavior while AI is processing
Provides visual feedback during AI operations
Respects prefers-reduced-motion
Disables cursor-tilt behavior on touch devices
API Architecture

The application uses server-side API handlers to communicate with Groq.

React Frontend
      │
      ├─────────────── /api/chat
      │                    │
      │                    ↓
      │                 Groq API
      │                    │
      │                    ↓
      │              Streaming SSE
      │
      └─────────────── /api/tool
                           │
                           ↓
                      Groq API
                           │
                           ↓
                    Structured JSON
                           │
                           ↓
                      Zod validation
                           │
                           ↓
                      React Frontend
Zod Validation

Zod is used for runtime validation of API request bodies and AI-generated structured output.

/api/tool.ts

The tool endpoint validates:

Request
toolId
User input
Maximum input length

Supported tool IDs are restricted to:

prompt-analyzer
prompt-optimizer
Analyzer output

Validated fields:

qualityScore
strengths
weaknesses
suggestions

The quality score is restricted to an integer between 0 and 100.

Optimizer output

Validated field:

optimizedPrompt

The server buffers the AI response, parses the JSON, validates it with Zod, and only then returns the result to the frontend.

Invalid AI output produces a structured 502 response instead of allowing malformed data to reach the UI.

/api/chat.ts

The chat endpoint validates incoming chat request bodies before forwarding them to Groq.

Validation includes:

Message array structure
Allowed message roles
Message content
Content boundaries

The validated request is then forwarded to Groq while preserving the streaming response behavior.

Prompt Safety

The Prompt Analyzer and Optimizer use prompt isolation.

User input is wrapped inside:

<target_prompt>
USER PROMPT
</target_prompt>

The system instructions explicitly tell the model to treat the contents of <target_prompt> as inert text to analyze or rewrite rather than instructions to execute.

This reduces the risk of prompt-injection-style behavior during prompt analysis and optimization.

Authentication Flow

Firebase Authentication is used for user authentication.

Google Sign-In
User clicks "Sign in with Google"
        ↓
Firebase Google Authentication
        ↓
Authentication succeeds
        ↓
Application auth state updates
        ↓
Navigate to /
Guest Authentication
User clicks "Continue as Guest"
        ↓
Firebase Anonymous Authentication
        ↓
Guest session created
        ↓
Application auth state updates
        ↓
Navigate to /
Session Persistence

Firebase authentication state persists across page refreshes.

Protected Routes

Unauthenticated users are redirected to:

/login
Accessibility

Accessibility was treated as part of the product rather than a final checklist item.

Implemented considerations include:

Keyboard-friendly interactions
Semantic buttons and controls
Accessible form interactions
Visible error states
Responsive navigation
Reduced-motion support
Mobile-friendly layouts
Accessible loading and lifecycle states
Screen-reader-friendly UI structure
Focus-aware interactive components

The application also includes accessibility-focused component work based on the ARIA patterns covered during the internship.

Responsive Design

The application is designed for both desktop and mobile devices.

Tested viewport targets include:

Mobile: 375px
Desktop: 1280px

Mobile behavior includes:

Collapsible sidebar
Off-canvas navigation
Responsive prompt cards
Responsive AI Workspace
Mobile-friendly authentication page
Touch-friendly controls
Error Handling & Resilience

The application is designed to handle failures instead of only supporting the happy path.

Handled scenarios include:

Empty input
Invalid API requests
Invalid AI output
Network failures
Request timeouts
API/server failures
Rate limiting
Failed prompt analysis
Failed prompt optimization
Retry flows
Empty library states
First-run states
Loading states

The UI communicates failures to the user with actionable recovery options where appropriate.

Testing

The project includes automated component/API testing and end-to-end testing.

Vitest + React Testing Library

Current test suite:

30 tests passed across 6 test files

Coverage includes:

Chat input validation
Message rendering
Chat error states
Prompt Analyzer lifecycle
Prompt Analyzer retry behavior
Optimized Prompt behavior
Copy flow
Save-to-library flow
API tool validation

Run the test suite:

npm run test
Playwright

The project contains end-to-end tests covering critical user journeys.

Current result:

4/4 E2E tests passed

Covered journeys include:

Prompt Analyzer flow
Open AI Workspace
      ↓
Enter prompt
      ↓
Analyze
      ↓
Receive AI analysis
      ↓
Generate optimized prompt
      ↓
Save optimized prompt
      ↓
Verify in Prompt Library
API failure recovery
AI request fails
      ↓
Friendly error shown
      ↓
Retry
      ↓
Request succeeds
      ↓
Result displayed

Tests run against desktop and mobile browser configurations.

Run E2E tests:

npm run test:e2e
Final Verification

The final local production verification was completed successfully.

Check	Result
TypeScript	✅ Passed
Vitest	✅ 30/30 passed
Playwright	✅ 4/4 passed
Production build	✅ Passed
Vercel deployment	✅ Production

Commands used:

npm run typecheck
npm run test
npm run test:e2e
npm run build
CI/CD

GitHub Actions is used for continuous verification.

Every push to main runs:

TypeScript Check
      ↓
Vitest
      ↓
Playwright E2E
      ↓
Deployment

The project has maintained a green CI pipeline through the final validation work.

Vercel is used for production hosting.

Performance

The production build completes successfully.

The current Vite build reports a warning for a JavaScript chunk larger than 500 kB.

This is a performance optimization warning, not a build failure.

Potential future improvements include:

Route-based code splitting
Lazy loading
Dynamic imports
Reducing initial JavaScript payload
Further optimization of large dependencies
Project Structure

A simplified architecture:

ai-prompt-studio/
│
├── api/
│   ├── chat.ts
│   ├── tool.ts
│   └── __tests__/
│
├── src/
│   ├── components/
│   │   ├── chat/
│   │   ├── tools/
│   │   └── ...
│   │
│   ├── pages/
│   ├── hooks/
│   ├── providers/
│   ├── types/
│   └── ...
│
├── e2e/
│
├── .github/
│   └── workflows/
│
├── public/
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
Getting Started
Prerequisites
Node.js
npm
Firebase project
Groq API key
Installation

Clone the repository:

git clone https://github.com/ranc5291-dotcom/flyrank-capstone.git

Enter the project:

cd flyrank-capstone

Install dependencies:

npm install

Create your environment configuration according to the variables used by the project.

Then start the development server:

npm run dev
Available Scripts
npm run dev

Start the development server.

npm run typecheck

Run the TypeScript compiler without emitting files.

npm run test

Run the Vitest test suite.

npm run test:e2e

Run Playwright end-to-end tests.

npm run build

Create the production build.

Environment Variables

Secrets and API credentials are stored through environment variables and are not committed to the repository.

The production environment includes the required configuration for:

Groq API
Firebase Authentication

The Groq API key is only accessed by server-side API handlers.

AI-Assisted Development

AI tools were used as development assistants throughout the project.

AI assistance included:

Architecture exploration
React and TypeScript implementation
Debugging
AI API integration
Zod schema design
Test generation
Error-state design
Responsive UI refinement
Login-page visual design
Documentation

AI-generated code was not treated as final automatically.

The implementation was manually reviewed, corrected, tested, and refined before deployment.

Manual Improvements

Examples of manual work include:

Reviewing and correcting AI-generated code
Implementing and verifying Zod validation
Adding prompt isolation using <target_prompt>
Implementing retry and error handling
Refining authentication flows
Implementing protected routes
Improving responsive behavior
Adding reduced-motion support
Testing critical user journeys
Fixing issues discovered during CI and E2E testing
Verifying the final production build
Known Limitations

The current application intentionally remains a focused frontend AI product.

Known limitations include:

Workspace data is primarily browser-local rather than cloud synchronized.
Server-side authentication and rate limiting could be strengthened for a larger public deployment.
Initial JavaScript bundle size can be further optimized.
AI responses depend on external Groq API availability and limits.
Guest users do not have a permanent account identity unless they later adopt a supported account flow.
Future Improvements

Potential future features include:

AI Workflow Builder — create multi-step prompt chains such as:
Internship Application → Resume → Cover Letter → Interview Prep
AI Model Recommendation — recommend an appropriate AI model for a prompt
Prompt version history
Team workspace and collaboration
Prompt analytics
Privacy scanner
Cloud synchronization
Advanced usage analytics
More granular permissions and account management
Further performance optimization

These are intentionally not presented as completed features.

Deployment

The application is deployed to Vercel.

Production URL:

https://flyrank-capstone-dun.vercel.app

Deployment approach:

GitHub
   ↓
main branch
   ↓
GitHub Actions
   ↓
Typecheck
   ↓
Unit/API Tests
   ↓
E2E Tests
   ↓
Vercel Production
Rollback

If a production deployment introduces a regression, the previous known-good commit can be redeployed through Vercel.

Production Checklist
 Application deployed
 Production URL functional
 Authentication configured
 Protected routes implemented
 AI Chat implemented
 Prompt Analyzer implemented
 Prompt Optimizer implemented
 Structured AI validation implemented
 Error states implemented
 Retry flows implemented
 Responsive design implemented
 Accessibility considerations implemented
 Unit/component/API tests implemented
 E2E tests implemented
 CI configured
 Production build verified
 README/documentation completed
Reflection

The hardest part of the project was turning an AI capability into a reliable product rather than simply making an API call.

Streaming AI introduces failure cases such as network failures, timeouts, rate limits, partial responses, and malformed model output. Building structured validation and reliable error states showed that production AI engineering involves much more than prompt design.

Another important challenge was controlling project scope. There were many possible features that could be added, but the capstone emphasized shipping a complete product rather than building an unfinished collection of features.

If I were starting the project again, I would design the API contracts and testing strategy earlier and introduce code splitting earlier in the development process.

One thing that surprised me was how much engineering surrounds an AI feature. Validation, authentication, error handling, accessibility, testing, deployment, and documentation are just as important to the final user experience as the model response itself.

Conclusion

AI Prompt Studio demonstrates the complete frontend AI engineering workflow:

Problem
  ↓
Product Design
  ↓
Accessible UI
  ↓
AI Integration
  ↓
Structured Validation
  ↓
Error Handling
  ↓
Testing
  ↓
CI/CD
  ↓
Production Deployment

The final project successfully combines prompt management with meaningful AI functionality and production-focused engineering practices.

The final verification passed:

TypeScript: ✅
Vitest: ✅ 30/30
Playwright: ✅ 4/4
Production Build: ✅
Vercel Production: ✅
Author

HN Charan

FlyRank Frontend AI Engineering Internship

License

See the LICENSE file.

Project Links
Live Application: https://flyrank-capstone-dun.vercel.app
Login: https://flyrank-capstone-dun.vercel.app/login
GitHub Repository: https://github.com/ranc5291-dotcom/flyrank-capstone