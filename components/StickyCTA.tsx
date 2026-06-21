"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import { Product } from "@/data/products";
import { formatINR } from "@/lib/utils";

interface StickyCTAProps {
  product: Product;
}

export default function StickyCTA({ product }: StickyCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after user scrolls down 450px
      if (window.scrollY > 450) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] animate-in slide-in-from-bottom duration-300 md:px-6 md:py-4">
      <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
        {/* Product Info Thumbnail */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 40px, 48px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{product.name}</h4>
            <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
              <span className="text-[10px] sm:text-xs font-black text-slate-950">{formatINR(product.price)}</span>
              <span className="text-[10px] sm:text-xs text-slate-400">•</span>
              <div className="flex items-center text-amber-500 gap-0.5">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-[10px] sm:text-xs font-bold text-slate-700">{product.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliate CTA Action */}
        <div className="shrink-0 flex items-center gap-2">
          {product.dealTag && (
            <span className="hidden lg:inline-flex items-center rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
              {product.dealTag}
            </span>
          )}
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="sponsored nofollow"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 sm:px-6 sm:py-3 text-center text-xs sm:text-sm font-black text-slate-950 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all"
          >
            Check Price
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
