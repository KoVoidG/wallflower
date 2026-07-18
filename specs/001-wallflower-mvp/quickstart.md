# Wallflower Developer Quickstart Guide

This guide provides instructions to set up the local development environment for the Wallflower MVP application.

---

## 1. Technical Stack Baseline
* **Framework:** Next.js 16.2 App Router
* **UI Core:** React 19.2 + shadcn/ui + Radix UI
* **Styling:** Tailwind CSS v4.3.3 (CSS-first config)
* **Database & ORM:** Neon PostgreSQL + Prisma ORM 6.3.0
* **Authentication:** Better Auth 1.6.23
* **AI Advisor:** Gemini API via `@google/genai` 2.12.0
* **Runtime/Platform:** Node.js 22 LTS (Minimum supported: Node.js 20.9)
* **Package Manager:** npm

---

## 2. Prerequisites
* **Node.js:** Make sure you are running Node.js 22.x (`node -v`).
* **npm:** `npm -v` matching Node 22.
* **Docker/Postgres (Optional for offline dev):** A running PostgreSQL instance if not using Neon remote database.

---

## 3. Local Setup Instructions

### Step 1: Install Dependencies
Install all production and dev dependencies:
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to a local `.env` file:
```bash
cp .env.example .env
```
Update the `.env` file with your credentials (database connection URLs, Google OAuth API keys, Better Auth secret, and Gemini API keys). Note that `.env` is already configured in `.gitignore` to prevent credentials from leaking.

### Step 3: Run Database Migrations (Phase 2+)
Once the Prisma schema is defined, generate types and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### Step 4: Run local development server
Start the dev environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 4. Quality Control & Dev Commands

Ensure your code conforms to project standards by executing these commands before pushing:

### Linting
Runs ESLint Flat Config checks:
```bash
npm run lint
```
Auto-fixes simple lint errors:
```bash
npm run lint:fix
```

### Type Checking
Runs compile checks via TypeScript strict compiler:
```bash
npm run typecheck
```

### Testing
Run unit and integration component tests via Vitest:
```bash
npm run test
```
To run tests in watch mode during coding:
```bash
npm run test:watch
```

### Code Formatting
Prettier style verification:
```bash
npm run format:check
```
Auto-formats code files matching Prettier config (2-space indent, single quotes, semicolons):
```bash
npm run format
```

### End-to-End Tests
Execute Chromium integration tests using Playwright:
```bash
npm run test:e2e
```

### Production Compiles
Verifies that Next.js successfully compiles the production bundles:
```bash
npm run build
```
To preview the compiled production server locally:
```bash
npm run start
```
