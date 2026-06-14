import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Award, ArrowRight, CheckCircle2, ChevronRight, BarChart3, AlertTriangle } from "lucide-react";
import ComparisonTable from "@/components/ComparisonTable";
import StructuredData from "@/components/StructuredData";
import NewsletterSignUp from "@/components/NewsletterSignUp";
import { formatINR } from "@/lib/utils";
import { db, mapDbProduct, mapDbComparison } from "@/lib/db";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbComparison = await db.comparison.findUnique({
    where: { slug }
  });

  if (!dbComparison) return {};

  const comparison = mapDbComparison(dbComparison);

  return {
    title: comparison.seoTitle,
    description: comparison.seoDescription,
    alternates: {
      canonical: `/comparisons/${slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const dbComparison = await db.comparison.findUnique({
    where: { slug }
  });

  if (!dbComparison) {
    notFound();
  }

  const comparison = mapDbComparison(dbComparison);

  const dbProductA = await db.product.findUnique({ where: { id: comparison.productAId } });
  const dbProductB = await db.product.findUnique({ where: { id: comparison.productBId } });

  if (!dbProductA || !dbProductB) {
    notFound();
  }

  const productA = mapDbProduct(dbProductA);
  const productB = mapDbProduct(dbProductB);

  return (
    <div className="pb-16 space-y-12">
      {/* 1. Header Hero */}
      <section className="bg-slate-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="space-y-4">
            <span className="rounded bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-text">
              Head-to-Head Comparison
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {comparison.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {comparison.introduction}
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
        {/* Affiliate disclosure banner */}
        <div className="rounded-xl bg-amber-50 border border-amber-200/60 p-4 text-xs text-amber-800 flex items-start gap-2.5">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-amber-600" />
          <p className="leading-relaxed">
            <strong>Affiliate Transparency:</strong> We purchase and test all items in our head-to-head comparisons. When you purchase via our links, we receive referral compensation.
          </p>
        </div>

        {/* 2. Visual A vs B Intro Grid */}
        <section className="grid sm:grid-cols-2 gap-6">
          {/* Product A Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
                <img src={productA.image} alt={productA.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">{productA.brand}</span>
                <h3 className="text-lg font-black text-slate-900 leading-snug">{productA.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm font-semibold text-slate-700">{productA.rating} / 5</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm font-bold text-primary">{formatINR(productA.price)}</span>
                </div>
              </div>
            </div>
            <a
              href={productA.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow"
              className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-3 text-center text-xs font-black text-slate-950 hover:bg-amber-600 hover:shadow-md"
            >
              Get {productA.name}
            </a>
          </div>

          {/* Product B Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
                <img src={productB.image} alt={productB.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">{productB.brand}</span>
                <h3 className="text-lg font-black text-slate-900 leading-snug">{productB.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm font-semibold text-slate-700">{productB.rating} / 5</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm font-bold text-primary">{formatINR(productB.price)}</span>
                </div>
              </div>
            </div>
            <a
              href={productB.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow"
              className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-3 text-center text-xs font-black text-slate-950 hover:bg-amber-600 hover:shadow-md"
            >
              Get {productB.name}
            </a>
          </div>
        </section>

        {/* 3. Detailed Comparison Specs Table */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="h-5.5 w-5.5 text-primary" /> Technical Specification Matchup
          </h2>
          <ComparisonTable productsList={[productA, productB]} />
        </section>

        {/* 4. Comparative Feature Breakdowns */}
        <section className="space-y-6 border-t border-slate-200 pt-10">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Key Feature Breakdown</h2>
          <div className="divide-y divide-slate-100 space-y-6">
            {comparison.featureBreakdown.map((row, idx) => (
              <div key={idx} className={`pt-6 grid md:grid-cols-3 gap-4 ${idx > 0 ? "border-t border-slate-100" : ""}`}>
                <div className="font-bold text-slate-950 text-sm sm:text-base">{row.feature}</div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="font-semibold text-primary uppercase text-[9px] tracking-wider">{productA.name}</div>
                  <p className="text-slate-600 leading-relaxed">{row.productAValue}</p>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="font-semibold text-amber-500 uppercase text-[9px] tracking-wider">{productB.name}</div>
                  <p className="text-slate-600 leading-relaxed">{row.productBValue}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Verdict and Recommendation */}
        <section className="rounded-3xl bg-slate-950 border border-slate-900 text-white p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
              <Award className="h-5 w-5" /> The Final Recommendation
            </div>
            <h3 className="font-display text-2xl font-black text-white leading-tight">
              Which One Should You Buy?
            </h3>
            
            {/* Split verdict guidelines */}
            <div
              className="text-slate-300 text-xs sm:text-sm leading-relaxed border-l-4 border-amber-500 pl-4 py-1"
              dangerouslySetInnerHTML={{
                __html: comparison.verdict
                  .replace(/Hostinger Business/g, `<strong class="text-white">Hostinger Business</strong>`)
                  .replace(/Bluehost Choice Plus/g, `<strong class="text-white">Bluehost Choice Plus</strong>`)
                  .replace(/Semrush Pro/g, `<strong class="text-white">Semrush Pro</strong>`)
                  .replace(/Ahrefs Lite/g, `<strong class="text-white">Ahrefs Lite</strong>`)
                  .replace(/Philips Essential/g, `<strong class="text-white">Philips Essential</strong>`)
                  .replace(/Solara 5.5L/g, `<strong class="text-white">Solara 5.5L</strong>`)
                  .replace(/JBL Go 4/g, `<strong class="text-white">JBL Go 4</strong>`)
                  .replace(/Sony SRS-XB100/g, `<strong class="text-white">Sony SRS-XB100</strong>`),
              }}
            />

            {/* Split CTA buttons */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <a
                href={productA.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover py-3 text-center text-xs sm:text-sm font-black text-slate-950 transition-colors"
              >
                Buy {productA.name} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={productB.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 py-3 text-center text-xs sm:text-sm font-black text-slate-950 transition-colors"
              >
                Buy {productB.name} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <NewsletterSignUp />
      </div>

      {/* SEO Structured Data */}
      <StructuredData type="product" data={productA} />
      <StructuredData type="product" data={productB} />
    </div>
  );
}
