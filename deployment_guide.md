# BrandBTSS Deployment & Architecture Guide

This guide details the architectural boundaries between the **Frontend (UI)** and **Backend (API, Database, and CMS)** components of the BrandBTSS platform, alongside step-by-step production deployment instructions.

---

## 1. Architectural Overview

BrandBTSS uses a modern **decoupled full-stack architecture** built on top of Next.js. While the code lives in a single repository for development simplicity, it separates concerns cleanly at runtime:

```mermaid
graph TD
    subgraph Client [Client Browser]
        UI[React 19 Frontend UI]
        EdgeCache[Edge CDN Cache]
    end

    subgraph AppServer [Next.js Full-Stack App Runtime]
        Router[Next.js App Router]
        Proxy[Basic Auth Proxy Middleware]
        APIs[API Routes /api/search, /api/redirect]
        Actions[Server Actions app/admin/actions.ts]
    end

    subgraph DataBackend [Data & Content Providers]
        DB[(PostgreSQL Database)]
        CMS[Sanity.io Content Lake]
    end

    UI <--> Router
    Router --> Proxy
    Proxy --> Actions & APIs
    Actions --> |Prisma Client| DB
    APIs --> |Prisma Client| DB
    Router -.-> |Sanity Client| CMS
    EdgeCache --> UI
```

---

## 2. Frontend vs. Backend Separation of Concerns

### Frontend Layer (UI & Presentation)
*   **Location**: `components/`, `styles/`, and UI files within `app/`.
*   **Role**: Handles page layout, interactivity, and design aesthetics.
*   **Key Tech**: React 19, Tailwind CSS v4, Lucide Icons, and client-side hooks.
*   **Optimizations**: 
    *   **Incremental Static Regeneration (ISR)**: Static pages (like reviews and comparisons) are pre-rendered at build time and cached at the CDN level. They are revalidated in the background every 1 hour (`export const revalidate = 3600`).
    *   **Next.js Image component (`<Image />`)**: Optimizes, resizes, and lazy-loads all images automatically to prevent Cumulative Layout Shift (CLS) and speed up LCP times.

### Backend Layer (Data, APIs, & Authentication)
*   **Location**: `app/api/`, `app/go/`, `app/admin/actions.ts`, and `lib/`.
*   **Role**: Manages database queries, affiliate redirection logs, authentication gates, and business logic.
*   **Key Tech**: Prisma ORM, Server Actions, Next.js Route Handlers.
*   **Security Mechanisms**:
    *   **Proxy Middleware (`proxy.ts`)**: Acts as a gateway gatekeeper. Intercepts incoming requests for `/admin/:path*` and requires a valid Basic Authentication header before forwarding.
    *   **Action Authorization Checks**: Inside `app/admin/actions.ts`, each write function calls `await verifyAdminAuth()`. Since Server Actions are HTTP POST endpoints exposed to the public, checking credentials inside the action logic prevents CSRF or API spoofing.
    *   **Open Redirect Prevention**: `/api/redirect/route.ts` parses and matches destination URLs against a strict whitelist of partner sub-domains (e.g. Amazon, Hostinger, impact.com) before redirecting.

---

## 3. Database Backend Setup (Neon / Supabase)

BrandBTSS uses Prisma ORM to interact with a PostgreSQL database.

### Step 1: Create Database Instance
1.  Sign up for a managed PostgreSQL provider (e.g., [Neon.tech](https://neon.tech/) or [Supabase](https://supabase.com/)).
2.  Create a new PostgreSQL database instance (Free tier is sufficient for blog and click tracking).
3.  Obtain your pooled connection string (usually formatted like `postgresql://username:password@hostname:5432/dbname?sslmode=require`).

### Step 2: Configure and Push Schemas
Prisma translates your relational schemas defined in `prisma/schema.prisma` directly into database tables.

1.  In your production environment variables (or local `.env`), add:
    ```bash
    DATABASE_URL="your-connection-string"
    ```
2.  Push schemas to create the required tables (`Category`, `Product`, `Comparison`, `Article`, `Click`, `Newsletter`):
    ```bash
    npx prisma db push
    ```

---

## 4. Headless CMS Backend Setup (Sanity.io)

Unbiased article roundups, ratings, and authors live in Sanity Content Lake.

### Step 1: Initialize Sanity Project
1.  Navigate to the [Sanity Manage Dashboard](https://www.sanity.io/manage) and create a project.
2.  Copy your `Project ID` and specify the dataset name (usually `production`).
3.  Add the project variables to your application environment:
    ```env
    NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_SANITY_DATASET="production"
    ```

### Step 2: Configure CORS Policies
To allow the frontend application to fetch articles and images from Sanity:
1.  In the Sanity Manage console, go to **Settings** > **API settings** > **CORS Origins**.
2.  Click **Add CORS Origin**.
3.  Enter your production website URL (e.g., `https://brandbtss.com`) and ensure **Allow Credentials** is checked.

---

## 5. Deployment Options for the Unified Runtime

### Option A: Managed Serverless Hosting (Vercel - Recommended)
Vercel handles edge caching, static page distribution, serverless backend functions, and global CDN propagation automatically.

1.  Push your codebase to a private Git repository (GitHub / GitLab / Bitbucket).
2.  Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3.  Import your repository.
4.  Configure the environment variables under **Environment Variables** (see checklist in section 6).
5.  Click **Deploy**. Vercel will build the frontend, compile the backend functions, run TypeScript checks, and go live.

### Option B: Self-Hosted Server (VPS / Dedicated Instance using Docker or PM2)
If you deploy to an independent VPS (Ubuntu, Debian) on DigitalOcean, AWS EC2, or Linode:

#### 1. Setup Node.js & PM2
Ensure Node.js v20+ and Prisma client are available.
```bash
# Install PM2 globally to manage the Node server process
npm install -g pm2

# Generate Prisma Client local modules
npx prisma generate

# Build the production Next.js artifact
npm run build

# Start the built server using PM2
pm2 start npm --name "brandbtss-site" -- start
```

#### 2. Using Docker Containerization
A standalone multi-stage Docker build encapsulates the frontend runtime and backend server environment.

Example `Dockerfile`:
```dockerfile
# Stage 1: Install dependencies and compile Prisma
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

# Stage 2: Rebuild the source code
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner container
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run using Docker:
```bash
docker build -t brandbtss-website .
docker run -p 3000:3000 --env-file .env brandbtss-website
```

---

## 6. Environment Variables Checklist

Ensure these variables are configured correctly in your deployment environment:

| Key | Tier | Description / Purpose | Example Value |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Backend** | Connection URL for managed PostgreSQL DB | `postgresql://user:pass@host:5432/db` |
| `ADMIN_USER` | **Backend** | Username required for Basic Auth on `/admin` | `admin` |
| `ADMIN_PASSWORD` | **Backend** | Password required for Basic Auth on `/admin` | `super-secret-password-xyz` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | **Full-Stack** | Public ID pointing to your Sanity project | `abcdefgh` |
| `NEXT_PUBLIC_SANITY_DATASET` | **Full-Stack** | Data channel for articles content | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION`| **Full-Stack** | Query API snapshot date | `2026-06-17` |
| `NEXT_PUBLIC_GTM_ID` | **Frontend** | (Optional) Google Tag Manager tracking ID | `GTM-XXXXXXX` |
