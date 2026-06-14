import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | BrandBTSS",
  description: "Read the BrandBTSS Terms and Conditions. Guidelines on intellectual property, user reviews submissions, and outbound affiliate links limitations.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-display text-3xl font-black text-slate-900 tracking-tight mb-2">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-400 mb-8 border-b border-slate-100 pb-4">
          Last Updated: June 7, 2026
        </p>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
          <p>
            Welcome to <strong>BrandBTSS</strong>. These terms and conditions outline the rules and regulations for the use of BrandBTSS's Website, located at https://brandbtss.com.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">1. Acceptance of Terms</h2>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use BrandBTSS if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise stated, BrandBTSS and/or its licensors own the intellectual property rights for all material on BrandBTSS. All intellectual property rights are reserved. You may access this from BrandBTSS for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Republish material, text, images, or specs from BrandBTSS.</li>
            <li>Sell, rent, or sub-license material from BrandBTSS.</li>
            <li>Reproduce, duplicate, or copy material from BrandBTSS.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 mt-6">3. User Comments & Reviews</h2>
          <p>
            Parts of this website may offer an opportunity for users to post and exchange opinions and information. BrandBTSS does not filter, edit, publish, or review comments prior to their presence on the website. Comments do not reflect the views and opinions of BrandBTSS.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">4. Links to External Sites & Affiliate Disclaimer</h2>
          <p>
            Our service may contain links to external sites (like Hostinger, ConvertKit, Semrush, etc.) that are not operated by us. Clicking an affiliate link will redirect you to that merchant's portal. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">5. Limitation of Liability</h2>
          <p>
            The information on this website is provided free of charge. While we endeavor to ensure that the information on this website (including prices, specifications, and coupon codes) is correct, we do not warrant its completeness or accuracy.
          </p>
        </div>
      </div>
    </div>
  );
}
