# FixIt Frontend — Comprehensive Documentation

> **FixIt** is a digital study desk that transforms NCERT textbooks into an interactive learning experience with flashcards, conceptual quizzes, AI Q&A, and personalized notes — all in one calm, focused space.

---

## Table of Contents

1. [Project Overview](#1-project-overview)  
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)  
3. [Directory Structure](#3-directory-structure)  
4. [Application Architecture](#4-application-architecture)  
5. [User Flow & Navigation](#5-user-flow--navigation)  
6. [Screen-by-Screen Breakdown](#6-screen-by-screen-breakdown)  
7. [Component Architecture](#7-component-architecture)  
8. [State Management](#8-state-management)  
9. [Data Flow](#9-data-flow)  
10. [API Integration](#10-api-integration)  
11. [Theming System](#11-theming-system)  
12. [Design System & Styling](#12-design-system--styling)  

---

## 1. Project Overview

FixIt is a **React + Vite** single-page application that serves as an interactive study desk for Indian school students. It digitizes NCERT textbooks and provides:

- **Bookshelf Library** — grade-and-board filtered textbook browsing  
- **Interactive Reader** — side-by-side textbook scans + enriched summaries  
- **Study Tools** — keyword-triggered definitions, flashcards, and MCQ quizzes  
- **FSRS Integration** — spaced repetition tracking via backend API  
- **AI Q&A Shell** — contextual "Ask FixIt" panel (streaming container for Week 3 AI)  
- **Dark/Light Theming** — animated View Transition API theme switching  

The frontend runs as a module inside the **FixIt Turborepo** monorepo (`apps/web`), alongside the backend API (`apps/api`) and shared packages.

---

## 2. Tech Stack & Dependencies

| Category | Technology | Version |
|---|---|---|
| **Framework** | React | ^19.2.7 |
| **Build Tool** | Vite | ^8.1.1 |
| **Styling** | TailwindCSS v4 + Vanilla CSS | ^4.3.2 |
| **Authentication** | Clerk (`@clerk/clerk-react`) | ^5.61.8 |
| **Icons** | Phosphor Icons (`@phosphor-icons/react`) | ^2.1.10 |
| **Animation** | Framer Motion | ^12.42.2 |
| **HTTP Client** | Axios | ^1.18.1 |
| **Confetti** | canvas-confetti | ^1.9.4 |
| **Supplementary Icons** | Lucide React | ^1.23.0 |

### Build Configuration

Vite is configured with:
- `@vitejs/plugin-react` — React Fast Refresh & JSX transform  
- `@tailwindcss/vite` — TailwindCSS v4 native Vite plugin  
- **Dev proxy** — `/api` and `/health` routes are proxied to `http://localhost:3001` (the backend API server)

---

## 3. Directory Structure

```
apps/web/
├── public/                       # Static assets (images, screenshots)
├── src/
│   ├── main.jsx                  # App entry point (Clerk wrapper)
│   ├── App.jsx                   # Root component (screen router)
│   ├── App.css                   # Component-specific styles
│   ├── index.css                 # Global design system (21KB+)
│   │
│   ├── components/               # UI Components
│   │   ├── Login.jsx             # Authentication screen
│   │   ├── Onboarding.jsx        # Student profile setup
│   │   ├── Library.jsx           # Bookshelf / book selection
│   │   ├── Reader.jsx            # Core reading workspace (783 lines)
│   │   ├── CentralStudyCard.jsx  # Flashcard + MCQ modal overlay
│   │   ├── ChapterNav.jsx        # Chapter dropdown navigator
│   │   ├── ContextualPanel.jsx   # "Ask FixIt" AI side panel
│   │   ├── SmoothInput.jsx       # Animated caret input component
│   │   ├── ThemeToggle.jsx       # Light/dark theme switcher
│   │   └── theme/
│   │       └── themeAnimations.js # View Transition API animation presets
│   │
│   ├── context/                  # React Context Providers
│   │   ├── LearningContext.jsx   # Core app state (auth, books, study)
│   │   └── ThemeContext.jsx      # Theme state (dark/light)
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   └── useChapters.js        # Chapter data fetching w/ fallback
│   │
│   ├── services/                 # API Service Layer
│   │   └── api.js                # Axios client + endpoint functions
│   │
│   ├── data/                     # Static Data
│   │   └── textbooks.js          # Full textbook content (46KB)
│   │
│   └── assets/                   # Bundled assets (images, fonts)
│
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
├── package.json                  # Dependencies & scripts
└── .env                          # Environment variables
```

---

## 4. Application Architecture

### 4.1 High-Level Architecture Diagram

```mermaid
graph TB
    subgraph Browser["Browser Runtime"]
        direction TB
        HTML["index.html"] --> Main["main.jsx"]
        Main --> ClerkCheck{"Clerk Key Valid?"}
        ClerkCheck -->|Yes| ClerkWrap["ClerkProvider"]
        ClerkCheck -->|No| DirectApp["App (No Clerk)"]
        ClerkWrap --> App["App.jsx"]
        DirectApp --> App

        subgraph AppShell["App Shell"]
            App --> TP["ThemeProvider"]
            TP --> LP["LearningProvider"]
            LP --> AC["AppContent (Screen Router)"]
        end

        subgraph Screens["Application Screens"]
            AC -->|"!user"| Login["Login"]
            AC -->|"!onboarding"| Onboard["Onboarding"]
            AC -->|"!activeBook"| Library["Library"]
            AC -->|"activeBook"| Reader["Reader"]
        end

        subgraph ReaderComposition["Reader Sub-Components"]
            Reader --> ChapterNav
            Reader --> LeftPage["Left Pane: Textbook Scan"]
            Reader --> RightPage["Right Pane: Interactive Summary"]
            Reader --> StudySidebar["Study Sidebar (Drawer)"]
            Reader --> FloatingActions["Floating Selection Actions"]
            Reader --> CentralStudyCard["CentralStudyCard (Modal)"]
            Reader --> ContextualPanel["ContextualPanel (Ask FixIt)"]
        end
    end

    subgraph Backend["Backend API (localhost:3001)"]
        HealthAPI["/health"]
        ChaptersAPI["/api/chapters"]
        ChunksAPI["/api/chunks"]
        RetrieveAPI["/api/retrieve"]
        FSRSAPI["/api/fsrs/review"]
    end

    Reader -.->|"Vite Proxy"| Backend
```

### 4.2 Component Hierarchy Tree

```mermaid
graph TD
    Root["main.jsx"] --> CP["ClerkProvider (conditional)"]
    CP --> AppComp["App"]
    AppComp --> ThemeProv["ThemeProvider"]
    ThemeProv --> LearnProv["LearningProvider"]
    LearnProv --> AppContent["AppContent"]

    AppContent --> Login
    AppContent --> Onboarding
    AppContent --> Library
    AppContent --> ReaderComp["Reader"]

    Login --> SmoothInput1["SmoothInput"]
    Login --> ThemeToggle1["ThemeToggle"]

    Onboarding --> ThemeToggle2["ThemeToggle"]

    Library --> ThemeToggle3["ThemeToggle"]

    ReaderComp --> ChapterNavComp["ChapterNav"]
    ReaderComp --> ThemeToggle4["ThemeToggle"]
    ReaderComp --> CentralStudyCardComp["CentralStudyCard"]
    ReaderComp --> ContextualPanelComp["ContextualPanel"]
    ContextualPanelComp --> SmoothInput2["SmoothInput"]

    ThemeToggle1 --> ThemeAnims["themeAnimations.js"]
    ThemeToggle2 --> ThemeAnims
    ThemeToggle3 --> ThemeAnims
    ThemeToggle4 --> ThemeAnims

    style Login fill:#FEF3E2,stroke:#D97757
    style Onboarding fill:#FEF3E2,stroke:#D97757
    style Library fill:#FEF3E2,stroke:#D97757
    style ReaderComp fill:#FEF3E2,stroke:#D97757
```

---

## 5. User Flow & Navigation

### 5.1 Complete User Journey Flowchart

```mermaid
flowchart TD
    Start([User Opens App]) --> ClerkEnabled{"Clerk Auth\nEnabled?"}

    ClerkEnabled -->|Yes| ClerkSignIn["Clerk SignIn Widget"]
    ClerkEnabled -->|No| LocalLogin["Local Login Form\n(Username + Password)"]

    ClerkSignIn -->|"Authenticated"| CheckOnboard
    LocalLogin -->|"Any credentials"| CheckOnboard{"Onboarding\nComplete?"}

    CheckOnboard -->|No| OnboardScreen["Onboarding Screen\n- Select Grade\n- Select Board\n- Select Subjects"]
    CheckOnboard -->|Yes| LibraryScreen

    OnboardScreen -->|"Submit"| LibraryScreen["Library / Bookshelf\n- Your Grade Shelf\n- Archive / Other Grades"]

    LibraryScreen -->|"Click Book"| ReaderScreen["Reader Workspace\n(Split-View Book Desk)"]

    subgraph ReaderActions["Reader Interactions"]
        ReaderScreen --> PageNav["Navigate Pages\n(Prev / Next)"]
        ReaderScreen --> ChapterSelect["Chapter Dropdown\n(Live API or Local)"]
        ReaderScreen --> ReadSummary["Read Interactive\nSummary"]
        ReadSummary --> KeywordClick["Click Pre-configured\nKeyword"]
        ReadSummary --> TextSelect["Select Custom Text"]

        KeywordClick --> StudyCard["CentralStudyCard Modal"]
        TextSelect --> FloatingPopover["Floating Action Popover"]

        FloatingPopover -->|"Ask FixIt"| AskPanel["Contextual Panel\n(AI Q&A Shell)"]
        FloatingPopover -->|"Flashcard"| StudyCard

        StudyCard --> DefTab["Definition Tab"]
        StudyCard --> FlashTab["Flashcard Tab\n(3D Flip)"]
        StudyCard --> QuizTab["MCQ Quiz Tab"]

        QuizTab -->|"Correct"| Confetti["Confetti 🎉\n+ FSRS Review"]
        QuizTab -->|"Incorrect"| Retry["Try Again\n+ FSRS Review"]
        FlashTab -->|"Flip"| FSRSFlash["FSRS Review\nLogged"]

        TextSelect --> OpenSidebar["Study Sidebar\n(Drawer)"]
        OpenSidebar --> Highlight["Apply Highlight"]
        OpenSidebar --> StickyNote["Save Sticky Note"]
        OpenSidebar --> HighlightStudy["Highlight & Study Card"]
    end

    ReaderScreen -->|"← Bookshelf"| LibraryScreen
    LibraryScreen -->|"Sign Out"| Start

    style Start fill:#D97757,stroke:#BD5D3A,color:#fff
    style StudyCard fill:#FEF3E2,stroke:#D97757
    style AskPanel fill:#FEF3E2,stroke:#D97757
```

### 5.2 Screen Routing Logic

The application uses a **state-driven router** (no React Router). The `AppContent` component determines the current screen by evaluating a cascade of conditions from `LearningContext`:

```mermaid
flowchart LR
    A["AppContent()"] --> B{"user\nexists?"}
    B -->|"null"| C["<Login />"]
    B -->|"object"| D{"onboarding\nexists?"}
    D -->|"null"| E["<Onboarding />"]
    D -->|"object"| F{"activeBook\nexists?"}
    F -->|"null"| G["<Library />"]
    F -->|"object"| H["<Reader />"]

    style C fill:#FFECB3
    style E fill:#C8E6C9
    style G fill:#BBDEFB
    style H fill:#F8BBD0
```

---

## 6. Screen-by-Screen Breakdown

### 6.1 Login Screen

**File:** `src/components/Login.jsx` (198 lines)

The login screen presents a split-layout:
- **Left panel (Desktop):** Dark gradient hero with brand name, tagline, and illustration
- **Right panel:** Authentication form on a warm "desk wood" background

**Dual Auth Modes:**
| Mode | Trigger | Behavior |
|---|---|---|
| **Clerk Mode** | Valid `VITE_CLERK_PUBLISHABLE_KEY` in `.env` | Renders Clerk's `<SignIn />` widget with themed appearance |
| **Local Fallback** | Missing or placeholder Clerk key | Manual username/password form (accepts any credentials) |

![Login screen with hero illustration on the left and authentication form on the right](homepage.jpeg)

---

### 6.2 Onboarding / Student Info Screen

**File:** `src/components/Onboarding.jsx` (196 lines)

A single-card form that collects the student's preferences to personalize their bookshelf:

| Section | Options | UI Pattern |
|---|---|---|
| **Academic Grade** | Class 10, 11, 12 | 3-column pill buttons |
| **Educational Board** | CBSE (NCERT), ICSE, State | Icon cards with sub-labels |
| **Study Subjects** | Computer Science, Biology | Toggle cards with checkmarks |

The selected configuration is persisted to `localStorage` (`ncert_onboarding`) and determines which books appear on the "Your shelf" section of the Library.

![Student onboarding — pick grade, board, and subjects to build a personalized bookshelf](studnt%20info.jpeg)

---

### 6.3 Library / Bookshelf Screen

**File:** `src/components/Library.jsx` (165 lines)

Displays digitized textbooks as **3D book covers** with gold-leaf styling, organized into two shelves:

1. **"Your [Grade] shelf"** — books matching the student's selected grade
2. **"Archive · other grades"** — remaining textbooks from the catalog

Each book cover features:
- Gradient background color from book metadata
- 3D spine shadow effect
- Simulated white page edges
- Gold border frame and foil typography

The header nameplate shows the user avatar, username, board, and grade info along with sign-out.

![Library bookshelf showing personalized grade shelf and archive](library.jpeg)

---

### 6.4 Reader / Book Workspace Screen

**File:** `src/components/Reader.jsx` (783 lines — the largest component)

The core workspace is a **split-view book desk** comprising:

| Zone | Description |
|---|---|
| **Top Bar** | ← Bookshelf button, ChapterNav dropdown, book title, page counter, theme toggle |
| **Left Pane** | Scanned textbook page image (or fallback rendered HTML) |
| **Spiral Gutter** | Decorative notebook spiral binding separator |
| **Right Pane** | Interactive summary with clickable keywords + text selection |
| **Bottom Bar** | Prev / Next page navigation with page counter |

![Book workspace with split-view layout — textbook scan left, interactive summary right](book%20workspace.jpeg)

#### 6.4.1 Chapter Navigation

The **ChapterNav** dropdown (`ChapterNav.jsx`, 118 lines) shows chapters sourced from either:
- **Live API** (`/api/chapters`) — labeled "live"
- **Local fallback** (derived from textbook pages) — labeled "local"

A badge in the dropdown header indicates the data source.

![Chapter navigation dropdown showing numbered chapter list](chapter%20nav%20.jpeg)

#### 6.4.2 Text Selection & Floating Actions

When a user selects text in the **right summary pane**, a floating popover appears at the selection with two actions:

| Button | Action |
|---|---|
| **Ask FixIt** | Opens the ContextualPanel (AI Q&A side panel) |
| **+ Flashcard** | Highlights text + opens CentralStudyCard in flashcard mode |

Additionally, a bottom toolbar appears with icons for quick actions (highlight, copy, note, sticky, more).

![Floating action buttons — Ask FixIt and Flashcard — appearing on text selection](fixit%20ai%20button.jpeg)

#### 6.4.3 Study Sidebar (Left Drawer)

A slide-out drawer on the left edge provides:
- **Active Selection** section — shows the currently selected text with definition and a sticky note input
- **Saved Highlights** section — list of all user-highlighted passages with notes
- Each highlight card has a "Study →" button and a delete action

![Study sidebar with active selection, definition, and saved highlights](sidepannel%20.jpeg)

---

### 6.5 CentralStudyCard (Modal Overlay)

**File:** `src/components/CentralStudyCard.jsx` (335 lines)

A full-screen modal overlay with three tabbed sections:

```mermaid
flowchart LR
    Trigger["Keyword Click\nor Flashcard Action"] --> Modal["CentralStudyCard\n(Full-screen Overlay)"]

    Modal --> Tab1["📖 Definition"]
    Modal --> Tab2["🔄 Flashcard"]
    Modal --> Tab3["❓ Concept Quiz"]

    Tab1 -->|"Open Flashcard →"| Tab2
    Tab2 -->|"Test with Quick Quiz →"| Tab3

    Tab2 -->|"Click to Flip"| FlipAnim["3D Card Flip\nAnimation"]
    Tab3 -->|"Submit Answer"| Grade{"Correct?"}
    Grade -->|"Yes ✓"| ConfettiAnim["Confetti 🎉\n+ FSRS: rating=4"]
    Grade -->|"No ✗"| RetryBtn["Try Again\n+ FSRS: rating=1"]

    style Modal fill:#FFF8F0,stroke:#D97757
```

| Tab | Content | Interaction |
|---|---|---|
| **Definition** | Term name, academic definition | "Open Flashcard →" CTA |
| **Flashcard** | 3D flip card (front: question, back: answer) | Click to flip; logs FSRS review on tab change |
| **Concept Quiz** | MCQ with 4 options | Submit → correct/incorrect feedback + confetti |

![Flashcard modal showing concept question with flip-to-reveal interaction](flashcard.jpeg)

---

### 6.6 Contextual Panel (Ask FixIt)

**File:** `src/components/ContextualPanel.jsx` (245 lines)

A **right-side slide-out panel** that serves as the AI Q&A conversation container:

- Shows the selected passage as context
- Provides **suggestion chips**: "Explain this in simple terms", "Why does this matter?", "Give me an example"
- Contains a chat-style conversation thread with user bubbles and assistant response slots
- Currently renders **placeholder skeleton** responses (Week 3 will wire live AI streaming)
- Includes a composer input at the bottom with a send button
- "Or turn this selection into a flashcard" secondary action

![Ask FixIt contextual AI panel with selected passage and question suggestions](sidepannel%20.jpeg)

---

## 7. Component Architecture

### 7.1 Component Responsibility Matrix

| Component | Lines | Primary Responsibility | Key Dependencies |
|---|---|---|---|
| `Reader.jsx` | 783 | Core reading workspace, text selection, page navigation, state orchestration | `LearningContext`, `useChapters`, `CentralStudyCard`, `ChapterNav`, `ContextualPanel` |
| `CentralStudyCard.jsx` | 335 | Study card modal (Definition / Flashcard / Quiz tabs) | `LearningContext`, `canvas-confetti`, `api.reviewFlashcard` |
| `ContextualPanel.jsx` | 245 | AI Q&A conversation shell | `SmoothInput` |
| `SmoothInput.jsx` | 261 | Animated caret text input with spring physics | `framer-motion` |
| `Login.jsx` | 198 | Dual-mode authentication screen | `LearningContext`, `SmoothInput`, `Clerk` |
| `Onboarding.jsx` | 196 | Student profile setup wizard | `LearningContext`, `Phosphor Icons` |
| `Library.jsx` | 165 | Textbook bookshelf browser | `LearningContext`, `textbooks.js` |
| `ChapterNav.jsx` | 118 | Chapter dropdown navigator | - |
| `ThemeToggle.jsx` | 81 | Animated theme switcher button | `ThemeContext`, `themeAnimations.js`, `framer-motion` |

### 7.2 Component Interaction Flow (Reader)

```mermaid
sequenceDiagram
    participant U as User
    participant R as Reader
    participant CN as ChapterNav
    participant API as Backend API
    participant CSC as CentralStudyCard
    participant CP as ContextualPanel

    U->>R: Select text in summary pane
    R->>R: handleTextSelection()
    R->>R: Show floating popover at selection

    alt User clicks "Ask FixIt"
        U->>R: Click "Ask FixIt"
        R->>CP: setAskOpen(true) + setAskSelection(text)
        CP->>U: Slide-in panel with passage context
        U->>CP: Type question or click suggestion
        CP->>CP: submit(question)
        Note over CP: Week 3: onAsk() calls AI API
    else User clicks "Flashcard"
        U->>R: Click "Flashcard"
        R->>API: retrieveContent(text)
        R->>R: applyHighlightAndStudy()
        R->>CSC: selectConcept(customConcept)
        CSC->>U: Modal overlay with Definition tab
        U->>CSC: Navigate tabs
        U->>CSC: Flip flashcard
        CSC->>API: reviewFlashcard(cardId, rating)
        U->>CSC: Submit MCQ answer
        CSC->>API: reviewFlashcard(cardId, rating)
    end

    U->>CN: Click chapter dropdown
    CN->>U: Show chapter list
    U->>CN: Select a chapter

    alt Local fallback chapter
        CN->>R: handleSelectChapter({__local: true})
        R->>R: setActivePageNum(chapter.__pageNumber)
    else Live API chapter
        CN->>R: handleSelectChapter(chapter)
        R->>API: fetchChunks(chapter.id)
        API->>R: Chunk[] data
        R->>R: setApiChunks(chunks)
        R->>U: Render live chunks in summary pane
    end
```

---

## 8. State Management

### 8.1 Context Architecture

FixIt uses **two React Context providers** stacked at the app root:

```mermaid
graph TD
    subgraph Providers["Context Provider Stack"]
        ThemeCtx["ThemeProvider\n(theme, toggle, setTheme)"]
        ThemeCtx --> LearnCtx["LearningProvider\n(user, books, study state)"]
    end

    subgraph LearnProviderInternal["LearningProvider Internals"]
        direction TB
        LearnCtx --> ClerkCheck{"isClerkEnabled?"}
        ClerkCheck -->|Yes| ClerkAware["ClerkAwareProvider\n- Derives user from Clerk\n- Wires auth token to API"]
        ClerkCheck -->|No| LocalProv["LocalProvider\n- localStorage user\n- Manual login/logout"]
        ClerkAware --> Shared["SharedProvider\n(Common State Layer)"]
        LocalProv --> Shared
    end

    style ThemeCtx fill:#E8EAF6,stroke:#5C6BC0
    style LearnCtx fill:#FFF3E0,stroke:#FF9800
    style Shared fill:#E8F5E9,stroke:#4CAF50
```

### 8.2 LearningContext State Map

| State Variable | Type | Persistence | Description |
|---|---|---|---|
| `user` | `{ username, loggedIn, clerkId? }` | `localStorage` (local mode) / Clerk session | Current authenticated user |
| `onboarding` | `{ grade, board, subjects }` | `localStorage` (`ncert_onboarding`) | Student's grade/board/subject preferences |
| `activeBook` | `Object` | None (session only) | Currently opened textbook from `textbooks.js` |
| `activePageNum` | `number` | None | Current page number within the active book |
| `activeConceptKey` | `string` | None | Key of the active pre-defined concept (or `"custom"`) |
| `activeCustomConcept` | `Object` | None | Dynamically generated concept from user highlight |
| `sidePanelOpen` | `boolean` | None | Whether the CentralStudyCard modal is visible |
| `activeTab` | `string` | None | Active tab in CentralStudyCard (`definition` / `flashcard` / `mcq`) |
| `completedMCQs` | `Object` | `localStorage` (`ncert_mcq_progress`) | Map of `{bookId}-{conceptKey}` → `true` for completed quizzes |
| `isClerkMode` | `boolean` | N/A (derived) | Whether Clerk authentication is active |

### 8.3 ThemeContext State Map

| State Variable | Type | Persistence | Description |
|---|---|---|---|
| `theme` | `"light" \| "dark"` | `localStorage` (`fixit_theme`) | Active color theme |
| `resolvedTheme` | `string` | N/A (derived) | Same as `theme` (alias) |

### 8.4 Reader Component Local State

The Reader manages significant local state beyond context:

| State | Type | Purpose |
|---|---|---|
| `selPos` | `{ x, y }` | Viewport coordinates for floating selection popover |
| `selectionText` | `string` | Currently selected text in the summary pane |
| `sidebarOpen` | `boolean` | Left study sidebar drawer visibility |
| `noteInput` | `string` | Text area content for sticky notes |
| `userHighlights` | `string[]` | Highlighted text passages (persisted per book) |
| `userNotes` | `Object` | Notes keyed by highlight text (persisted per book) |
| `isFlipping` | `"next" \| "prev" \| null` | Page flip animation state |
| `mobileTab` | `"book" \| "summary"` | Mobile viewport tab toggle |
| `askOpen` | `boolean` | ContextualPanel visibility |
| `askSelection` | `string` | Text passed to ContextualPanel |
| `selectedChapterId` | `string` | Live chapter selection from API |
| `apiChunks` | `Chunk[]` | Content chunks from `/api/chunks` |

---

## 9. Data Flow

### 9.1 Textbook Data Flow

```mermaid
flowchart TD
    subgraph Static["Static Data Layer"]
        TextbookJS["textbooks.js (46KB)\nFull book catalog with:\n- id, title, subject, grade, board\n- coverColor (gradient class)\n- pages[] with:\n  · pageNumber\n  · imageUrl (textbook scan)\n  · originalText (HTML)\n  · interactiveSummary (HTML with {keyword} markers)\n  · concepts{} (term definitions, flashcards, MCQs)"]
    end

    subgraph Context["Context Layer"]
        LC["LearningContext"]
        LC -->|"selectBook(id)"| ActiveBook["activeBook"]
        LC -->|"setActivePageNum(n)"| ActivePage["activePageNum"]
    end

    subgraph Render["Rendering"]
        ActiveBook --> Library["Library filters books by grade"]
        ActiveBook --> ReaderLeft["Reader: Left pane renders\npage.imageUrl or page.originalText"]
        ActivePage --> ReaderRight["Reader: Right pane renders\npage.interactiveSummary\n(parsed for {keyword} triggers)"]
        ReaderRight --> ConceptMap["page.concepts{}\nmapped to clickable highlights"]
    end

    TextbookJS --> LC

    style TextbookJS fill:#FFF9C4,stroke:#F9A825
```

### 9.2 Study Card Data Flow

```mermaid
flowchart TD
    subgraph Sources["Concept Sources"]
        PreDefined["Pre-defined Concept\n(from page.concepts{})"]
        UserHighlight["User-highlighted Text\n(dynamically generated)"]
    end

    PreDefined -->|"selectConcept('clone')"| LC["LearningContext\nactiveConceptKey = 'clone'"]
    UserHighlight -->|"selectConcept({...})"| LC2["LearningContext\nactiveConceptKey = 'custom'\nactiveCustomConcept = {...}"]

    LC --> CSC["CentralStudyCard"]
    LC2 --> CSC

    CSC --> Def["Definition Tab\nterm + definition"]
    CSC --> Flash["Flashcard Tab\nfront/back content"]
    CSC --> MCQ["MCQ Tab\nquestion + options + correctIndex"]

    MCQ -->|"Answer submitted"| FSRS["POST /api/fsrs/review\n{ cardId, rating }"]
    Flash -->|"Card flipped + tab changed"| FSRS

    style CSC fill:#E3F2FD,stroke:#1976D2
```

### 9.3 Authentication Data Flow

```mermaid
flowchart TD
    Entry["main.jsx"] --> Check{"VITE_CLERK_PUBLISHABLE_KEY\nvalid?"}

    Check -->|Yes| ClerkPath["ClerkProvider wraps App"]
    Check -->|No| LocalPath["App renders directly"]

    ClerkPath --> CAP["ClerkAwareProvider"]
    CAP --> ClerkUser["useUser() → user object"]
    CAP --> ClerkAuth["useAuth() → getToken()"]
    ClerkAuth --> SetAuth["setAuthTokenGetter(getToken)"]
    SetAuth --> AxiosInterceptor["Axios request interceptor\ninjects Bearer token"]

    LocalPath --> LP["LocalProvider"]
    LP --> LSUser["localStorage('ncert_user')\n→ user object"]
    LP --> ManualLogin["login(username) → setLocalUser()"]

    CAP --> SharedProv["SharedProvider"]
    LP --> SharedProv
    SharedProv --> ContextValue["LearningContext.Provider value={...}"]

    style ClerkPath fill:#E8F5E9,stroke:#4CAF50
    style LocalPath fill:#FFF3E0,stroke:#FF9800
```

---

## 10. API Integration

### 10.1 API Service Layer

**File:** `src/services/api.js` (106 lines)

An Axios instance configured with:
- **Base URL:** `VITE_API_URL` env variable or `http://localhost:3001`
- **Timeout:** 10 seconds
- **Auth interceptor:** Automatically injects Clerk Bearer token (when available)
- **Vite proxy:** In development, `/api` and `/health` requests are proxied to the backend

### 10.2 API Endpoints

```mermaid
flowchart LR
    subgraph Frontend["Frontend API Functions"]
        HC["healthCheck()"]
        RC["retrieveContent(query)"]
        FC["fetchChapters()"]
        FCH["fetchChapter(id)"]
        FCK["fetchChunks(chapterId)"]
        RF["reviewFlashcard(cardId, rating)"]
    end

    subgraph Backend["Backend Endpoints"]
        H["/health"]
        R["/api/retrieve"]
        C["/api/chapters"]
        CI["/api/chapters/:id"]
        CK["/api/chunks?chapterId=x"]
        FS["/api/fsrs/review"]
    end

    HC --> H
    RC --> R
    FC --> C
    FCH --> CI
    FCK --> CK
    RF --> FS

    style Frontend fill:#E3F2FD,stroke:#1976D2
    style Backend fill:#F3E5F5,stroke:#7B1FA2
```

| Function | Method | Endpoint | Used By | Purpose |
|---|---|---|---|---|
| `healthCheck()` | GET | `/health` | — | Verify backend connectivity |
| `retrieveContent(query)` | POST | `/api/retrieve` | Reader (text selection) | Search content chunks by query text |
| `fetchChapters()` | GET | `/api/chapters` | `useChapters` hook | List all chapters (ordered by number) |
| `fetchChapter(id)` | GET | `/api/chapters/:id` | — | Get single chapter with chunks |
| `fetchChunks(chapterId)` | GET | `/api/chunks` | Reader (chapter select) | Get all chunks for a chapter |
| `reviewFlashcard(cardId, rating)` | POST | `/api/fsrs/review` | CentralStudyCard | Submit FSRS spaced repetition review |

### 10.3 useChapters Hook

**File:** `src/hooks/useChapters.js` (68 lines)

A resilient data-fetching hook that:

```mermaid
flowchart TD
    Mount["Hook mounts"] --> Fetch["fetchChapters()"]
    Fetch --> Check{"Response\nArray.length > 0?"}
    Check -->|Yes| Live["chapters = API data\nisFallback = false"]
    Check -->|No/null| Fallback["chapters = deriveFallback(activeBook)\nisFallback = true"]
    Fallback --> LocalChapters["Map book.pages → chapters\nwith __local: true, __pageNumber"]

    style Live fill:#C8E6C9,stroke:#4CAF50
    style Fallback fill:#FFF9C4,stroke:#F9A825
```

**Return value:** `{ chapters, loading, error, isFallback, reload }`

---

## 11. Theming System

### 11.1 Theme Architecture

```mermaid
flowchart TD
    Init["App loads"] --> GetInit["getInitialTheme()"]
    GetInit --> CheckLS{"localStorage\n'fixit_theme'?"}
    CheckLS -->|"'light' or 'dark'"| UseStored["Use stored value"]
    CheckLS -->|Missing| CheckMedia{"prefers-color-scheme:\ndark?"}
    CheckMedia -->|Yes| UseDark["theme = 'dark'"]
    CheckMedia -->|No| UseLight["theme = 'light'"]

    UseStored --> ThemeState["ThemeContext state"]
    UseDark --> ThemeState
    UseLight --> ThemeState

    ThemeState --> Effect["useEffect sync"]
    Effect --> ClassToggle["document.documentElement\n.classList.add/remove('dark')"]
    Effect --> SchemeSet["style.colorScheme = theme"]
    Effect --> Persist["localStorage.setItem('fixit_theme', theme)"]

    subgraph Toggle["Toggle Mechanism"]
        User["User clicks ThemeToggle"] --> CreateAnim["createAnimation(variant, start, blur)"]
        CreateAnim --> InjectCSS["Inject transition CSS"]
        InjectCSS --> ViewTransition["document.startViewTransition()"]
        ViewTransition --> SwitchTheme["setTheme(opposite)"]
    end

    style Toggle fill:#E8EAF6,stroke:#5C6BC0
```

### 11.2 View Transition Animations

The `ThemeToggle` component supports multiple transition variants via `themeAnimations.js`:
- `circle` — circular clip-path expansion from the toggle button
- `rectangle` — rectangular wipe transition
- `polygon` — polygon morph transition
- `circle-blur` — circle with blur effect
- `gif` — animated image overlay transition

The CSS is dynamically injected into a `<style>` tag using the View Transitions API (`document.startViewTransition()`).

### 11.3 CSS Custom Properties (Dark Mode)

The dark theme is applied via `.dark` class on `<html>`, with all custom properties scoped under `:root.dark` in `index.css`. Key overrides include:
- Background surfaces → deep dark tones
- Text colors → light/white variants
- Component borders → darker dividers
- Book desk wood texture → chalkboard-style dark surface

---

## 12. Design System & Styling

### 12.1 CSS Architecture

The styling uses a hybrid approach:
- **TailwindCSS v4** — utility-first classes for layout, spacing, typography
- **Vanilla CSS** (`index.css`, 21KB+) — custom design tokens, animations, and component styles

### 12.2 Design Tokens

| Token | Light Value | Purpose |
|---|---|---|
| `--clay` | `#D97757` | Primary brand color (warm terracotta) |
| `--clay-dark` | `#BD5D3A` | Darker brand accent |
| `--clay-tint` | `#FEF3E2` | Light brand background tint |
| `--ink-soft` | `#78716C` | Secondary text color |
| `--desk-wood` | Warm beige gradient | Page background texture |
| `--chalkboard-green` | `#2D6A4F` | Accent for correct answers / caret |

### 12.3 Key CSS Components

| Class | Description |
|---|---|
| `.desk-wood` | Warm wood-texture background for all major page surfaces |
| `.grain-overlay` | Film grain texture overlay for depth |
| `.leather-mat` | Card container with leather-like shadow and border styling |
| `.bookshelf-wood` | Wooden shelf background for book display |
| `.book-cover` | 3D book cover with hover tilt animation |
| `.book-spine-effect` | Left-edge shadow simulating a book spine |
| `.book-pages-strip` | Right-edge white strip simulating book pages |
| `.index-card` | Lined paper card style for the summary pane |
| `.spiral-ring` | Notebook spiral binding decoration |
| `.flip-card` / `.flip-card-inner` | 3D CSS flip card animation container |
| `.tactile-btn` / `.tactile-btn-primary` | Button styles with press-down transform |
| `.tactile-input` | Input field with warm border and focus ring |
| `.highlight-trigger` | Clickable keyword styling with underline effect |
| `.printed-page` | Page styling mimicking printed paper |

### 12.4 Animation Library

| Animation Class | Effect | Used In |
|---|---|---|
| `animate-fade-up` | Fade in + slide up from below | Login, Onboarding, Library |
| `animate-fade-in` | Simple opacity fade in | Error messages, hints |
| `animate-slide-in-right-page` | Slide in from right | Library entry |
| `animate-slide-out-right` | Slide out to right | Onboarding exit |
| `animate-card-in` | Scale + fade entrance | CentralStudyCard modal |
| `animate-tab-in` | Content fade for tab switches | Study card tab content |
| `animate-pop-in` | Pop scale animation | Floating selection popover |
| `animate-scale-in` | Scale up from origin | ChapterNav dropdown |
| `animate-float` | Gentle floating motion | Mobile brand icon |
| `animate-flip-left` / `animate-flip-right` | Page flip rotation | Reader page navigation |

### 12.5 Typography

| Usage | Font Stack |
|---|---|
| **Headings** (`.font-heading`) | System serif / editorial font |
| **Body** (`.font-body`) | System sans-serif / Inter-style font |

### 12.6 Responsive Strategy

| Breakpoint | Behavior |
|---|---|
| **Mobile** (`< md`) | Single-column layout with tab switcher (Book / Summary Desk) |
| **Tablet** (`md`) | Split-view reader appears, sidebar hidden by default |
| **Desktop** (`lg+`) | Full split layout with hero panel on Login, spiral gutter visible |

---

> **Note:** This documentation reflects the Week 2 state of the FixIt frontend. Week 3 will introduce live AI streaming into the ContextualPanel and may add additional API integrations.
