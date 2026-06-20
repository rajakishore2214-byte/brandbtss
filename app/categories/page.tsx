import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Home, Zap, Cpu, Shirt, Briefcase, Star, Shield, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "All Product Categories | BrandBTSS",
  description:
    "Browse all BrandBTSS product review categories — Home & Kitchen, Smart Home Appliances, Electronics & Gadgets, Clothing & Accessories, and Freelancer Tools. Honest Amazon buying guides.",
  alternates: { canonical: "https://brandbtss.com/categories" },
  openGraph: {
    title: "All Product Categories | BrandBTSS",
    description: "Explore expert Amazon product reviews across 5 categories — all independently tested and rated.",
    url: "https://brandbtss.com/categories",
    type: "website",
  },
};

const categories = [
  {
    id: "home-kitchen",
    icon: Home,
    label: "Home & Kitchen",
    tagline: "The best-rated home and kitchen essentials on Amazon",
    description:
      "From smart organizers and premium non-stick cookware to airtight storage solutions — our Home & Kitchen roundup covers the top 3 products that actually make daily home life easier and more efficient.",
    productCount: 3,
    href: "/roundup/best-home-kitchen-amazon",
    highlights: ["Kitchen Organizers", "Non-Stick Cookware", "Pantry Storage"],
    color: "from-orange-500 to-amber-500",
    bgGlow: "bg-orange-500/10",
    borderHover: "hover:border-orange-400/30",
  },
  {
    id: "smart-home",
    icon: Zap,
    label: "Smart Home Appliances",
    tagline: "Automate your home with the best Amazon smart devices",
    description:
      "Smart home technology in 2026 is more affordable and capable than ever. Our Smart Home roundup features a universal hub, security camera, and smart energy plug — the three essentials for any connected home setup.",
    productCount: 3,
    href: "/roundup/best-smart-home-appliances",
    highlights: ["Smart Hub Controller", "Security Cameras", "Smart Energy Plugs"],
    color: "from-violet-500 to-indigo-500",
    bgGlow: "bg-violet-500/10",
    borderHover: "hover:border-violet-400/30",
  },
  {
    id: "electronics-gadgets",
    icon: Cpu,
    label: "Electronics & Gadgets",
    tagline: "8 expert-rated tech picks from Amazon's top electronics",
    description:
      "Our largest category roundup covers 8 independently tested electronics — from noise-cancelling headphones and wireless earbuds to power banks, USB-C hubs, smart desk lamps, and Bluetooth speakers. Every rupee justified.",
    productCount: 8,
    href: "/roundup/best-electronics-gadgets-amazon",
    highlights: ["Wireless Earbuds", "ANC Headphones", "Power Banks", "USB-C Hubs"],
    color: "from-cyan-500 to-blue-500",
    bgGlow: "bg-cyan-500/10",
    borderHover: "hover:border-cyan-400/30",
  },
  {
    id: "clothing-accessories",
    icon: Shirt,
    label: "Clothing & Accessories",
    tagline: "11 style-forward quality picks from Amazon fashion",
    description:
      "Amazon's fashion has come a long way. Our Clothing & Accessories roundup features 11 picks across everyday wear, outerwear, footwear, and accessories — all tested for genuine quality, durability, and real value for money.",
    productCount: 11,
    href: "/roundup/best-clothing-accessories-amazon",
    highlights: ["Merino Wool Sweaters", "Leather Belts & Wallets", "Waterproof Boots", "Analog Watches"],
    color: "from-rose-500 to-pink-500",
    bgGlow: "bg-rose-500/10",
    borderHover: "hover:border-rose-400/30",
  },
  {
    id: "freelancer-tools",
    icon: Briefcase,
    label: "Freelancer Tools",
    tagline: "The best invoicing, project management & billing software",
    description:
      "Our original category — freelancer productivity tools. We've spent hundreds of hours testing billing software, contract builders, time trackers, and project management platforms. Find the right tools to run your solopreneur business.",
    productCount: 5,
    href: "/roundup/best-pm-tools",
    highlights: ["Invoicing Software", "Project Management", "Time Tracking", "Proposal Tools"],
    color: "from-indigo-500 to-purple-500",
    bgGlow: "bg-indigo-500/10",
    borderHover: "hover:border-indigo-400/30",
  },
];

const faqs = [
  {
    question: "How are products selected for each category?",
    answer:
      "We analyze Amazon bestseller lists, review verified purchase feedback patterns, and conduct our own hands-on testing. Only products with consistent 4+ star ratings from verified buyers and strong real-world performance make our roundups.",
  },
  {
    question: "Are BrandBTSS reviews paid or sponsored?",
    answer:
      "No. We never accept payment for product placement or positive ratings. Our editorial process is fully independent. We earn affiliate commissions when you click through and purchase — but this never influences which products we recommend or how we rate them.",
  },
  {
    question: "How often are the category roundups updated?",
    answer:
      "Each category roundup is reviewed and refreshed quarterly, or sooner if a product is discontinued, significantly price-changed, or superseded by a better model. All roundups display their last updated date.",
  },
  {
    question: "Do the affiliate links cost me anything extra?",
    answer:
      "No. All affiliate links take you to Amazon at the exact same price. Amazon pays us a small commission from their existing margin. There is zero additional cost to you as a buyer.",
  },
];

export default function CategoriesPage() {
  return (
    <div className="bg-slate-50 text-slate-900 pb-24">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.08),transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              All Product Categories
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Expert Amazon Buying Guides,{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">
                Across Every Category
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Every roundup on BrandBTSS is independently researched, honestly rated, and written to help you make the
              best purchase decision — not the most profitable one.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-indigo-400" /> No Paid Placements
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-400" /> Hand-Tested Products
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-emerald-400" /> Verified Amazon Links
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4 mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Browse All Categories</h2>
          <p className="text-slate-500 text-sm">
            {categories.reduce((sum, c) => sum + c.productCount, 0)} total products reviewed across{" "}
            {categories.length} categories.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                id={`category-${cat.id}`}
                className={`group relative flex flex-col gap-5 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 ${cat.borderHover} hover:shadow-xl transition-all duration-300 overflow-hidden`}
              >
                {/* Glow blob */}
                <div
                  className={`absolute -top-6 -right-6 h-28 w-28 rounded-full ${cat.bgGlow} blur-2xl group-hover:opacity-80 transition-opacity`}
                />

                {/* Icon + count */}
                <div className="flex items-start justify-between">
                  <div
                    className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} p-3 text-white shadow-md`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">
                    {cat.productCount} picks
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1">
                  <h3 className="font-display text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                    {cat.label}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{cat.tagline}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{cat.description}</p>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2">
                  {cat.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span>View Roundup</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500">
            Everything you need to know about how we pick and rate products.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group border border-slate-200 rounded-2xl bg-white p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-indigo-500/20 transition-colors"
            >
              <summary className="flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base list-none">
                <span>{faq.question}</span>
                <span className="rounded-full bg-slate-100 p-1.5 text-slate-500 group-open:rotate-180 transition-transform shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 border-t border-slate-100 pt-3">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
