import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight, Sparkles, Shield, Award, HelpCircle, Flame, Calendar, Home as HomeIcon, Cpu, Zap, Shirt } from "lucide-react";

import { getRecentPosts, getPostsBySlugs } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";
import SchemaMarkup from "@/components/SchemaMarkup";

export const revalidate = 3600; // 1-hour cache revalidation (ISR)

export default async function Home() {
  // Curated slugs for the homepage showcase — Amazon categories + top existing guides
  const curatedSlugs = [
    "best-home-kitchen-amazon",
    "best-electronics-gadgets-amazon",
    "best-clothing-accessories-amazon",
    "best-smart-home-appliances",
    "best-pm-tools",
    "bonsai-invoicing",
  ];
  
  // Fetch from Sanity
  const [recentPosts, curatedPosts] = await Promise.all([
    getRecentPosts(),
    getPostsBySlugs(curatedSlugs),
  ]);

  // Fallback if no posts are returned (during initial setup)
  const postsToShow = recentPosts || [];
  const featuredPosts = curatedPosts.length > 0 ? curatedPosts : postsToShow.slice(0, 3);

  const homeFAQs = [
    {
      question: "Are your product reviews independent and unbiased?",
      answer: "Yes, 100%. Our editorial team independently selects, orders, and tests products. We are not paid by brands for positive reviews. We earn commissions only when readers click our affiliate links — this never influences our ratings or recommendations."
    },
    {
      question: "How do you pick which Amazon products to review?",
      answer: "We analyze Amazon bestseller lists, verified customer feedback patterns, and category search trends. We look for products with consistent 4+ star verified purchase ratings, strong seller history, and genuine buyer feedback — then we order and test them ourselves."
    },
    {
      question: "Do your Amazon affiliate links cost the buyer extra?",
      answer: "No. Clicking our affiliate links takes you directly to Amazon at the same price as a regular search. Amazon pays us a small commission from their existing margin — there is no extra cost to you whatsoever."
    },
    {
      question: "What product categories do you cover?",
      answer: "We cover Home & Kitchen, Smart Home Appliances, Electronics & Gadgets, Clothing & Accessories, and Freelancer Productivity Tools. Each category has a dedicated roundup guide with rated product reviews and direct Amazon buy links."
    }
  ];

  return (
    <div className="space-y-20 pb-20 bg-slate-50 text-slate-900 font-sans">
      <SchemaMarkup type="home" />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 sm:py-32">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-4 py-1.5 text-xs font-bold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
              Independently Tested Amazon Product Reviews
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Real Reviews. Better Buys.<br />
              <span className="bg-gradient-to-r from-indigo-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Every Rupee Well Spent.
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              We hand-pick, test, and honestly rate the best Amazon products across Home &amp; Kitchen, Smart Home Appliances, Electronics, Clothing &amp; Accessories, and Freelancer Tools — so every purchase you make is backed by real expert research.
            </p>
          </div>

          {/* Category Quick Nav */}
          <div className="mx-auto max-w-3xl pt-4">
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/roundup/best-home-kitchen-amazon"
                className="rounded-full bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5">
                <HomeIcon className="h-3.5 w-3.5" /> Home &amp; Kitchen
              </Link>
              <Link href="/roundup/best-electronics-gadgets-amazon"
                className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-300 hover:border-indigo-500 hover:text-white transition-all cursor-pointer flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" /> Electronics &amp; Gadgets
              </Link>
              <Link href="/roundup/best-smart-home-appliances"
                className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-300 hover:border-indigo-500 hover:text-white transition-all cursor-pointer flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Smart Home
              </Link>
              <Link href="/roundup/best-clothing-accessories-amazon"
                className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-300 hover:border-indigo-500 hover:text-white transition-all cursor-pointer flex items-center gap-1.5">
                <Shirt className="h-3.5 w-3.5" /> Clothing &amp; Style
              </Link>
            </div>
          </div>

          {/* Core Trust Badges */}
          <div className="mx-auto max-w-3xl pt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-slate-900 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-indigo-400" />
              <span>No Paid Placements — Ever</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-amber-400" />
              <span>Independently Hand-Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4.5 w-4.5 text-emerald-400" />
              <span>Verified Amazon Purchase Links</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* 2. Featured / Curated Guides Section */}
        {featuredPosts.length > 0 && (
          <section className="space-y-8">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                <Flame className="h-3.5 w-3.5 fill-current" /> Editor's Picks
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                Featured Freelance Guides
              </h2>
              <p className="text-sm text-slate-500">
                Highly researched tools comparison guides to help set up your billing systems.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => {
                const coverUrl = post.mainImage ? urlFor(post.mainImage).width(600).height(400).url() : null;
                const authorImageUrl = post.author?.photo ? urlFor(post.author.photo).width(40).height(40).url() : null;
                return (
                  <Link
                    key={post.slug}
                    href={`/${post.postType}/${post.slug}`}
                    className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200 hover:border-indigo-500/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                        {coverUrl && (
                          <Image
                            src={coverUrl}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                        )}
                        <span className="absolute bottom-3 left-3 rounded-md bg-indigo-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          {post.postType === "roundup" ? "Roundup" : "Single Review"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <h3 className="font-display font-black text-lg text-slate-950 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Author & Read CTA */}
                    <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      {post.author && (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                            {authorImageUrl ? (
                              <Image src={authorImageUrl} alt={post.author.name} width={24} height={24} className="object-cover" />
                            ) : (
                              <span className="font-bold text-indigo-400 block text-center text-[10px]">{post.author.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="font-semibold text-slate-700 text-[11px]">{post.author.name}</span>
                        </div>
                      )}

                      <span className="font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Read Guide <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. Amazon Category Showcase Banner */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-indigo-500/25 blur-2xl animate-pulse" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 rounded-full bg-amber-500/15 blur-2xl" />

          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Shop All Categories
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Expertly Curated Amazon Buying Guides
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl">
                Stop scrolling through thousands of Amazon listings. Our category roundups cut straight to the best-rated products with honest pros, cons, and expert verdicts.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: HomeIcon, label: "Home & Kitchen", sub: "3 top picks", href: "/roundup/best-home-kitchen-amazon", color: "from-orange-500/20 to-amber-500/10 border-orange-500/20" },
                { icon: Zap, label: "Smart Home", sub: "3 top picks", href: "/roundup/best-smart-home-appliances", color: "from-indigo-500/20 to-violet-500/10 border-indigo-500/20" },
                { icon: Cpu, label: "Electronics", sub: "8 top picks", href: "/roundup/best-electronics-gadgets-amazon", color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/20" },
                { icon: Shirt, label: "Clothing", sub: "11 top picks", href: "/roundup/best-clothing-accessories-amazon", color: "from-rose-500/20 to-pink-500/10 border-rose-500/20" },
              ].map(({ icon: Icon, label, sub, href, color }) => (
                <Link key={href} href={href}
                  className={`group flex flex-col items-start gap-3 rounded-2xl bg-gradient-to-br ${color} border p-5 hover:scale-105 transition-all duration-300`}>
                  <div className="rounded-xl bg-white/10 p-2.5">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Recent Reviews list */}
        {postsToShow.length > 0 && (
          <section className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                All Solopreneur Software Reviews
              </h2>
              <p className="text-sm text-slate-500">
                Browse our latest breakdown guides and reviews.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {postsToShow.map((post) => {
                const coverUrl = post.mainImage ? urlFor(post.mainImage).width(300).height(200).url() : null;
                return (
                  <Link
                    key={post.slug}
                    href={`/${post.postType}/${post.slug}`}
                    className="group flex gap-4 items-center bg-white border border-slate-200 rounded-3xl p-4 hover:border-indigo-500/20 hover:shadow-md transition-all duration-300"
                  >
                    <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative">
                      {coverUrl && (
                        <Image
                          src={coverUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {post.postType === "roundup" ? "Roundup" : "Review"}
                      </span>
                      
                      <h3 className="font-bold text-sm sm:text-base text-slate-950 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{format(new Date(post.publishedAt), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. FAQs Section */}
        <section className="space-y-8 max-w-4xl mx-auto">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500">
              Common questions about our testing and software rating processes.
            </p>
          </div>

          <div className="space-y-4">
            {homeFAQs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-slate-200 rounded-2xl bg-white p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-indigo-500/20 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base list-none">
                  <span>{faq.question}</span>
                  <span className="rounded-full bg-slate-100 p-1.5 text-slate-500 group-open:rotate-180 transition-transform">
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
    </div>
  );
}
