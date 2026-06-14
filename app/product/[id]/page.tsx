import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Star, ShieldCheck, CheckCircle2, XCircle, ArrowRight, ExternalLink, HelpCircle, Sparkles } from "lucide-react";
import { db, mapDbProduct } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import StructuredData from "@/components/StructuredData";
import { formatINR } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const dbProduct = await db.product.findUnique({
    where: { id }
  });

  if (!dbProduct) return {};

  return {
    title: `${dbProduct.brand} ${dbProduct.name} Specs & Reviews | BrandBTSS`,
    description: `Independent hand-tested specifications, pros and cons, recommendation score, and best deals for the ${dbProduct.brand} ${dbProduct.name}.`,
    alternates: {
      canonical: `/product/${id}`,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dbProduct = await db.product.findUnique({
    where: { id }
  });

  if (!dbProduct) {
    notFound();
  }

  const product = mapDbProduct(dbProduct);

  // Fetch similar products in the same category
  const dbSimilar = await db.product.findMany({
    where: {
      categorySlug: dbProduct.categorySlug,
      id: { not: dbProduct.id }
    },
    take: 3
  });
  const similarProducts = dbSimilar.map(mapDbProduct);

  // Generate standard FAQs based on the specs and features
  const faqList = [
    {
      question: `Is the ${product.brand} ${product.name} worth buying?`,
      answer: `Yes, it has a tested Buying Recommendation Score of ${product.score}/100. It excels in durability, feature set, and overall price-to-performance ratio.`
    },
    {
      question: `What are the key specifications of the ${product.name}?`,
      answer: `It features: ${Object.entries(product.specs).slice(0, 3).map(([k, v]) => `${k} (${v})`).join(", ")}.`
    }
  ];

  // Colors based on score
  const scoreColor = product.score >= 90 ? "stroke-emerald-500 text-emerald-500" : product.score >= 80 ? "stroke-amber-500 text-amber-500" : "stroke-rose-500 text-rose-500";

  return (
    <div className="pb-20 space-y-12 bg-slate-50">
      {/* 1. Hero Section */}
      <section className="bg-slate-900 text-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-text flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Tested Specs
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 capitalize">{product.brand}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 fill-current ${
                        i < Math.floor(product.rating) ? "" : "text-slate-700 fill-none"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-300">{product.rating} / 5 Rating</span>
              </div>
            </div>

            {/* Circular score badge */}
            <div className="flex flex-col items-center gap-2 bg-slate-950 p-6 rounded-3xl border border-slate-800 shrink-0">
              <div className="relative h-28 w-28 flex items-center justify-center">
                <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * product.score) / 100}
                    className={`transition-all duration-1000 ${scoreColor}`}
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black">{product.score}</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Score</span>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-semibold mt-1">Buying Recommendation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main content (Left/Center Column) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery and Buy Box */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-8 shadow-sm">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>

                {/* Affiliate Purchase Area */}
                <div className="space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Merchant Pricing</span>
                    <h3 className="text-lg font-bold text-slate-900">Compare Affiliate Deals</h3>
                    
                    {/* Offers list */}
                    <div className="space-y-3">
                      {product.affiliateUrlsParsed.map((aff, index) => {
                        const directUrl = `/api/redirect?productId=${product.id}&network=${encodeURIComponent(aff.network)}&url=${encodeURIComponent(aff.url)}`;
                        return (
                          <div key={index} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/75 transition-colors">
                            <div>
                              <span className="text-xs font-black text-slate-900 block">{aff.network}</span>
                              <span className="text-xs text-slate-400">Direct referral link</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-base font-extrabold text-slate-950">{formatINR(aff.price || product.price)}</span>
                              <a
                                href={directUrl}
                                target="_blank"
                                rel="sponsored nofollow"
                                className="inline-flex items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-600 px-3.5 py-2 text-center text-xs font-black text-slate-950 hover:shadow-sm"
                              >
                                Buy <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-4 border border-amber-200/60 text-xs text-amber-800 flex items-start gap-2.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>100% Secure Redirect:</strong> Links pass through our click tracking to support our independent in-house reviews.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Product Key Features */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Key Tested Features</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 hover:shadow-md transition-shadow">
                    <span className="rounded bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold text-primary uppercase tracking-widest inline-block">
                      Feature {idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-slate-900 leading-snug">{feat}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pros and Cons Matrix */}
            <section className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-emerald-50/50 border border-emerald-100 p-6 space-y-4">
                <h3 className="text-base font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Pros: What We Liked
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  {product.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="rounded-full bg-emerald-100 p-0.5 text-emerald-700 shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl bg-rose-50/50 border border-rose-100 p-6 space-y-4">
                <h3 className="text-base font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-rose-500" /> Cons: Drawbacks
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  {product.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="rounded-full bg-rose-100 p-0.5 text-rose-600 shrink-0 mt-0.5">
                        <XCircle className="h-3.5 w-3.5" />
                      </span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQ block */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" /> FAQ
              </h2>
              <div className="space-y-3">
                {faqList.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group border border-slate-100 rounded-xl bg-slate-50 p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <summary className="flex items-center justify-between gap-4 font-bold text-slate-900 text-sm list-none">
                      <span>{faq.question}</span>
                      <span className="rounded-full bg-white border border-slate-200 p-1 text-slate-500 group-open:rotate-180 transition-transform">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-8">
            {/* Technical Specifications */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-2.5">
                Technical Specifications
              </h3>
              <ul className="divide-y divide-slate-100 text-xs sm:text-sm">
                {Object.entries(product.specs).map(([key, val]) => (
                  <li key={key} className="py-2.5 flex justify-between gap-4">
                    <span className="text-slate-500 font-medium">{key}</span>
                    <span className="text-slate-900 font-bold text-right">{val}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Quick rating details */}
            <section className="bg-slate-900 text-white rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider">Editorial Recommendation</h3>
              <div className="space-y-2">
                <div className="text-3xl font-black text-amber-400">{product.score}%</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Based on our hands-on testing parameters including build durability, operational ease, price-to-spec ratios, and comparative brand analysis, we rate the {product.name} as a highly recommended buy.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Similar Products widget */}
        {similarProducts.length > 0 && (
          <section className="mt-16 space-y-6 border-t border-slate-200 pt-12">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Similar Products in Category</h2>
              <p className="text-xs text-slate-500">Unbiased reviews of other models you might like</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarProducts.map((p: any, idx: number) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Structured Schema Data */}
      <StructuredData type="product" data={product} />
      <StructuredData type="faq" data={faqList} />
    </div>
  );
}
