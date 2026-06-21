import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Save, Edit } from "lucide-react";
import { updateArticle } from "@/app/admin/actions";
import { db } from "@/lib/db";
import ImageUploadInput from "@/components/ImageUploadInput";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch article
  const article = await db.article.findUnique({
    where: { id }
  });

  if (!article) {
    notFound();
  }

  // Fetch categories to show in dropdown
  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  });

  // Fetch related articles/products in the same category for the Internal Linking Assistant
  const relatedArticles = await db.article.findMany({
    where: {
      categorySlug: article.categorySlug,
      id: { not: article.id }
    },
    take: 5,
    select: { id: true, title: true, slug: true, type: true }
  });

  const relatedProducts = await db.product.findMany({
    where: { categorySlug: article.categorySlug },
    take: 5,
    select: { id: true, name: true }
  });

  // Re-parse helpers
  const productIdsRaw = article.productIds ? (JSON.parse(article.productIds) as string[]).join(", ") : "";
  
  const quickRecs = article.quickRecommendation ? JSON.parse(article.quickRecommendation) as {
    overallPickId?: string;
    budgetPickId?: string;
    premiumPickId?: string;
    summary?: string;
  } : null;

  const topPicksList = article.topPicks ? JSON.parse(article.topPicks) as {
    productId: string;
    tag: string;
    awardReason?: string;
  }[] : [];
  const topPicksRaw = topPicksList
    .map((p) => `${p.productId} | ${p.tag} | ${p.awardReason || ""}`)
    .join("\n");

  const buyingGuideList = article.buyingGuide ? JSON.parse(article.buyingGuide) as {
    title: string;
    content: string;
  }[] : [];
  const buyingGuideRaw = buyingGuideList
    .map((g) => `${g.title}\n===\n${g.content}`)
    .join("\n\n");

  const faqsList = article.faqs ? JSON.parse(article.faqs) as {
    question: string;
    answer: string;
  }[] : [];
  const faqsRaw = faqsList
    .map((f) => `${f.question}\n===\n${f.answer}`)
    .join("\n\n");

  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
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
            <Edit className="h-6 w-6 text-primary" /> Edit Article: {article.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">Modify article slugs, formatting structure, SEO tags, or publication state</p>
        </div>

        {/* Form */}
        <form action={updateArticle} className="space-y-6 bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
          
          {/* Read-only ID */}
          <input type="hidden" name="id" value={article.id} />

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Slug */}
            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">URL Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                defaultValue={article.slug}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label htmlFor="type" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Article/Post Type</label>
              <select
                id="type"
                name="type"
                defaultValue={article.type}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
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
              defaultValue={article.title}
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
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
              defaultValue={article.description}
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
                defaultValue={article.categorySlug}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
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
                defaultValue={article.status || "published"}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
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
                defaultValue={article.author || ""}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label htmlFor="date" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Publish Date</label>
              <input
                type="text"
                id="date"
                name="date"
                defaultValue={article.date || ""}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
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
                defaultValue={article.rating || ""}
                className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Unified Image Upload component */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Main Feature Image</span>
            <ImageUploadInput defaultValue={article.image} name="image" />
          </div>

          {/* SEO Meta Keywords */}
          <div className="space-y-1.5">
            <label htmlFor="keywords" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">SEO Keywords (Comma Separated)</label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              defaultValue={article.keywords || ""}
              placeholder="e.g. air fryer reviews, best air fryers, kitchen appliances"
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
              defaultValue={article.content || ""}
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
              defaultValue={article.schema || ""}
              placeholder='{ "@context": "https://schema.org", "@type": "NewsArticle", ... }'
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-mono text-xs"
            />
          </div>

          {/* Introduction */}
          <div className="space-y-1.5">
            <label htmlFor="introduction" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Introduction Paragraph</label>
            <textarea
              id="introduction"
              name="introduction"
              rows={4}
              required
              defaultValue={article.introduction}
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
              defaultValue={productIdsRaw}
              className="w-full rounded-xl bg-slate-955 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono text-xs"
            />
          </div>

          {/* Internal Linking Assistant */}
          <div className="border border-slate-850 rounded-xl p-4 bg-slate-950/40 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary block">
              Internal Linking Assistant
            </h3>
            <p className="text-[11px] text-slate-400">
              Copy these links and product IDs in your category ({article.categorySlug}) to use in your post:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-300 uppercase block tracking-wider">Related Articles</span>
                {relatedArticles.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No other articles in this category.</p>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {relatedArticles.map((rel) => {
                      const url = rel.type === "blog" ? `/blog/${rel.slug}` : `/best-products/${rel.slug}`;
                      return (
                        <div key={rel.id} className="flex flex-col gap-1 p-1.5 rounded bg-slate-900 border border-slate-850 text-xs">
                          <span className="truncate text-slate-300 font-medium" title={rel.title}>{rel.title}</span>
                          <code className="text-[10px] bg-slate-950 text-slate-400 px-1 py-0.5 rounded select-all font-mono block w-fit truncate">
                            {url}
                          </code>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-300 uppercase block tracking-wider">Related Products</span>
                {relatedProducts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No products in this category.</p>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {relatedProducts.map((p) => (
                      <div key={p.id} className="flex flex-col gap-1 p-1.5 rounded bg-slate-900 border border-slate-850 text-xs">
                        <span className="truncate text-slate-300 font-medium" title={p.name}>{p.name}</span>
                        <code className="text-[10px] bg-slate-950 text-slate-400 px-1 py-0.5 rounded select-all font-mono block w-fit">
                          {p.id}
                        </code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
                  defaultValue={quickRecs?.overallPickId || ""}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 focus:border-primary px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="budgetPickId" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Best Value Product ID</label>
                <input
                  type="text"
                  id="budgetPickId"
                  name="budgetPickId"
                  defaultValue={quickRecs?.budgetPickId || ""}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 focus:border-primary px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="premiumPickId" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Premium Pick Product ID</label>
                <input
                  type="text"
                  id="premiumPickId"
                  name="premiumPickId"
                  defaultValue={quickRecs?.premiumPickId || ""}
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
                defaultValue={quickRecs?.summary || ""}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 focus:border-primary px-3 py-1.5 text-xs text-white focus:outline-none resize-y"
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
              defaultValue={topPicksRaw}
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
              defaultValue={buyingGuideRaw}
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
              defaultValue={faqsRaw}
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
              defaultValue={article.verdict || ""}
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
                defaultValue={article.seoTitle || ""}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="seoDescription" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">SEO Meta Description</label>
              <input
                type="text"
                id="seoDescription"
                name="seoDescription"
                defaultValue={article.seoDescription || ""}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover py-3 text-center text-sm font-black text-primary-text hover:shadow-lg hover:shadow-primary/10 active:scale-98 transition-all"
            >
              <Save className="h-4.5 w-4.5" /> Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
