import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight, Sparkles, Shield, Award, HelpCircle, Flame, Calendar, Home as HomeIcon, Cpu, Zap, Shirt, Star, ShieldCheck, ShoppingCart, Percent } from "lucide-react";
import type { Metadata } from "next";

import { getRecentPosts, getPostsBySlugs } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";
import SchemaMarkup from "@/components/SchemaMarkup";
import StructuredData from "@/components/StructuredData";
import { db, mapDbProduct, mapDbArticle } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export const revalidate = 3600; // 1-hour cache revalidation (ISR)

export const metadata: Metadata = {
  title: "BrandBTSS | Honest Independent Software & Product Reviews",
  description: "Explore unbiased product reviews, side-by-side comparisons, and active discount coupon deals on web hosting, email marketing, and tech accessories.",
  alternates: {
    canonical: "https://brandbtss.com",
  },
  openGraph: {
    title: "BrandBTSS | Honest Independent Software & Product Reviews",
    description: "Explore unbiased product reviews, side-by-side comparisons, and active discount coupon deals on web hosting, email marketing, and tech accessories.",
    url: "https://brandbtss.com",
    siteName: "BrandBTSS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandBTSS | Honest Independent Software & Product Reviews",
    description: "Explore unbiased product reviews, side-by-side comparisons, and active discount coupon deals on web hosting, email marketing, and tech accessories.",
    creator: "@brandbtss",
  },
};

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
  
  // 1. Fetch from Database
  let featuredProducts: any[] = [];
  let latestDeals: any[] = [];
  let latestDbArticles: any[] = [];

  try {
    let dbFeatured = await db.product.findMany({
      where: { featured: true, status: "active" },
      take: 4
    });
    if (dbFeatured.length === 0) {
      dbFeatured = await db.product.findMany({
        where: { status: "active" },
        orderBy: { score: "desc" },
        take: 4
      });
    }
    featuredProducts = dbFeatured.map(mapDbProduct);
  } catch (err) {
    console.warn("Failed to query featured products during build/prerender:", err);
  }

  try {
    const dbDeals = await db.product.findMany({
      where: {
        originalPrice: { not: null },
        status: "active"
      },
      orderBy: { updatedAt: "desc" },
      take: 3
    });
    latestDeals = dbDeals.map(mapDbProduct);
  } catch (err) {
    console.warn("Failed to query latest deals during build/prerender:", err);
  }

  try {
    const dbArticles = await db.article.findMany({
      where: { status: "published" },
      orderBy: { date: "desc" },
      take: 3
    });
    latestDbArticles = dbArticles.map(mapDbArticle);
  } catch (err) {
    console.warn("Failed to query latest articles during build/prerender:", err);
  }

  // 2. Fetch from Sanity
  let recentPosts: any = null;
  let curatedPosts: any[] = [];
  try {
    const res = await Promise.all([
      getRecentPosts(),
      getPostsBySlugs(curatedSlugs),
    ]);
    recentPosts = res[0];
    curatedPosts = res[1];
  } catch (e) {
    console.warn("Failing back during Sanity queries:", e);
  }

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
      <StructuredData type="faq" data={homeFAQs} />

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
        
        {/* 2. Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-sm bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-black text-amber-500 uppercase tracking-wider">
                🔥 Top Rated Gear
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Our editorial team&apos;s highest-scoring and most recommended products, verified through hand-testing.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300">
                  <div className="space-y-3">
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300" />
                      <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-amber-400 border border-slate-800">
                        Score: {product.score}/100
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>{product.brand}</span>
                        <span>•</span>
                        <span className="text-primary">{product.category}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-tight min-h-[2.5rem]">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <div className="flex items-center text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </div>
                      <span className="font-bold text-slate-800">{product.rating}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[11px]">
                        <ShieldCheck className="h-3.5 w-3.5" /> Hand-Tested
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="text-lg font-black text-slate-950">{formatINR(product.price)}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/reviews/${product.id}-review`}
                        className="rounded-lg border border-slate-200 py-2 text-center text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Read Review
                      </Link>
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="sponsored nofollow"
                        className="rounded-lg bg-amber-500 py-2 text-center text-[11px] font-black text-slate-950 hover:bg-amber-600 hover:shadow-xs transition-all flex items-center justify-center gap-0.5"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" /> Buy Link
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Latest Active Deals Section */}
        {latestDeals.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-sm bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-black text-rose-500 uppercase tracking-wider">
                💸 Hand-Picked Discounts
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Latest Verified Deals
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Save on top-rated software packages and high-quality gadgets with our exclusive coupon codes.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestDeals.map((product) => {
                const original = product.originalPrice || product.price;
                const discountPercent = Math.round(((original - product.price) / original) * 100);
                const couponCode = `BTSS${discountPercent}`;

                return (
                  <div key={product.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-rose-500/20 transition-all duration-300 flex flex-col justify-between">
                    <div className="relative">
                      {/* Discount Tag */}
                      <div className="absolute top-3 left-3 z-10 rounded-lg bg-rose-500 px-2.5 py-1 text-[10px] font-black text-white flex items-center gap-0.5 shadow-xs">
                        <Percent className="h-3 w-3" />
                        <span>{discountPercent}% OFF</span>
                      </div>
                      {/* Image */}
                      <div className="aspect-video w-full overflow-hidden bg-slate-50">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                          <span>{product.brand}</span>
                          <span>•</span>
                          <span>{product.category}</span>
                        </div>
                        
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">{product.name}</h3>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <div className="flex items-center text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-current" />
                          </div>
                          <span className="font-bold text-slate-800">{product.rating}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[11px]">
                            <ShieldCheck className="h-3.5 w-3.5" /> In Stock
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-slate-950">{formatINR(product.price)}</span>
                          <span className="text-xs text-slate-400 line-through">{formatINR(original)}</span>
                        </div>

                        {/* Coupon Box */}
                        <div className="rounded-lg bg-slate-50 border border-slate-200/80 px-3 py-1.5 flex items-center justify-between text-xs">
                          <div className="text-slate-400 font-medium">Coupon Code:</div>
                          <div className="font-mono font-bold text-rose-500 bg-rose-50/50 border border-rose-100 rounded px-2 py-0.5 select-all">
                            {couponCode}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <Link
                            href={`/reviews/${product.id}-review`}
                            className="rounded-lg border border-slate-200 py-2.5 text-center text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            Read Review
                          </Link>
                          <a
                            href={product.affiliateUrl}
                            target="_blank"
                            rel="sponsored nofollow"
                            className="inline-flex items-center justify-center gap-0.5 rounded-lg bg-amber-500 py-2.5 text-center text-[11px] font-black text-slate-955 hover:bg-amber-600 active:scale-98 transition-all"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" /> Buy Deal
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. Latest Reviews & Guides Section (Local DB) */}
        {latestDbArticles.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-sm bg-primary/10 px-2.5 py-0.5 text-[10px] font-black text-primary uppercase tracking-wider">
                📰 Expert Content Feed
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Latest Reviews &amp; Guides
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                In-depth product breakdowns, head-to-head match-ups, and step-by-step buyer guidelines.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestDbArticles.map((article) => {
                let path = `/${article.type}/${article.slug}`;
                if (article.type === "best") {
                  path = `/best-products/${article.slug}`;
                } else if (article.type === "review") {
                  let productId = article.slug;
                  if (article.productIds && article.productIds.length > 0) {
                    productId = article.productIds[0];
                  }
                  path = `/reviews/${productId}-review`;
                }
                return (
                  <Link
                    key={article.slug}
                    href={path}
                    className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200 hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div>
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        <span className="absolute bottom-3 left-3 rounded-xs bg-primary px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                          {article.type === "review" ? "Review" : article.type === "best" ? "Best Selection" : "Article"}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="font-sans font-black text-base sm:text-lg text-slate-950 group-hover:text-primary transition-colors line-clamp-2 leading-snug tracking-tight">
                          {article.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed font-serif">
                          {article.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{article.date}</span>
                      </div>
                      <span className="font-bold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Read Article <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. Curated / Sanity Guides Section */}
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
              {featuredPosts.map((post: any) => {
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

        {/* 6. Amazon Category Showcase Banner */}
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

        {/* 7. Recent Reviews list (Sanity Fallback feed) */}
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
              {postsToShow.map((post: any) => {
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
                      
                      <h3 className="font-bold text-sm text-slate-955 group-hover:text-primary transition-colors line-clamp-2 leading-snug tracking-tight">
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

        {/* 8. FAQs Section */}
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
