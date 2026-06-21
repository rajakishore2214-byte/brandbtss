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
    <div className="space-y-16 pb-20 bg-slate-50 text-slate-900 font-sans">
      <SchemaMarkup type="home" />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#FAF9F6] border-b border-slate-200 py-16 sm:py-24">
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-sm bg-primary/10 px-3.5 py-1 text-xs font-black text-primary uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Independently Tested Amazon Product Reviews
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Real Reviews. Better Buys.<br />
            <span className="text-primary">
              Every Rupee Well Spent.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-serif">
            We hand-pick, test, and honestly rate the best Amazon products across Home &amp; Kitchen, Smart Home Appliances, Electronics, Clothing &amp; Accessories, and Freelancer Tools — so every purchase you make is backed by real expert research.
          </p>

          {/* Category Quick Nav */}
          <div className="mx-auto max-w-3xl pt-4">
            <div className="flex flex-wrap justify-center gap-2.5">
              <Link href="/roundup/best-home-kitchen-amazon"
                className="rounded-lg bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-primary-hover hover:shadow-md active:scale-98 transition-all flex items-center gap-1.5">
                <HomeIcon className="h-3.5 w-3.5" /> Home &amp; Kitchen
              </Link>
              <Link href="/roundup/best-electronics-gadgets-amazon"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:border-primary hover:text-primary active:scale-98 transition-all flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" /> Electronics &amp; Gadgets
              </Link>
              <Link href="/roundup/best-smart-home-appliances"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:border-primary hover:text-primary active:scale-98 transition-all flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Smart Home
              </Link>
              <Link href="/roundup/best-clothing-accessories-amazon"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:border-primary hover:text-primary active:scale-98 transition-all flex items-center gap-1.5">
                <Shirt className="h-3.5 w-3.5" /> Clothing &amp; Style
              </Link>
            </div>
          </div>

          {/* Core Trust Badges */}
          <div className="mx-auto max-w-3xl pt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-slate-200 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>No Paid Placements — Ever</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Independently Hand-Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <span>Verified Amazon Purchase Links</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* 2. Featured / Curated Guides Section */}
        {featuredPosts.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-sm bg-primary/10 px-2.5 py-0.5 text-[10px] font-black text-primary uppercase tracking-wider">
                <Flame className="h-3.5 w-3.5 fill-current" /> Editor&apos;s Picks
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                Featured Freelance Guides
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Highly researched tools comparison guides to help set up your billing systems.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => {
                const coverUrl = post.mainImage ? urlFor(post.mainImage).width(600).height(400).url() : null;
                const authorImageUrl = post.author?.photo ? urlFor(post.author.photo).width(40).height(40).url() : null;
                return (
                  <Link
                    key={post.slug}
                    href={`/${post.postType}/${post.slug}`}
                    className="group flex flex-col justify-between rounded-lg bg-white border border-slate-200 hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                        {coverUrl && (
                          <Image
                            src={coverUrl}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                        )}
                        <span className="absolute bottom-3 left-3 rounded-xs bg-primary px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                          {post.postType === "roundup" ? "Roundup" : "Single Review"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-2">
                        <h3 className="font-sans font-black text-base sm:text-lg text-slate-950 group-hover:text-primary transition-colors line-clamp-2 leading-snug tracking-tight">
                          {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed font-serif">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Author & Read CTA */}
                    <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      {post.author && (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center">
                            {authorImageUrl ? (
                              <Image src={authorImageUrl} alt={post.author.name} width={24} height={24} className="object-cover" />
                            ) : (
                              <span className="font-black text-primary block text-center text-[10px]">{post.author.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="font-bold text-slate-700 text-[11px]">{post.author.name}</span>
                        </div>
                      )}

                      <span className="font-bold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
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
        <section className="rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 md:p-12 relative overflow-hidden border border-slate-800 shadow-sm">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl animate-pulse" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative z-10 space-y-6">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-sm bg-primary/20 px-2.5 py-0.5 text-[10px] font-black text-primary uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Shop All Categories
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Expertly Curated Amazon Buying Guides
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Stop scrolling through thousands of Amazon listings. Our category roundups cut straight to the best-rated products with honest pros, cons, and expert verdicts.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: HomeIcon, label: "Home & Kitchen", sub: "3 top picks", href: "/roundup/best-home-kitchen-amazon", color: "from-orange-500/10 to-amber-500/5 border-orange-500/10 hover:border-primary/45" },
                { icon: Zap, label: "Smart Home", sub: "3 top picks", href: "/roundup/best-smart-home-appliances", color: "from-orange-600/10 to-red-500/5 border-orange-500/10 hover:border-primary/45" },
                { icon: Cpu, label: "Electronics", sub: "8 top picks", href: "/roundup/best-electronics-gadgets-amazon", color: "from-orange-600/10 to-yellow-500/5 border-orange-500/10 hover:border-primary/45" },
                { icon: Shirt, label: "Clothing", sub: "11 top picks", href: "/roundup/best-clothing-accessories-amazon", color: "from-orange-600/10 to-rose-500/5 border-orange-500/10 hover:border-primary/45" },
              ].map(({ icon: Icon, label, sub, href, color }) => (
                <Link key={href} href={href}
                  className={`group flex flex-col items-start gap-3 rounded-lg bg-gradient-to-br ${color} border p-5 hover:scale-[1.02] transition-all duration-300`}>
                  <div className="rounded-lg bg-white/10 p-2.5">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-xs sm:text-sm text-white">{label}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{sub}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Recent Reviews list */}
        {postsToShow.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                All Solopreneur Software Reviews
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
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
                    className="group flex gap-4 items-center bg-white border border-slate-200 rounded-lg p-4 hover:border-primary/30 hover:shadow-xs transition-all duration-300"
                  >
                    <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 relative">
                      {coverUrl && (
                        <Image
                          src={coverUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                        {post.postType === "roundup" ? "Roundup" : "Review"}
                      </span>
                      
                      <h3 className="font-bold text-sm text-slate-950 group-hover:text-primary transition-colors line-clamp-2 leading-snug tracking-tight">
                        {post.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                        <Calendar className="h-3 w-3" />
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
        <section className="space-y-6 max-w-4xl mx-auto">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Common questions about our testing and software rating processes.
            </p>
          </div>

          <div className="space-y-3.5">
            {homeFAQs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-slate-200 rounded-lg bg-white p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-primary/20 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base list-none">
                  <span>{faq.question}</span>
                  <span className="rounded-full bg-slate-50 p-1.5 text-slate-500 group-open:rotate-180 transition-transform">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 border-t border-slate-100 pt-3 font-serif">
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
