import React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { createArticle } from "@/app/admin/actions";
import { db } from "@/lib/db";
import ImageUploadInput from "@/components/ImageUploadInput";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  // Fetch categories to show in dropdown
  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <div>
          <Link href="/admin/articles" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Articles
          </Link>
        </div>

        {/* Title */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Plus className="h-6 w-6 text-primary" /> Create Article / Blog Post
          </h1>
          <p className="text-xs text-slate-400 mt-1">Publish a new review, buying guide, side-by-side comparison, or blog update</p>
        </div>

        {/* Form */}
        <form action={createArticle} className="space-y-6 bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Slug */}
            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">URL Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                placeholder="e.g. best-air-fryers-under-5000"
                required
                className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-500 block">Use lowercase and dashes. No leading slash.</span>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label htmlFor="type" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Article/Post Type</label>
              <select
                id="type"
                name="type"
                required
                className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              >
                <option value="best">Buying Guide (Best Roundups)</option>
                <option value="review">Single Product Review</option>
                <option value="comparison">Side-by-Side Comparison</option>
                <option value="deal">Deals Showcase</option>
                <option value="blog">Standard Blog Post</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Article Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Best Digital Air Fryers Under ₹5000 in India (2026)"
              required
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Short Excerpt */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Short Excerpt (Seo Description)</label>
            <textarea
              id="description"
              name="description"
              rows={2}
              required
              placeholder="A brief summary of what you review or benchmark in this post..."
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-sans"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Category */}
            <div className="space-y-1.5">
              <label htmlFor="categorySlug" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Main Category</label>
              <select
                id="categorySlug"
                name="categorySlug"
                required
                className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name} ({cat.slug})
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label htmlFor="status" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Publishing Status</label>
              <select
                id="status"
                name="status"
                className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              >
                <option value="published">Published (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Author */}
            <div className="space-y-1.5">
              <label htmlFor="author" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Author Name</label>
              <input
                type="text"
                id="author"
                name="author"
                placeholder="e.g. Sneha Nair"
                className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label htmlFor="date" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Publish Date</label>
              <input
                type="text"
                id="date"
                name="date"
                placeholder="e.g. June 20, 2026"
                className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Rating (Reviews Only) */}
            <div className="space-y-1.5">
              <label htmlFor="rating" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Review Star Rating (Optional)</label>
              <input
                type="number"
                step="0.1"
                id="rating"
                name="rating"
                min="0"
                max="5"
                placeholder="e.g. 4.8"
                className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Unified Image Upload component */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Main Feature Image</span>
            <ImageUploadInput name="image" />
          </div>

          {/* SEO Meta Keywords */}
          <div className="space-y-1.5">
            <label htmlFor="keywords" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">SEO Keywords (Comma Separated)</label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              placeholder="e.g. air fryer reviews, best air fryers, kitchen appliances, healthy cooking"
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Long-form Blog Content */}
          <div className="space-y-1.5">
            <label htmlFor="content" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Long-form Blog Content (Supports HTML/Markdown, Optional)</label>
            <textarea
              id="content"
              name="content"
              rows={8}
              placeholder="For Standard Blog Posts, write your full article copy here..."
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-sans text-xs"
            />
          </div>

          {/* Custom Schema block */}
          <div className="space-y-1.5">
            <label htmlFor="schema" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Custom JSON-LD Schema (JSON format, Optional)</label>
            <textarea
              id="schema"
              name="schema"
              rows={4}
              placeholder='{ "@context": "https://schema.org", "@type": "NewsArticle", ... }'
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-mono text-xs"
            />
          </div>

          {/* Introduction */}
          <div className="space-y-1.5">
            <label htmlFor="introduction" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Introduction Paragraph (For Reviews/Buying Guides)</label>
            <textarea
              id="introduction"
              name="introduction"
              rows={4}
              placeholder="Write a catchy introduction setting up the testing parameters and review outline..."
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-sans"
            />
          </div>

          {/* Product Connections */}
          <div className="space-y-1.5">
            <label htmlFor="productIds" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Linked Product IDs (Comma Separated)</label>
            <input
              type="text"
              id="productIds"
              name="productIds"
              placeholder="e.g. solara-digital-air-fryer, philips-air-fryer-hd9252"
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono text-xs"
            />
            <span className="text-[10px] text-slate-500 block">Link products from the database catalog to automatically display their spec matrixes and product details inline.</span>
          </div>

          {/* Quick Recommendations (Guides Only) */}
          <div className="border border-slate-850 rounded-xl p-4 bg-slate-950/40 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Quick Recommendation Box (Optional Guides Only)</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label htmlFor="overallPickId" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Pick Product ID</label>
                <input
                  type="text"
                  id="overallPickId"
                  name="overallPickId"
                  placeholder="e.g. philips-air-fryer-hd9252"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 focus:border-primary px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="budgetPickId" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Best Value Product ID</label>
                <input
                  type="text"
                  id="budgetPickId"
                  name="budgetPickId"
                  placeholder="e.g. solara-digital-air-fryer"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 focus:border-primary px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="premiumPickId" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Premium Pick Product ID</label>
                <input
                  type="text"
                  id="premiumPickId"
                  name="premiumPickId"
                  placeholder="e.g. instant-pot-airfryer"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 focus:border-primary px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="quickRecSummary" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommendation Summary</label>
              <textarea
                id="quickRecSummary"
                name="quickRecSummary"
                rows={2}
                placeholder="Briefly state who should buy what pick..."
                className="w-full rounded-lg bg-slate-955 border border-slate-800 focus:border-primary px-3 py-1.5 text-xs text-white focus:outline-none resize-y"
              />
            </div>
          </div>

          {/* Top Picks Award Tags */}
          <div className="space-y-1.5">
            <label htmlFor="topPicks" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Top Picks Awards (Format: Product ID | Tag Name | Award Reason, One Per Line)</label>
            <textarea
              id="topPicks"
              name="topPicks"
              rows={3}
              placeholder="solara-digital-air-fryer | Best Budget & Capacity | Offers a massive capacity for small families under 5000.&#10;philips-air-fryer-hd9252 | Editor's Choice | Cooks foods the most consistently."
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-mono text-xs"
            />
          </div>

          {/* Buying Guide Sections */}
          <div className="space-y-1.5">
            <label htmlFor="buyingGuide" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Buying Guide Chapters (Format: Chapter Title === Chapter Content, Double Newline Separated)</label>
            <textarea
              id="buyingGuide"
              name="buyingGuide"
              rows={6}
              placeholder="How We Tested Air Fryers&#10;===&#10;We cooked frozen french fries, samosas, and roasted paneer across 30 days to measure heating speed, consistency, and mesh basket washing utility.&#10;&#10;What to look for before buying&#10;===&#10;Consider capacity, cleanability, digital touch presets, and electrical power consumption in watts."
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-sans text-xs"
            />
          </div>

          {/* FAQs */}
          <div className="space-y-1.5">
            <label htmlFor="faqs" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">FAQs (Format: Question === Answer, Double Newline Separated)</label>
            <textarea
              id="faqs"
              name="faqs"
              rows={4}
              placeholder="Can we use foil inside an air fryer?&#10;===&#10;Yes, but never run it preheating without food on top. The powerful convection fan will blow it directly into the heating element.&#10;&#10;How much power does it use?&#10;===&#10;It usually runs between 1400W and 1800W. Since cooking sessions are short, it uses very minimal electricity (around 3 to 5 INR per meal)."
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-sans text-xs"
            />
          </div>

          {/* Verdict (Single Review Only) */}
          <div className="space-y-1.5">
            <label htmlFor="verdict" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Final Verdict Statement (For single-product reviews)</label>
            <textarea
              id="verdict"
              name="verdict"
              rows={3}
              placeholder="For cooks who value absolute reliability and durability, this product represents the best premium benchmark..."
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-sans"
            />
          </div>

          {/* SEO Tags */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="seoTitle" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">SEO Meta Title</label>
              <input
                type="text"
                id="seoTitle"
                name="seoTitle"
                placeholder="Google Search title tag..."
                className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="seoDescription" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">SEO Meta Description</label>
              <input
                type="text"
                id="seoDescription"
                name="seoDescription"
                placeholder="Google Search description snippet..."
                className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover py-3 text-center text-sm font-black text-primary-text hover:shadow-lg hover:shadow-primary/10 active:scale-98 transition-all"
            >
              <Save className="h-4.5 w-4.5" /> Save and Publish Article
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
