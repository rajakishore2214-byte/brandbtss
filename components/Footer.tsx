import React from "react";
import Link from "next/link";
import { ShieldCheck, HeartHandshake } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  const categoriesList = [
    { name: "Home & Kitchen", href: "/roundup/best-home-kitchen-amazon" },
    { name: "Smart Home Appliances", href: "/roundup/best-smart-home-appliances" },
    { name: "Electronics & Gadgets", href: "/roundup/best-electronics-gadgets-amazon" },
    { name: "Clothing & Accessories", href: "/roundup/best-clothing-accessories-amazon" },
    { name: "Freelancer Tools", href: "/roundup/best-pm-tools" },
  ];

  const bestGuides = [
    { name: "Best Home & Kitchen on Amazon", href: "/roundup/best-home-kitchen-amazon" },
    { name: "Best Smart Home Appliances", href: "/roundup/best-smart-home-appliances" },
    { name: "Best Electronics & Gadgets", href: "/roundup/best-electronics-gadgets-amazon" },
    { name: "Best Clothing & Accessories", href: "/roundup/best-clothing-accessories-amazon" },
    { name: "Best Project Management Tools", href: "/roundup/best-pm-tools" },
  ];

  const trustLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/" },
    { name: "Privacy Policy", href: "/" },
    { name: "Terms & Conditions", href: "/" }
  ];

  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-300 mt-auto">
      {/* Trust Bar */}
      <div className="border-b border-slate-800 bg-slate-950/50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Independent & Fact-Checked</p>
              <p className="text-xs text-slate-400">We sign up, benchmark, and test every productivity tool ourselves.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Supported by Readers</p>
              <p className="text-xs text-slate-400">We earn affiliate commissions when you click through our links.</p>
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
              BrandBTSS is an independent product review and buying guide site. We cover Home &amp; Kitchen, Smart Home Appliances, Electronics &amp; Gadgets, Clothing &amp; Accessories, and Freelancer Productivity Tools — all with honest, hands-on expert testing.
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} BrandBTSS. All rights reserved.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Focus Areas</h3>
            <ul className="space-y-2.5 text-sm">
              {categoriesList.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-primary transition-colors text-slate-400">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Best Guides */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Top Guides</h3>
            <ul className="space-y-2.5 text-sm">
              {bestGuides.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-primary transition-colors text-slate-400 line-clamp-1">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Information</h3>
            <ul className="space-y-2.5 text-sm">
              {trustLinks.map((item, idx) => (
                <li key={idx}>
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
            Disclaimer: BrandBTSS is a participant in the Amazon Associates Program and other retail affiliate programs, designed to provide a means for sites to earn fees by advertising and linking to Amazon.com and partner platforms. We earn a small commission when you purchase via our recommendation links, at no additional cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
