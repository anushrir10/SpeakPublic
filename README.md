# FixIt — AI Study Operating System

An AI-powered study platform for NCERT students.

## Monorepo Structure

apps/
├── web/ Next.js frontend (Christopher)
└── api/ Express backend (Prabodh)
packages/
├── shared/ Shared types for all packages
├── db/ Prisma database schema
└── ai/ RAG pipeline logic (Sarvesh)

## Setup

### Prerequisites

- Node.js 20+
- pnpm 9+

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Runs all apps in development mode.

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm type-check
```

### Lint

```bash
pnpm lint
```

## Deployment

- Frontend: Vercel
- Backend: Railway
- Database: Neon

## Team

- **Christopher** — Frontend (Next.js)
- **Prabodh** — Backend (Express)
- **Sarvesh** — AI/RAG (LangChain)

## Timeline

8 weeks (July 4 – Aug 28, 2026)

See BUILD_BLUEPRINT_V2.md for details.
