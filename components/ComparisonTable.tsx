"use client";

import React from "react";
import { Star, Check, ExternalLink } from "lucide-react";
import { Product } from "@/data/products";
import { formatINR } from "@/lib/utils";

interface ComparisonTableProps {
  productsList: Product[];
}

export default function ComparisonTable({ productsList }: ComparisonTableProps) {
  if (productsList.length === 0) return null;

  // Gather all unique specification keys across all products
  const specKeys = Array.from(
    new Set(productsList.flatMap((p) => Object.keys(p.specs)))
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
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover bg-slate-100"
                    />
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
