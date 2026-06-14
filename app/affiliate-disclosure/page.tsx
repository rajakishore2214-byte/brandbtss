import React from "react";
import type { Metadata } from "next";
import { Info, ShieldAlert, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | FTC Compliance & Transparency",
  description: "Read the BrandBTSS Affiliate Disclosure. Understand how our affiliate links work, how we monetize, and our commitment to independent review testing.",
  alternates: {
    canonical: "/affiliate-disclosure",
  },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-900 tracking-tight mb-2">
            Affiliate Disclosure
          </h1>
          <p className="text-xs text-slate-400 mb-6 border-b border-slate-100 pb-4">
            Last Updated: June 7, 2026
          </p>
        </div>

        {/* FTC callout block */}
        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5 flex items-start gap-4 text-slate-800">
          <Info className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed space-y-2">
            <h3 className="font-bold text-slate-950">Why This Disclosure Exists</h3>
            <p>
              In compliance with the Federal Trade Commission (FTC) guidelines and consumer protection laws, this disclosure describes the financial relations BrandBTSS holds with merchants, SaaS vendors, and software platforms.
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">1. How Affiliate Links Work</h2>
          <p>
            When you click on outbound buttons or links on BrandBTSS (e.g. "Check Price" or "Buy Coupon Deal"), a special referral tracking cookie is stored in your web browser by the destination service (such as Hostinger, ConvertKit, Semrush, or a brand direct website).
          </p>
          <p>
            If you purchase a subscription plan within the cookie expiration window, the company pays BrandBTSS a referral commission. <strong>This commission is paid entirely by the vendor out of their marketing margins and does NOT increase the price you pay.</strong>
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6 flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-emerald-600" /> 2. Honest Testing Pledge
          </h2>
          <p>
            Our in-house testers and editors write all reviews, lists, and matchup charts. The referral commissions we receive do <strong>not</strong> influence our opinions, test outcomes, or ratings.
          </p>
          <p>
            We purchase the software subscriptions using our own editorial funds. If a service exhibits performance issues, lacks critical support, or is overpriced, we will disclose it in the review and suggest better-suited alternatives.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" /> 3. Amazon Associates & Partnerships
          </h2>
          <p>
            BrandBTSS is a participant in several SaaS and software referral programs designed to provide a means for sites to earn commissions by linking to merchant platforms. When you buy through our links, we may earn an affiliate commission at no extra cost to you.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">4. Supporting Our Work</h2>
          <p>
            Operating a software testing site—purchasing premium cloud hosts, email subscriptions, and checking keyword database quotas—involves substantial cost. Clicking our referral links directly finances these purchases, enabling us to remain independent and avoid paid corporate sponsorships. We appreciate your support!
          </p>
        </div>
      </div>
    </div>
  );
}
