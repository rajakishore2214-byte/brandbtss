import React from "react";
import type { Metadata } from "next";
import { ShieldCheck, HeartHandshake, Eye, Award, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | BrandBTSS Independent Testing",
  description: "Learn about BrandBTSS's mission, our team of expert product testers, and our independent testing procedures to help you buy software with confidence.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const steps = [
    { title: "SaaS Auditing", desc: "We scan the market and identify trending or widely asked-about web hosting, email tools, and SEO software." },
    { title: "Active Procurement", desc: "We purchase real active subscription plans. We never accept free promotional reviewer accounts from brands to avoid bias." },
    { title: "Rigorous Testing", desc: "Our staff deploys active WordPress sites, configures email campaigns, and tracks keyword data in real-world scenarios." },
    { title: "Objective Verdicts", desc: "We list pricing limits, response times, and pros/cons transparently. If a tool fails testing, we grade it low." }
  ];

  return (
    <div className="pb-16 space-y-12">
      {/* 1. Header Hero */}
      <section className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-text">
            Our Mission
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            About BrandBTSS
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Helping creators and marketers discover high-quality software tools and save money through honest, independent, and verified reviews.
          </p>
        </div>
      </section>

      {/* Main content grid */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-16">
        
        {/* Pitch Statement */}
        <section className="prose prose-slate max-w-none text-slate-700 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Who We Are</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Founded in 2026, <strong>BrandBTSS</strong> was built out of frustration with online search results cluttered with generic copy-pasted features lists, fake ratings, and hidden brand partnerships. We wanted a clean, reliable, and trustworthy platform where users could find objective performance benchmarks before investing their hard-earned capital.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            Our editorial staff consists of developers, email marketers, SEO analysts, and digital entrepreneurs who are passionate about discovering software limits and identifying high-performance marketing tools.
          </p>
        </section>

        {/* 2. Core Pillars */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <div className="rounded-full bg-primary/10 p-3 text-primary inline-flex">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-950 text-base">100% Independent</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We never accept advertising payments for reviews or placements. Every software plan evaluated on our site is bought with our own funds.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <div className="rounded-full bg-emerald-100 p-3 text-emerald-600 inline-flex">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-950 text-base">User-First Metrics</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We focus on metrics that matter: page response speed (TTFB), deliverability rates, keyword database sizes, and renewal price transparency.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-500 inline-flex">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-950 text-base">Full Transparency</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We disclose our affiliate relationships openly. Referral earnings go directly into financing active subscriptions for further software testing campaigns.
            </p>
          </div>
        </section>

        {/* 3. Testing Process */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight text-center">
            How We Test Software
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="relative rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-3">
                <div className="font-display font-black text-3xl text-amber-200">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Editorial Integrity Pledge */}
        <section className="rounded-3xl bg-slate-950 text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
              <Award className="h-5 w-5" /> Editorial Integrity Pledge
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              We value your trust above any referral commission.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Commissions never influence our ratings. If a software host is too slow or a keyword tool&apos;s features are overpriced, we will call it out and suggest better budget-friendly alternatives. We believe that by building honest, long-term relationships with our readers, we will build a more sustainable platform.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-emerald-500" />
                <span>Active subscription validation tests</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4.5 w-4.5 text-emerald-500" />
                <span>Verifiable speed and uptime metrics</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
