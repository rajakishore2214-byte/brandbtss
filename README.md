# Freelancer & Solopreneur Tools Affiliate Site (Next.js + Sanity)

This is a production-ready, SEO-optimized affiliate marketing content site built with Next.js 14+ (App Router) and Sanity.io headless CMS. It publishes comparison/roundup posts and single-product review posts, with custom inline components and cloaked affiliate redirects.

---

## Technical Stack
- **Framework:** Next.js 16 (App Router, React 19)
- **CMS:** Sanity.io
- **Styling:** Tailwind CSS v4
- **Rendering:** Static Site Generation (SSG) with Incremental Static Regeneration (ISR) revalidated every hour.

---

## Getting Started

### 1. Environment Configuration
Create a `.env.local` file in the root directory and copy the contents from `.env.example`:
```bash
cp .env.example .env.local
```
Fill in your Sanity project details:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your project ID from [sanity.io/manage](https://www.sanity.io/manage)
- `NEXT_PUBLIC_SANITY_DATASET`: Usually `production`
- `NEXT_PUBLIC_SANITY_API_VERSION`: `2026-06-17` (or current date)

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the website.

---

## Sanity Studio Setup

The Sanity configuration is located under `/sanity/sanity.config.ts` and the schemas are defined in `/sanity/schemaTypes`.

### Run Sanity Studio locally
You can start the local Sanity development studio using the package manager script:
```bash
npm run sanity
```
*(Or run `npx sanity dev` directly from the project root).*

### Schema Definitions
- `post` (document): Standard article template containing dynamic page options for reviews and roundups. Support for inline Portable Text components (`productCard`, `comparisonTable`, `verdictBox`).
- `productCard` (document): Reusable product detail card. Contains ratings, tagline, pros, cons list, price details, and affiliate routing slug.
- `comparisonTable` (object): Configures comparisons between different tools.
- `verdictBox` (object): Configures highlighting a roundup winner.
- `author` (document): Editorial credentials description.

### Seed Sample Data
A pre-formatted JSON file of sample articles, authors, and product cards is provided in `/data/seed-data.json`. You can import these directly into your Sanity dataset using the Sanity CLI:
```bash
npx sanity dataset import ./data/seed-data.json production
```

---

## Affiliate Redirection System

Outbound affiliate links are routed through `/go/{affiliateSlug}` for cloaking and crawler-safe SEO practices.

1. **Mapping Directory:** Edit [/lib/affiliateLinks.ts](file:///e:/brandbtss-website/lib/affiliateLinks.ts) to map a clean slug to a partner affiliate tracking link:
   ```ts
   export const affiliateLinks: Record<string, { url: string; network?: string }> = {
     "bonsai-invoicing": {
       url: "https://bonsai.sjv.io/c/123456/78910/bonsai-invoice-tool",
       network: "Impact",
     },
   };
   ```
2. **Behavior:** Outbound links render in the UI using the `<AffiliateButton slug="bonsai-invoicing" />` component which outputs `<a href="/go/bonsai-invoicing" rel="nofollow sponsored" target="_blank">`.
3. **Redirection Route:** The Next.js endpoint `/app/go/[slug]/route.ts` captures clicks, logs click events for tracking, and issues a `307 Temporary Redirect` to the destination URL.

---

## Search Engine Optimization (SEO) & Structured Data

- **Metadata Generation:** Dynamic routing `/[postType]/[slug]` uses `generateMetadata` to read SEO titles, descriptions, canonical URLs, and OpenGraph parameters.
- **Structured Data:** The `<SchemaMarkup />` component dynamically injects JSON-LD scripts based on post types:
  - `Review` schema for review articles.
  - `ItemList` wrapping `Product` schemas for roundups.
  - `BreadcrumbList` on all pages.
- **Sitemap & Robots:** `/app/sitemap.ts` builds sitemaps dynamically using Sanity data. `/app/robots.ts` allows all indexing except the redirect utility path `/go/*`.

---

## Vercel Deployment

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Set the following Environment Variables in Vercel:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
4. Deploy the application.
