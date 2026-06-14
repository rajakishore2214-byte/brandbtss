"use client";

import React from "react";
import Link from "next/link";
import { Star, CheckCircle2, XCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Product } from "@/data/products";
import { formatINR } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
  featured?: boolean;
}

export default function ProductCard({ product, index, featured = false }: ProductCardProps) {
  // Determine Badge
  let badgeText = "";
  let badgeColor = "";

  if (product.price <= 1000) {
    badgeText = "Best Budget";
    badgeColor = "bg-emerald-600 text-white";
  } else if (product.rating >= 4.8) {
    badgeText = "Top Rated";
    badgeColor = "bg-primary text-primary-text font-bold";
  } else {
    badgeText = "Editor's Choice";
    badgeColor = "bg-slate-800 text-slate-200";
  }

  // Create review link check
  const reviewLink = `/reviews/${product.id}-review`;

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

      {/* Image Gallery */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {product.dealTag && (
          <div className="absolute bottom-3 left-3 rounded bg-amber-500 px-2 py-0.5 text-xs font-bold text-slate-900 animate-pulse-soft">
            {product.dealTag}
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Brand and category */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>{product.brand}</span>
            <span>•</span>
            <span className="capitalize">{product.category}</span>
          </div>

          <h3 className="mt-2 text-xl font-bold text-slate-900 hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 fill-current ${
                    i < Math.floor(product.rating) ? "" : "text-slate-200 fill-none"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700">{product.rating} / 5</span>
          </div>

          {/* Product Description */}
          <p className="mt-4 text-sm text-slate-600 leading-relaxed line-clamp-3">
            {product.description}
          </p>

          {/* Quick specs grid */}
          <div className="mt-5 grid grid-cols-2 gap-2 border-y border-slate-100 py-3 text-xs text-slate-500">
            {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
              <div key={key} className="truncate">
                <span className="font-semibold text-slate-700">{key}:</span> {val}
              </div>
            ))}
          </div>

          {/* Pros and Cons */}
          <div className="mt-5 space-y-3">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pros</span>
              {product.pros.slice(0, 2).map((pro, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{pro}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cons</span>
              {product.cons.slice(0, 1).map((con, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <XCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing and Actions */}
        <div className="mt-8 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Price</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-950">{formatINR(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">{formatINR(product.originalPrice)}</span>
                )}
              </div>
            </div>
            {product.originalPrice && (
              <span className="text-xs font-bold text-emerald-600">
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
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
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored nofollow"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-3 px-2 text-center text-xs font-black text-slate-950 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all"
            >
              Check Price
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
