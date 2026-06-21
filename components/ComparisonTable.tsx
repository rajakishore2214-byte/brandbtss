"use client";

import React from "react";
import { Star, Check, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Product } from "@/data/products";
import { formatINR } from "@/lib/utils";
import AffiliateButton from "./AffiliateButton";

export interface SanityComparisonTable {
  title?: string;
  rows: {
    toolName: string;
    bestFor?: string;
    startingPrice?: string;
    rating?: number;
    affiliateSlug: string;
  }[];
}

interface ComparisonTableProps {
  table?: SanityComparisonTable;
  productsList?: Product[];
  campaign?: string;
}

export default function ComparisonTable({ table, productsList, campaign }: ComparisonTableProps) {
  // Scenario 1: Prisma Products List Matrix View
  if (productsList && productsList.length > 0) {
    // Gather all unique specification keys across all products
    const specKeys = Array.from(
      new Set(productsList.flatMap((p) => Object.keys(p.specs || {})))
    );

    return (
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="w-48 p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Specifications
                </th>
                {productsList.map((product) => (
                  <th key={product.id} className="p-4 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold text-slate-400 block truncate">{product.brand}</span>
                        <h4 className="font-bold text-sm text-slate-900 truncate">{product.name}</h4>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {/* Price Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/35">Price</td>
                {productsList.map((product) => (
                  <td key={product.id} className="p-4">
                    <div className="font-black text-slate-950 text-base">{formatINR(product.price)}</div>
                    {product.originalPrice && (
                      <div className="text-xs text-slate-400 line-through">{formatINR(product.originalPrice)}</div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Rating Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/35">Rating</td>
                {productsList.map((product) => (
                  <td key={product.id} className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-current text-amber-500" />
                      <span className="font-bold text-slate-900">{product.rating}</span>
                      <span className="text-xs text-slate-400">/ 5</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Dynamic Specification Keys */}
              {specKeys.map((key) => (
                <tr key={key}>
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/35 capitalize">{key}</td>
                  {productsList.map((product) => (
                    <td key={product.id} className="p-4 text-xs sm:text-sm">
                      {product.specs[key] || "N/A"}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Feature Bullets Summary */}
              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/35">Key Features</td>
                {productsList.map((product) => (
                  <td key={product.id} className="p-4">
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {product.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <Check className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* CTA Buttons Row */}
              <tr className="border-t border-slate-200 bg-slate-50/20">
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/35">Action</td>
                {productsList.map((product) => (
                  <td key={product.id} className="p-4">
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="sponsored nofollow"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2.5 px-3 text-center text-xs font-black text-slate-950 hover:bg-amber-600 hover:shadow-md active:scale-95 transition-all"
                    >
                      Check Price
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Scenario 2: Sanity B2B Tools Table View
  if (table && table.rows && table.rows.length > 0) {
    return (
      <div className="my-8 space-y-4">
        {table.title && (
          <h3 className="font-display text-lg font-bold text-slate-800 tracking-tight">
            {table.title}
          </h3>
        )}

        {/* Desktop Table View */}
        <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tool Name</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Best For</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Starting Price</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Rating</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {table.rows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{row.toolName}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full">
                      {row.bestFor || "General"}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{row.startingPrice || "N/A"}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-bold text-slate-900">{row.rating ? row.rating.toFixed(1) : "N/A"}</span>
                      <span className="text-xs text-slate-400">/ 5</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <AffiliateButton
                      slug={row.affiliateSlug}
                      text="Check Price"
                      campaign={campaign}
                      placement="comparison-table"
                      className="py-1.5 px-4 text-xs rounded-lg font-bold"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View */}
        <div className="md:hidden space-y-4">
          {table.rows.map((row, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h4 className="font-display font-bold text-slate-900 text-base">{row.toolName}</h4>
                
                {row.rating && (
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{row.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">Best For</span>
                  <span className="font-bold text-slate-700">{row.bestFor || "General"}</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">Price</span>
                  <span className="font-bold text-slate-700">{row.startingPrice || "N/A"}</span>
                </div>
              </div>

              <div className="pt-2">
                <AffiliateButton
                  slug={row.affiliateSlug}
                  text="Check Current Price"
                  campaign={campaign}
                  placement="comparison-table"
                  className="w-full text-xs py-2 rounded-xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

