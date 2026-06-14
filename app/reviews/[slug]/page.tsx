import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Star, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, XCircle, ShoppingCart } from "lucide-react";
import StickyCTA from "@/components/StickyCTA";
import StructuredData from "@/components/StructuredData";
import NewsletterSignUp from "@/components/NewsletterSignUp";
import { formatINR } from "@/lib/utils";
import { db, mapDbProduct, mapDbArticle } from "@/lib/db";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const productId = slug.replace("-review", "");
  const dbProduct = await db.product.findUnique({ where: { id: productId } });
  const dbReview = await db.article.findFirst({
    where: {
      type: "review",
      productIds: { contains: productId }
    }
  });

  if (!dbProduct || !dbReview) return {};

  const review = mapDbArticle(dbReview);

  return {
    title: review.seoTitle,
    description: review.seoDescription,
    alternates: {
      canonical: `/reviews/${slug}`,
    },
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const productId = slug.replace("-review", "");
  const dbProduct = await db.product.findUnique({ where: { id: productId } });
  const dbReview = await db.article.findFirst({
    where: {
      type: "review",
      productIds: { contains: productId }
    }
  });

  if (!dbProduct || !dbReview) {
    notFound();
  }

  const product = mapDbProduct(dbProduct);
  const review = mapDbArticle(dbReview);

  // Find alternatives (other products in the same category excluding current)
  const dbAlternatives = await db.product.findMany({
    where: {
      categorySlug: dbProduct.categorySlug,
      id: { not: dbProduct.id }
    },
    take: 3
  });
  const alternatives = dbAlternatives.map(mapDbProduct);

  return (
    <div className="pb-20 space-y-12">
      {/* 1. Hero Summary Header */}
      <section className="bg-slate-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-text">
                In-Depth Review
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400 capitalize">{product.category}</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {review.title}
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {review.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium">Rating:</span>
                <div className="flex items-center text-amber-500">
                  <Star className="h-4.5 w-4.5 fill-current" />
                </div>
                <span className="text-sm font-bold text-white">{product.rating} / 5</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Tested by: <span className="text-white font-medium">{review.author}</span></span>
                <span>•</span>
                <span>Date: {review.date}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout Grid */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-16">
        
        {/* FTC Disclosure Notice */}
        <div className="rounded-xl bg-amber-50 border border-amber-200/60 p-4 text-xs text-amber-800 flex items-start gap-2.5">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-amber-600" />
          <p className="leading-relaxed">
            <strong>Editorial Independence:</strong> BrandBTSS editorial team purchased this {product.name} at retail. We do not write sponsored copy or accept brand payouts. We monetise purely through referral links.
          </p>
        </div>

        {/* 2. Overview and Key Specs */}
        <section className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Overview</h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {review.introduction}
            </p>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>

          {/* Quick Specifications list */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-2.5">
              Specifications
            </h3>
            <ul className="divide-y divide-slate-100 text-xs sm:text-sm">
              {Object.entries(product.specs).map(([key, val]) => (
                <li key={key} className="py-2.5 flex justify-between gap-4">
                  <span className="text-slate-500 font-medium">{key}</span>
                  <span className="text-slate-900 font-bold text-right">{val}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Deep Dive Features */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Key Tested Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {product.features.map((feat, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
                <div className="rounded bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary uppercase tracking-widest inline-block">
                  Feature {idx + 1}
                </div>
                <p className="text-sm font-semibold text-slate-900 leading-snug">{feat}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Pros and Cons Matrix */}
        <section className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-emerald-50/50 border border-emerald-100 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Pros: What We Liked
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {product.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="rounded-full bg-emerald-100 p-0.5 text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-rose-50/50 border border-rose-100 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-500" /> Cons: Room For Improvement
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {product.cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="rounded-full bg-rose-100 p-0.5 text-rose-600 shrink-0 mt-0.5">
                    <XCircle className="h-4 w-4" />
                  </span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Alternatives Grid */}
        {alternatives.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tested Alternatives</h2>
            <p className="text-xs text-slate-500">Not satisfied? Compare these related models in the same category</p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {alternatives.map((alt) => (
                <div key={alt.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <img src={alt.image} alt={alt.name} className="h-24 w-full object-cover rounded-lg bg-slate-100" />
                    <span className="text-[9px] uppercase tracking-wider text-primary font-bold block">{alt.brand}</span>
                    <h3 className="font-bold text-slate-950 text-xs sm:text-sm line-clamp-1">{alt.name}</h3>
                    <div className="text-sm font-black text-slate-900">{formatINR(alt.price)}</div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <Link
                      href={`/reviews/${alt.id}-review`}
                      className="rounded bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 py-1.5 text-center hover:bg-slate-100"
                    >
                      Read Review
                    </Link>
                    <a
                      href={alt.affiliateUrl}
                      target="_blank"
                      rel="sponsored nofollow"
                      className="rounded bg-amber-500 text-[10px] font-bold text-slate-950 py-1.5 text-center hover:bg-amber-600"
                    >
                      Buy Link
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. In-Depth Verdict & Rating Card */}
        <section className="rounded-3xl border border-slate-200 bg-slate-950 text-white p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            
            {/* Score circle badge */}
            <div className="flex flex-col items-center justify-center shrink-0 h-32 w-32 rounded-full border-4 border-amber-500 bg-slate-900 shadow-xl">
              <span className="font-display text-4xl font-black text-white">{product.rating}</span>
              <span className="text-[10px] uppercase font-bold text-amber-400">Verdict Score</span>
            </div>

            {/* Verdict text details */}
            <div className="flex-1 space-y-4">
              <h3 className="font-display text-xl font-bold text-white">Our Honest Verdict</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {review.verdict}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Best Retail price</span>
                  <span className="text-xl font-black text-white">{formatINR(product.price)}</span>
                </div>
                
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="sponsored nofollow"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-6 py-3 text-center text-sm font-black text-slate-950 hover:shadow-lg hover:shadow-amber-500/10 active:scale-95 transition-all"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Check Price & Buy
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Capture */}
        <NewsletterSignUp />
      </div>

      {/* Floating Sticky CTA bar */}
      <StickyCTA product={product} />

      {/* Structured Schema Data */}
      <StructuredData
        type="review"
        data={{
          productName: product.name,
          productImage: product.image,
          productBrand: product.brand,
          rating: product.rating,
          author: review.author,
          verdict: review.verdict,
        }}
      />
      <StructuredData type="product" data={product} />
    </div>
  );
}
