"use client";

import React from "react";

interface LogoProps {
  variant?: "horizontal" | "vertical" | "icon-only";
  className?: string;
  light?: boolean; // Set to true if rendering on a light background (changes "brand" text to slate-900 instead of white)
}

export default function Logo({ variant = "horizontal", className = "", light = false }: LogoProps) {
  const brandColorClass = light ? "text-slate-950" : "text-white";

  const renderIcon = (sizeClass: string) => (
    <img
      src="/logo.png"
      alt="BrandBTSS"
      className={`${sizeClass} select-none shrink-0 rounded-full`}
    />
  );

  if (variant === "icon-only") {
    return renderIcon(className || "h-10 w-10");
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative flex items-center justify-center h-24 w-24 rounded-full border border-[#E15500]/30 bg-black/40 p-3 mb-3 hover:scale-105 transition-transform duration-300">
          {renderIcon("h-full w-full")}
        </div>
        <span className="font-display text-2xl font-black tracking-tight select-none">
          <span className={brandColorClass}>brand</span>
          <span className="text-[#E15500]">btss</span>
        </span>
      </div>
    );
  }

  // Horizontal variant (Standard Header Logo)
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {renderIcon("h-9 w-9 hover:rotate-[10deg] transition-transform duration-300")}
      <span className="font-display text-xl sm:text-2xl font-black tracking-tight leading-none select-none">
        <span className={brandColorClass}>brand</span>
        <span className="text-[#E15500]">btss</span>
      </span>
    </div>
  );
}
