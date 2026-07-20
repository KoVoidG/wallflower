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

---

## 5. Team Development Workflow

To ensure smooth collaboration, our team divides frontend and backend responsibilities:

### Void — Frontend & Product Interface
* **Branch Conventions:**
  * `feature/ui-foundation`
  * `feature/onboarding-ui`
  * `feature/dashboard-ui`
  * `feature/simulation-ui`

### Thiha — Backend, Calculations, Persistence & AI
* **Branch Conventions:**
  * `feature/onboarding-backend`
  * `feature/dashboard-backend`
  * `feature/risk-engine`
  * `feature/simulation-engine`

### Shared Git Workflow
1. **Start from updated `main`:** Always synchronize your local main branch with remote before starting work:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a feature branch:** Create your scoped branch following conventions:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit only related work:** Keep commits small, atomic, and focused on the assigned task IDs.
4. **Push branch:** Push your branch to remote and set it as upstream (only needed on first push):
   ```bash
   git push -u origin feature/your-feature-name
   ```
   *For subsequent pushes, you can simply run:*
   ```bash
   git push
   ```
5. **Open a pull request:** Fill out description templates detailing changes and tasks completed.
6. **Execute local checks:** Before merging, verify that all quality gates pass locally and on GitHub CI:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```
7. **Merge only after review:** PR merges require a reviewer's sign-off and passing CI runs.
8. **Merge latest `main` into your feature branch:** Before beginning subsequent tasks or integrating work, pull main updates into your feature branch to handle conflicts:
   *Update your local main first:*
   ```bash
   git checkout main
   git pull origin main
   ```
   *Go back to your feature branch:*
   ```bash
   git checkout feature/your-feature-name
   ```
   *Merge latest main:*
   ```bash
   git merge main
   ```
   *(Alternatively, you can run `git fetch origin` followed by `git merge origin/main` to merge directly from the remote).*

> [!IMPORTANT]
> * **Do not commit directly to `main`:** Direct commits on `main` are strictly forbidden. All updates must go through feature branches and pull requests.
> * **Discuss Contract Changes First:** Changes to shared interfaces—Prisma database models, shared Zod validator schemas, calculation type contracts, or API endpoints—must be aligned with the other developer before writing the code. Modifications to shared boundaries impact both frontend and backend configurations.

