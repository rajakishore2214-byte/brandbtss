import React from "react";
import Link from "next/link";
import { ShieldCheck, HeartHandshake } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  const categoriesList = [
    { name: "Web Hosting", href: "/category/hosting" },
    { name: "Email Marketing", href: "/category/email-marketing" },
    { name: "SEO Tools", href: "/category/seo-tools" },
    { name: "Link Trackers", href: "/category/link-trackers" }
  ];

  const bestGuides = [
    { name: "Best Web Hosting for Affiliates", href: "/best-products/best-web-hosting-for-affiliate-marketing" },
    { name: "Best SEO Tools to Grow Traffic", href: "/best-products/best-seo-tools-for-affiliate-traffic" },
    { name: "Best Email Marketing Platforms", href: "/best-products/best-email-marketing-tools" }
  ];

  const trustLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Affiliate Disclosure", href: "/affiliate-disclosure" }
  ];

  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-300">
      {/* Trust Bar */}
      <div className="border-b border-slate-800 bg-slate-950/50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Independent & Fact-Checked</p>
              <p className="text-xs text-slate-400">We research and test every software ourselves. No sponsored placements.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Supported by Readers</p>
              <p className="text-xs text-slate-400">We earn small commissions when you purchase through our links.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block mb-2">
              <Logo variant="horizontal" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              BrandBTSS is an independent software research and testing platform providing unbiased reviews, comparative analysis guides, and exclusive discount deals on affiliate marketing hosting, email tools, SEO keyword databases, and tracking software.
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} BrandBTSS. All rights reserved.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Categories</h3>
            <ul className="space-y-2.5 text-sm">
              {categoriesList.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-primary transition-colors text-slate-400">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Best Guides */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Top Buying Guides</h3>
            <ul className="space-y-2.5 text-sm">
              {bestGuides.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-primary transition-colors text-slate-400 line-clamp-1">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company Trust</h3>
            <ul className="space-y-2.5 text-sm">
              {trustLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-primary transition-colors text-slate-400">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Affiliate Commission Disclaimer */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-[10px] text-slate-500">
          <p className="leading-relaxed">
            Disclaimer: BrandBTSS is a participant in retail affiliate programs, designed to provide a means for sites to earn advertising fees by advertising and linking to marketing tools, SaaS platforms, and merchant websites. When you buy through our links, we may earn an affiliate commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
