import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, ShoppingCart, HelpCircle } from "lucide-react";
import ComparisonTable from "@/components/ComparisonTable";
import StructuredData from "@/components/StructuredData";
import NewsletterSignUp from "@/components/NewsletterSignUp";
import { formatINR } from "@/lib/utils";
import { db, mapDbProduct, mapDbArticle } from "@/lib/db";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbArticle = await db.article.findUnique({
    where: { slug }
  });

  if (!dbArticle || dbArticle.type !== "best") return {};

  const article = mapDbArticle(dbArticle);

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: {
      canonical: `/best-products/${slug}`,
    },
  };
}

export default async function BestProductsPage({ params }: PageProps) {
  const { slug } = await params;
  const dbArticle = await db.article.findUnique({
    where: { slug }
  });

  if (!dbArticle || dbArticle.type !== "best") {
    notFound();
  }

  const article = mapDbArticle(dbArticle);

  // Fetch product objects linked to this guide
  const dbProducts = await db.product.findMany({
    where: {
      id: { in: article.productIds || [] }
    }
  });
  const linkedProducts = dbProducts.map(mapDbProduct);

  // Map quick recommendations to actual product objects
  const overallPick = linkedProducts.find((p: any) => p.id === article.quickRecommendation?.overallPickId);
  const budgetPick = linkedProducts.find((p: any) => p.id === article.quickRecommendation?.budgetPickId);
  const premiumPick = linkedProducts.find((p: any) => p.id === article.quickRecommendation?.premiumPickId);

  return (
    <div className="pb-16 space-y-12">
      {/* 1. Header Hero */}
      <section className="bg-slate-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="space-y-4">
            <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
              Hand-Tested Buying Guide
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {article.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {article.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <span>By <span className="text-white font-semibold">{article.author}</span></span>
              <span>•</span>
              <span>Published: {article.date}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Checked & Verified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout Container */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-16">
        
        {/* Intro */}
        <section className="prose prose-slate max-w-none">
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            {article.introduction}
          </p>
          {/* FTC Disclosure */}
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200/60 p-4 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-amber-600" />
            <p className="leading-relaxed">
              <strong>Affiliate Disclosure:</strong> BrandBTSS is supported by readers. When you click links on this page and make purchases, we may earn an affiliate referral commission from merchants at no cost to you.
            </p>
          </div>
        </section>

        {/* 2. Quick Recommendation Grid */}
        {article.quickRecommendation && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quick Recommendations</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Overall Pick */}
              {overallPick && (
                <div className="rounded-2xl border-2 border-primary bg-white p-5 flex flex-col justify-between shadow-sm relative">
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-text">
                    Overall Pick
                  </span>
                  <div className="space-y-2 text-center pt-2">
                    <img src={overallPick.image} alt={overallPick.name} className="h-20 w-full object-cover rounded-lg bg-slate-100" />
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{overallPick.name}</h3>
                    <div className="text-lg font-black text-primary">{formatINR(overallPick.price)}</div>
                  </div>
                  <a
                    href={overallPick.affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow"
                    className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-primary py-2.5 text-center text-xs font-black text-primary-text hover:bg-primary-hover active:scale-95 transition-all"
                  >
                    Check Price
                  </a>
                </div>
              )}

              {/* Budget Pick */}
              {budgetPick && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm relative">
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    Best Value
                  </span>
                  <div className="space-y-2 text-center pt-2">
                    <img src={budgetPick.image} alt={budgetPick.name} className="h-20 w-full object-cover rounded-lg bg-slate-100" />
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{budgetPick.name}</h3>
                    <div className="text-lg font-black text-slate-950">{formatINR(budgetPick.price)}</div>
                  </div>
                  <a
                    href={budgetPick.affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow"
                    className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2.5 text-center text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    Check Price
                  </a>
                </div>
              )}

              {/* Premium Pick */}
              {premiumPick && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm relative">
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    Premium Pick
                  </span>
                  <div className="space-y-2 text-center pt-2">
                    <img src={premiumPick.image} alt={premiumPick.name} className="h-20 w-full object-cover rounded-lg bg-slate-100" />
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{premiumPick.name}</h3>
                    <div className="text-lg font-black text-slate-950">{formatINR(premiumPick.price)}</div>
                  </div>
                  <a
                    href={premiumPick.affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow"
                    className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-slate-900 py-2.5 text-center text-xs font-bold text-white hover:bg-slate-800 active:scale-95 transition-all"
                  >
                    Check Price
                  </a>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100">
              Summary recommendation: {article.quickRecommendation.summary}
            </p>
          </section>
        )}

        {/* 3. Detailed Comparison Table */}
        {linkedProducts.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Spec Comparison Matrix</h2>
            <ComparisonTable productsList={linkedProducts} />
          </section>
        )}

        {/* 4. Top Picks Detailed Reviews */}
        <section className="space-y-12">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Our Detailed Product Analysis</h2>
          <div className="space-y-16">
            {linkedProducts.map((product: any, idx: number) => {
              const pickMetadata = article.topPicks?.find((p) => p.productId === product.id);
              return (
                <div key={product.id} className="border-t border-slate-200 pt-12 space-y-6">
                  {/* Badge & Title */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      {pickMetadata?.tag && (
                        <span className="rounded bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                          {pickMetadata.tag}
                        </span>
                      )}
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                        {idx + 1}. {product.brand} {product.name}
                      </h3>
                    </div>
                    {/* Rating and Price */}
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-semibold">Our Rating</div>
                        <div className="flex items-center gap-1 text-slate-900 font-bold justify-end">
                          <Star className="h-4.5 w-4.5 fill-current text-amber-500" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-semibold">Best Price</div>
                        <div className="text-lg font-black text-slate-950">{formatINR(product.price)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Product Showroom layout */}
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {product.description}
                      </p>
                      
                      {/* Specs */}
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Specifications</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
                           {Object.entries(product.specs as Record<string, string>).map(([key, val]) => (
                             <div key={key} className="truncate">
                               <strong className="text-slate-700 font-medium">{key}:</strong> {val}
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>

                    {/* Pros and Cons + CTA */}
                    <div className="space-y-6">
                      <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100 p-5 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-800">Pros: What We Liked</h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                          {product.pros.map((pro: any, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl bg-rose-50/50 border border-rose-100 p-5 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-rose-800">Cons: Things to Consider</h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                          {product.cons.map((con: any, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {pickMetadata?.awardReason && (
                        <div className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-slate-300 pl-3">
                          <strong>Why it won this award:</strong> {pickMetadata.awardReason}
                        </div>
                      )}

                      {/* Buy Button Container */}
                      <div className="space-y-2">
                        <a
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="sponsored nofollow"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 py-3.5 text-center text-sm font-black text-slate-950 hover:shadow-xl hover:shadow-amber-500/10 active:scale-98 transition-all"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Check Best Price on Retailer
                        </a>
                        <div className="text-[10px] text-slate-400 text-center font-medium">
                          Prices fluctuate. Always check the link to view live discount rates.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Buying Guide Article Section */}
        {article.buyingGuide && (
          <section className="border-t border-slate-200 pt-12 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Comprehensive Buying Guide</h2>
            <div className="space-y-8">
              {article.buyingGuide.map((guideSection, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900">{guideSection.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {guideSection.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. FAQ Block */}
        {article.faqs && (
          <section className="border-t border-slate-200 pt-12 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" /> FAQ: {article.title.replace("Best ", "")}
            </h2>
            <div className="space-y-3">
              {article.faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group border border-slate-200 rounded-2xl bg-white p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-primary transition-colors"
                >
                  <summary className="flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base list-none">
                    <span>{faq.question}</span>
                    <span className="rounded-full bg-slate-100 p-1.5 text-slate-500 group-open:rotate-180 transition-transform">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Capture */}
        <NewsletterSignUp />
      </div>

      {/* SEO Schema Integrators */}
      <StructuredData type="article" data={article} />
      {article.faqs && <StructuredData type="faq" data={article.faqs} />}
      {linkedProducts.map((p: any) => (
        <StructuredData key={p.id} type="product" data={p} />
      ))}
    </div>
  );
}
