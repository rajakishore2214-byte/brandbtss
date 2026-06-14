import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart2, Shield } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ComparisonTable from "@/components/ComparisonTable";
import StructuredData from "@/components/StructuredData";
import { db, mapDbProduct, mapDbCategory, mapDbArticle } from "@/lib/db";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbCategory = await db.category.findUnique({
    where: { slug }
  });

  if (!dbCategory) return {};

  return {
    title: dbCategory.seoTitle,
    description: dbCategory.seoDescription,
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const dbCategory = await db.category.findUnique({
    where: { slug }
  });

  if (!dbCategory) {
    notFound();
  }

  const category = mapDbCategory(dbCategory);

  // Support subcategories: if this is a parent category, get all subcategory slugs too
  const subCategories = await db.category.findMany({
    where: { parentSlug: slug }
  });
  const subSlugs = subCategories.map(sc => sc.slug);
  const matchedSlugs = [slug, ...subSlugs];

  // Fetch products in this category or any of its subcategories
  const dbProducts = await db.product.findMany({
    where: { categorySlug: { in: matchedSlugs } }
  });
  const categoryProducts = dbProducts.map(mapDbProduct);

  // Fetch guides & reviews in this category or subcategories
  const dbArticles = await db.article.findMany({
    where: { categorySlug: { in: matchedSlugs } }
  });
  const categoryGuides = dbArticles.filter((a) => a.type === "best").map(mapDbArticle);
  const categoryReviews = dbArticles.filter((a) => a.type === "review").map(mapDbArticle);

  return (
    <div className="py-10 space-y-12">
      {/* Category Hero Header */}
      <section className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Product Category
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {category.name}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 1. Comparison Matrix Section */}
        {categoryProducts.length > 1 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" /> Compare Category Models
              </h2>
              <p className="text-xs text-slate-500">
                Quick specs matrix of our tested {category.name.toLowerCase()} products
              </p>
            </div>
            <ComparisonTable productsList={categoryProducts} />
          </section>
        )}

        {/* 2. Featured Products Grid */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" /> Rated & Tested Products
            </h2>
            <p className="text-xs text-slate-500">
              Unbiased reviews of top choices available on the market right now
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </section>

        {/* 3. Related Buying Guides & Listicles */}
        {categoryGuides.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              In-Depth Buying Guides & Lists
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {categoryGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/best-products/${guide.slug}`}
                  className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200 p-5 hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-950 group-hover:text-primary transition-colors text-base">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {guide.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary">
                    <span>View Recommendations</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 4. Single Product Reviews */}
        {categoryReviews.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Detailed Single Product Reviews
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {categoryReviews.map((review) => (
                <Link
                  key={review.slug}
                  href={`/reviews/${review.productIds?.[0]}-review`}
                  className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-sm transition-all"
                >
                  <img
                    src={review.image}
                    alt={review.title}
                    className="h-20 w-20 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-950 group-hover:text-primary transition-colors line-clamp-2">
                      {review.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Review Score: {review.rating} / 5</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 5. Static SEO Content Section (Google EEAT Booster) */}
        <section className="rounded-3xl bg-slate-100 p-8 border border-slate-200 text-xs sm:text-sm text-slate-600 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">About Our {category.name} Testing</h3>
          <p className="leading-relaxed">
            Every product listed in our {category.name.toLowerCase()} category has been bought and evaluated in-house by our writers. We check material quality, real-world durability, brand customer service history, and return policies. We compare them side-by-side using high-end diagnostics to give you transparent specs instead of marketing buzzwords.
          </p>
          <p className="leading-relaxed">
            Our recommendation logic groups choices by budget requirements (e.g. products under ₹5000), lifestyle requirements (e.g. students or outdoor travel), and technical superiority, ensuring you get exactly what you need without overspending.
          </p>
        </section>
      </div>

      {/* Structured Schema Data */}
      {categoryProducts.map((p) => (
        <StructuredData key={p.id} type="product" data={p} />
      ))}
    </div>
  );
}
