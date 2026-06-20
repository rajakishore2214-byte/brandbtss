"use client";

import React from "react";
import Link from "next/link";
import { Star, CheckCircle2, XCircle, ArrowRight, ExternalLink } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { urlFor } from "@/lib/sanity.image";

interface ProductCardProps {
  product: {
    id?: string;
    _id?: string;
    name: string;
    brand?: string;
    category?: string;
    price?: number;
    originalPrice?: number;
    rating?: number;
    image?: string;
    affiliateUrl?: string;
    description?: string;
    features?: string[];
    pros?: string[];
    cons?: string[];
    specs?: Record<string, string>;
    dealTag?: string;
    tagline?: string;
    priceText?: string;
    affiliateSlug?: string;
    ctaText?: string;
    logo?: any;
  };
  index?: number;
  featured?: boolean;
  campaign?: string;
  placement?: string;
}

export default function ProductCard({
  product,
  index,
  featured = false,
  campaign,
  placement
}: ProductCardProps) {
  // Normalize fields between Prisma model and Sanity model
  const name = product.name;
  const brand = product.brand || "";
  const category = product.category || "";
  const rating = product.rating || 5;
  const description = product.description || product.tagline || "";
  const pros = product.pros || [];
  const cons = product.cons || [];
  const specs = product.specs || {};
  const ctaText = product.ctaText || "Check Price";
  
  // Normalize Image
  let imageUrl = product.image || "";
  if (!imageUrl && product.logo) {
    try {
      imageUrl = urlFor(product.logo).width(600).height(400).url();
    } catch (e) {
      imageUrl = "";
    }
  }
  if (!imageUrl) {
    imageUrl = "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600";
  }

  // Normalize Affiliate URL
  let redirectHref = product.affiliateUrl || "";
  if (!redirectHref && product.affiliateSlug) {
    const queryParams = new URLSearchParams();
    if (campaign) queryParams.set("campaign", campaign);
    if (placement) queryParams.set("placement", placement || "product-card");
    const queryString = queryParams.toString();
    redirectHref = `/go/${product.affiliateSlug}${queryString ? `?${queryString}` : ""}`;
  }

  // Normalize Pricing
  const isPrismaPrice = typeof product.price === "number";
  const priceDisplay = product.priceText || (isPrismaPrice ? formatINR(product.price!) : "Contact Vendor");
  const originalPriceDisplay = product.originalPrice ? formatINR(product.originalPrice) : null;
  const discountPercent = (isPrismaPrice && product.originalPrice)
    ? Math.round(((product.originalPrice - product.price!) / product.originalPrice) * 100)
    : null;

  // Determine Badge
  let badgeText = product.dealTag || "";
  let badgeColor = "bg-amber-500 text-slate-900";

  if (!badgeText) {
    if (isPrismaPrice && product.price! <= 1000) {
      badgeText = "Best Budget";
      badgeColor = "bg-emerald-600 text-white";
    } else if (rating >= 4.8) {
      badgeText = "Top Rated";
      badgeColor = "bg-primary text-primary-text font-bold";
    } else {
      badgeText = "Editor's Choice";
      badgeColor = "bg-slate-800 text-slate-200";
    }
  }

  // Create review link check
  const id = product.id || product._id || "product";
  const reviewLink = `/reviews/${id}-review`;

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 ${
        featured ? "border-primary/50 ring-2 ring-primary/10" : "border-slate-200"
      }`}
    >
      {/* Index Number Badge */}
      {index !== undefined && (
        <div className="absolute top-0 left-0 z-10 flex h-10 w-10 items-center justify-center rounded-br-2xl bg-primary font-display text-lg font-black text-primary-text">
          #{index + 1}
        </div>
      )}

      {/* Ribbon Badge */}
      {badgeText && (
        <span
          className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}
        >
          {badgeText}
        </span>
      )}

      {/* Product Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Card Info */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Brand and category */}
          {(brand || category) && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              {brand && <span>{brand}</span>}
              {brand && category && <span>•</span>}
              {category && <span className="capitalize">{category}</span>}
            </div>
          )}

          <h3 className="mt-2 text-xl font-bold text-slate-900 hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 fill-current ${
                    i < Math.floor(rating) ? "" : "text-slate-200 fill-none"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700">{rating} / 5</span>
          </div>

          {/* Product Description */}
          {description && (
            <p className="mt-4 text-sm text-slate-600 leading-relaxed line-clamp-3">
              {description}
            </p>
          )}

          {/* Quick specs grid (conditional) */}
          {Object.keys(specs).length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-2 border-y border-slate-100 py-3 text-xs text-slate-500">
              {Object.entries(specs).slice(0, 4).map(([key, val]) => (
                <div key={key} className="truncate">
                  <span className="font-semibold text-slate-700">{key}:</span> {val}
                </div>
              ))}
            </div>
          )}

          {/* Pros and Cons */}
          {(pros.length > 0 || cons.length > 0) && (
            <div className="mt-5 space-y-3">
              {pros.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pros</span>
                  {pros.slice(0, 2).map((pro, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              )}
              {cons.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cons</span>
                  {cons.slice(0, 1).map((con, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <XCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing and Actions */}
        <div className="mt-8 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Price</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-950">{priceDisplay}</span>
                {originalPriceDisplay && (
                  <span className="text-sm text-slate-400 line-through">{originalPriceDisplay}</span>
                )}
              </div>
            </div>
            {discountPercent && (
              <span className="text-xs font-bold text-emerald-600">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={reviewLink}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all"
            >
              Read Review
            </Link>

            <a
              href={redirectHref}
              target="_blank"
              rel="sponsored nofollow"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-3 px-2 text-center text-xs font-black text-slate-950 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all"
            >
              {ctaText}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
