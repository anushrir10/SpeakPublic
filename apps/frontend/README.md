# FixIt Frontend

This is the React frontend for the FixIt platform, designed to be a digital study desk that transforms textbooks into an interactive learning experience with flashcards, conceptual quizzes, and personalized notes.

## Tech Stack
- **Framework:** React + Vite
- **Styling:** TailwindCSS + Vanilla CSS for custom animations/glassmorphism
- **Authentication:** Clerk (with local fallback if keys are missing)
- **Icons:** Phosphor Icons

## Features
- **Library / Bookshelf:** Select digitized textbooks by grade and board.
- **Interactive Reader:** Read chapters alongside an interactive summary panel. Highlighting text automatically triggers study tools.
- **Central Study Card:** Dynamically generated flashcards and multiple-choice quizzes for any selected concept.
- **FSRS Integration:** Fliping flashcards and answering quizzes correctly/incorrectly logs FSRS reviews (via the backend) for spaced repetition tracking.

## Architecture and Integration
The application runs as a module in the FixIt Turborepo (under `apps/frontend`).

### Authentication (`isClerkMode`)
The frontend is capable of running in two modes:
1. **Local Fallback Mode:** (Default when `.env` is empty) Uses `localStorage` to simulate a logged-in user. This allows testing UI functionality without needing backend secrets.
2. **Clerk Mode:** Uses `@clerk/clerk-react` for real user authentication. The `ClerkAwareProvider` extracts the access token and injects it into all backend requests.

### Backend Proxy
The Vite configuration (`vite.config.js`) defines a local proxy so any requests to `/api/*` and `/health` are routed directly to the Express backend (`http://localhost:3001`), avoiding CORS issues during local development.

### Services Layer (`src/services/api.js`)
Centralized Axios instance to communicate with the API:
- `retrieveContent(query)`: Finds relevant textbook chunks for the user's current selection.
- `reviewFlashcard(cardId, rating)`: Logs FSRS ratings (`1` = again, `3` = good, `4` = easy).

## Development Setup

1. Copy `.env` if not already present and configure it:
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:3001
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## State Management
- `LearningContext.jsx`: A unified Context Provider managing the currently active book, the reading page, the UI drawer states, and user sessions (whether local or Clerk).
