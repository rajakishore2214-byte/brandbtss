import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | BrandBTSS Data Protection",
  description: "Read the BrandBTSS Privacy Policy. Learn how we collect, store, and protect your personal information, cookie logs, and email data.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-display text-3xl font-black text-slate-900 tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mb-8 border-b border-slate-100 pb-4">
          Last Updated: June 7, 2026
        </p>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
          <p>
            At <strong>BrandBTSS</strong>, accessible from https://brandbtss.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by BrandBTSS and how we use it.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">1. Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">2. Information We Collect</h2>
          <p>
            If you sign up for our email newsletter, we collect your email address. If you contact us directly via our contact form, we may receive additional information about you such as your name, email address, phone number, the contents of the message, and any attachments you may send us.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Provide, operate, and maintain our website.</li>
            <li>Improve, personalize, and expand our website.</li>
            <li>Understand and analyze how you use our website.</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Communicate with you to send newsletters, security alerts, and marketing updates.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 mt-6">4. Log Files & Cookies</h2>
          <p>
            BrandBTSS follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. This data is not linked to any personally identifiable information.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">5. Affiliate Partners & Third-Party Privacy Policies</h2>
          <p>
            BrandBTSS uses affiliate tracking links. When you click on a product link and purchase it, cookies are stored by the merchant (like Hostinger, ConvertKit, or Semrush) to identify BrandBTSS as the referring site. These third-party merchants use technology like cookies or web beacons in their links. They automatically receive your IP address when this occurs. Please check the respective privacy policies of these third-party merchants for detailed information.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6">6. GDPR & CCPA Data Protection Rights</h2>
          <p>
            We would like to ensure you are fully aware of all of your data protection rights. Every user is entitled to request access to their personal data, rectification of errors, deletion of email records, and restriction of processing. If you make a request, we have one month to respond to you.
          </p>
        </div>
      </div>
    </div>
  );
}
