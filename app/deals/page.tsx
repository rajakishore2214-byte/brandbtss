import React from "react";
import Link from "next/link";
import { Star, ShieldCheck, Tag, ShoppingCart, Percent } from "lucide-react";
import { db, mapDbProduct } from "@/lib/db";
import { formatINR } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function DealsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeCategory = params.category || "all";

  // Fetch parent categories from database
  const dbCategories = await db.category.findMany({
    where: { parentSlug: null }
  });

  const categoriesTabs = [
    { label: "All Deals", value: "all" },
    ...dbCategories.map(c => ({ label: c.name.split(" ")[0], value: c.slug }))
  ];

  // Build query where clause
  const whereClause: any = {
    originalPrice: { not: null }
  };

  if (activeCategory !== "all") {
    // If the category is a parent category, get all subcategory slugs too
    const subCategories = await db.category.findMany({
      where: { parentSlug: activeCategory }
    });
    const subSlugs = subCategories.map(sc => sc.slug);
    whereClause.categorySlug = { in: [activeCategory, ...subSlugs] };
  }

  // Fetch products that have active discounts
  const dbProducts = await db.product.findMany({
    where: whereClause
  });
  const dealProducts = dbProducts.map(mapDbProduct);

  return (
    <div className="pb-16 space-y-12">
      {/* 1. Header Section */}
      <section className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Tag className="h-3.5 w-3.5" /> Direct Coupon Alerts
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Active Product Deals & Coupons
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            We track pricing changes and coupon updates across top merchant networks. Get hand-verified discounts on home utility, gadgets, and lifestyle selections.
          </p>
        </div>
      </section>

      {/* Main Deals Feed Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-6">
          {categoriesTabs.map((cat) => (
            <Link
              key={cat.value}
              href={cat.value === "all" ? "/deals" : `/deals?category=${cat.value}`}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold tracking-tight transition-all active:scale-95 ${
                activeCategory === cat.value
                  ? "bg-primary text-primary-text shadow-md shadow-primary/20"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* 2. Deals Grid */}
        {dealProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium italic">No active discounts found in this category.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dealProducts.map((product) => {
              const original = product.originalPrice || product.price;
              const discountPercent = Math.round(((original - product.price) / original) * 100);
              
              const couponCode = `BTSS${discountPercent}`;

              return (
                <div
                  key={product.id}
                  className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative">
                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 z-10 rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-black text-white flex items-center gap-1 shadow-md">
                      <Percent className="h-3.5 w-3.5" />
                      <span>{discountPercent}% OFF</span>
                    </div>

                    {/* Image */}
                    <div className="aspect-video w-full overflow-hidden bg-slate-100">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-semibold uppercase">{product.brand}</span>
                        <span>•</span>
                        <span className="capitalize">{product.category}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-950 line-clamp-1">{product.name}</h3>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <div className="flex items-center text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                        <span className="font-semibold">{product.rating}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" /> In Stock
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & Promo Code */}
                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-950">{formatINR(product.price)}</span>
                        <span className="text-xs text-slate-400 line-through">{formatINR(original)}</span>
                      </div>

                      {/* Coupon Box */}
                      <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-2.5 flex items-center justify-between text-xs">
                        <div className="text-slate-500 font-medium">Use Coupon:</div>
                        <div className="font-mono font-bold text-primary bg-primary/5 border border-primary/25 rounded px-2 py-0.5 select-all">
                          {couponCode}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          href={`/reviews/${product.id}-review`}
                          className="rounded-xl border border-slate-200 py-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Read Review
                        </Link>
                        <a
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="sponsored nofollow"
                          className="inline-flex items-center justify-center gap-1 rounded-xl bg-amber-500 py-3 text-center text-xs font-black text-slate-950 hover:bg-amber-600 hover:shadow-lg active:scale-95 transition-all"
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
        )}
      </div>
    </div>
  );
}
