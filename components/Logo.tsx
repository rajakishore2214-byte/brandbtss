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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={`${sizeClass} select-none shrink-0`}
    >
      {/* 3 Radiating Speed/Spark Lines on Top-Right */}
      <line x1="68" y1="28" x2="75" y2="21" stroke="#FFB800" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="60" y1="32" x2="69" y2="30" stroke="#FFB800" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="62" y1="39" x2="70" y2="41" stroke="#FFB800" strokeWidth="5.5" strokeLinecap="round" />
      
      {/* Main Chat Bubble Outer Path */}
      <path
        d="M 48.5 25 C 60.93 25 71 35.07 71 47.5 C 71 59.93 60.93 70 48.5 70 C 43.19 70 38.27 68.17 34.33 65.11 L 25.5 68.5 L 28.82 59.97 C 25.77 56.02 23.95 51.1 23.95 45.75 C 23.95 33.32 34.02 23.25 46.45 23.25 Z"
        stroke="#FFB800"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Wink Eye (Left) - Arched upwards smile wink */}
      <path
        d="M 36.5 45.5 C 38 43.5 41 43.5 42.5 45.5"
        stroke="#FFB800"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      
      {/* Open Eye (Right) - Oval dot */}
      <ellipse cx="53" cy="45" rx="3" ry="4.5" fill="#FFB800" />
      
      {/* Smile Mouth */}
      <path
        d="M 39.5 53 C 41.5 56.5 46.5 56.5 48.5 53"
        stroke="#FFB800"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "icon-only") {
    return renderIcon(className || "h-10 w-10");
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative flex items-center justify-center h-24 w-24 rounded-full border border-[#FFB800]/30 bg-black/40 p-3 mb-3 hover:scale-105 transition-transform duration-300">
          {renderIcon("h-full w-full")}
        </div>
        <span className="font-display text-2xl font-black tracking-tight select-none">
          <span className={brandColorClass}>brand</span>
          <span className="text-[#FFB800]">btss</span>
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
        <span className="text-[#FFB800]">btss</span>
      </span>
    </div>
  );
}
