import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Award, HelpCircle, Flame, DollarSign, RefreshCw, BarChart2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import NewsletterSignUp from "@/components/NewsletterSignUp";
import StructuredData from "@/components/StructuredData";
import { formatINR } from "@/lib/utils";
import { db, mapDbProduct, mapDbCategory, mapDbArticle } from "@/lib/db";

export default async function Home() {
  // Fetch categories, trending products, best listicles and single reviews from DB
  const dbCategories = await db.category.findMany({
    where: { parentSlug: null }
  });
  const categories = dbCategories.map(mapDbCategory);

  const dbProducts = await db.product.findMany({
    where: {
      id: {
        in: [
          "philips-air-fryer-hd9252",
          "noise-colorfit-pulse-grand",
          "jbl-go-4",
          "hostinger-managed-wordpress"
        ]
      }
    }
  });
  const trendingProducts = dbProducts.map(mapDbProduct);

  const dbArticles = await db.article.findMany({
    where: { type: "best" }
  });
  const listicleGuides = dbArticles.map(mapDbArticle);

  const dbReviews = await db.article.findMany({
    where: { type: "review" }
  });
  const reviewGuides = dbReviews.map(mapDbArticle);

  // FAQ list for home
  const homeFAQs = [
    {
      question: "Are your reviews independent?",
      answer: "Yes, 100%. We do not accept payment from brands for favorable reviews or product placements. We purchase the products out of our own research budget, test them in real-world scenarios, and document the pros and cons transparently."
    },
    {
      question: "How do you test products?",
      answer: "We purchase products, test their features (battery life, speed, durability, build quality), and benchmark them against competitors to provide detailed comparison metrics."
    },
    {
      question: "What is the best smartwatch for beginners?",
      answer: "If you are starting out, the Noise ColorFit Pulse Grand is an excellent budget choice under ₹2000. For Android power users, the Samsung Galaxy Watch6 represents the premium standard."
    },
    {
      question: "How can I contact the editorial team?",
      answer: "You can reach out to us via our Contact Page. We welcome feedback, correction suggestions, and product review requests."
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              100% Independent Product Testing
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Smart Buying Choices.<br />
              <span className="bg-gradient-to-r from-primary via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Honest, Hand-Tested Reviews.
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We purchase, benchmark, and test web hosting, digital gadgets, home appliances, decor accessories, and lifestyle products so you can buy with confidence.
            </p>
          </div>

          {/* Fake Interactive Search Input (Launches search modal in Header) */}
          <div className="mx-auto max-w-xl">
            <div className="relative cursor-pointer group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-amber-500 opacity-20 blur group-hover:opacity-40 transition-opacity" />
              <div className="relative flex items-center rounded-2xl border border-slate-700 bg-slate-950/90 px-5 py-4 text-slate-400 shadow-2xl">
                <span className="text-sm sm:text-base">Search smartwatches, air fryers, hosting plans, speakers...</span>
                <span className="ml-auto rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-text group-hover:bg-primary-hover transition-colors">
                  Search
                </span>
              </div>
            </div>
          </div>

          {/* Core Trust Badges */}
          <div className="mx-auto max-w-3xl pt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-primary" />
              <span>No Sponsored Placements</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-amber-400" />
              <span>Independent In-House Benchmarks</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4.5 w-4.5 text-emerald-400" />
              <span>Real-World Active Accounts Testing</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* 2. Featured Categories */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Product Categories</h2>
              <p className="text-sm text-slate-500">Unbiased reviews and specs for all your shopping choices</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative h-40 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-sm hover:shadow-lg transition-all"
              >
                {/* Background Image overlay */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-xs tracking-tight group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-300 font-medium flex items-center gap-1 mt-1">
                    Explore Guides <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Trending Hot Products */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
                <Flame className="h-3.5 w-3.5 fill-current" /> Hot Choices
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Trending Products Right Now</h2>
              <p className="text-sm text-slate-500">The most researched and compared products this week</p>
            </div>
            <Link href="/deals" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-hover">
              Browse Active Deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingProducts.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} featured={idx === 0} />
            ))}
          </div>
        </section>

        {/* 4. Best Products Under Budget */}
        <section className="rounded-3xl bg-amber-500/5 border border-amber-500/10 p-8 md:p-12 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 space-y-4">
            <div className="rounded-full bg-primary text-primary-text inline-flex p-3">
              <DollarSign className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Best Budget Selections</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We help affiliate builders optimize their start-up costs. Explore our review collections organized strictly by value and price.
            </p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
            {listicleGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/best-products/${guide.slug}`}
                className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 p-5 hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="space-y-2">
                  <span className="rounded bg-amber-50 text-amber-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {guide.category} guide
                  </span>
                  <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-base line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{guide.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary">
                  <span>View Recommendations</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Product Comparisons */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Top Product Comparisons</h2>
            <p className="text-sm text-slate-500">Detailed side-by-side match-ups to resolve software buying dilemmas</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/comparisons/hostinger-vs-bluehost"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                  <BarChart2 className="h-4 w-4" /> Web Hosting Faceoff
                </div>
                <h3 className="font-display text-xl font-bold text-slate-950 group-hover:text-primary transition-colors">
                  Hostinger Business vs Bluehost Choice Plus
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                  We benchmarked load speeds, server-side caching, and storage limits to find the best hosting plan for your affiliate blog.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="group-hover:text-primary">Compare specifications</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/comparisons/semrush-vs-ahrefs"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                  <BarChart2 className="h-4 w-4" /> SEO Tools Faceoff
                </div>
                <h3 className="font-display text-xl font-bold text-slate-950 group-hover:text-primary transition-colors">
                  Semrush Pro vs Ahrefs Lite Plan
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                  Matchup between the gold standard search suites. We compare keyword index sizes, site audits accuracy, and search limits.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="group-hover:text-primary">Compare specifications</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* 6. Latest Reviews */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Latest Hands-On Reviews</h2>
            <p className="text-sm text-slate-500">In-depth evaluations of single software tools</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {reviewGuides.map((review) => (
              <Link
                key={review.slug}
                href={`/reviews/${review.productIds?.[0]}-review`}
                className="group flex gap-4 items-center bg-white border border-slate-200 rounded-2xl p-4 hover:border-primary hover:shadow-md transition-all"
              >
                <img
                  src={review.image}
                  alt={review.title}
                  className="h-24 w-24 rounded-xl object-cover bg-slate-100 shrink-0"
                />
                <div className="min-w-0">
                  <span className="rounded bg-rose-50 text-rose-700 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1.5 inline-block">
                    Score: {review.rating} / 5
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-950 group-hover:text-primary transition-colors line-clamp-2">
                    {review.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{review.author} • {review.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 7. Popular Brands Grid */}
        <section className="border-y border-slate-200 py-10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center mb-6">
            Tested & Evaluated Brands
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6 items-center justify-items-center opacity-60">
            {["Hostinger", "Philips", "JBL", "Sony", "Noise", "Samsung", "ConvertKit", "Semrush"].map((brand) => (
              <span key={brand} className="font-display font-black text-sm sm:text-base text-slate-700 tracking-tight">
                {brand}
              </span>
            ))}
          </div>
        </section>

        {/* 8. Trust Indicator Section */}
        <section className="grid md:grid-cols-3 gap-8 bg-slate-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Why You Can Trust BrandBTSS Reviews
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google's search guidelines reward experience, expertise, and authority (E-E-A-T). We built our testing methodologies around those exact criteria.
            </p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 inline-flex text-primary">
                <RefreshCw className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm">Real Product Benchmarks</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We don't copy marketing copy. We purchase items, test specifications, check durability, and run comparison filters before writing.
              </p>
            </div>
            <div className="space-y-2">
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 inline-flex text-amber-400">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm">Zero Pay-to-Play Content</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Companies cannot purchase better ratings on our site. If an item lacks quality or is overpriced, we grade it low and propose value alternatives.
              </p>
            </div>
          </div>
        </section>

        {/* 9. FAQs Section */}
        <section className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500">Common questions about our recommendations and testing process</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {homeFAQs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-slate-200 rounded-2xl bg-white p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-primary transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base list-none">
                  <span>{faq.question}</span>
                  <span className="rounded-full bg-slate-100 p-1.5 text-slate-500 group-open:rotate-180 transition-transform">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 10. Newsletter Signup Banner */}
        <NewsletterSignUp />

      </div>

      {/* SEO Schema Markup Injection */}
      <StructuredData type="faq" data={homeFAQs} />
    </div>
  );
}
