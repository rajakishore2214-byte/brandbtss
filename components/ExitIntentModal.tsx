"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight, TrendingUp } from "lucide-react";

export default function ExitIntentModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if shown in current session to avoid annoying the user
    const hasBeenShown = sessionStorage.getItem("brandbtss_exit_intent_shown");
    if (hasBeenShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // clientY < 15 indicates mouse moving up to close tab or write in address bar
      if (e.clientY < 15) {
        setShowModal(true);
        sessionStorage.setItem("brandbtss_exit_intent_shown", "true");
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

        {/* Close button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="relative z-10 text-center space-y-5">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 animate-bounce">
            <Sparkles className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-2xl font-black tracking-tight">
              Wait! Don't Miss Out
            </h3>
            <p className="text-sm text-slate-300">
              We just updated our database with active software discounts and coupon codes! Save up to <span className="font-bold text-amber-400">55% off</span> on hosting, tracking plugins, and SEO tool subscriptions.
            </p>
          </div>

          {/* Quick teaser box */}
          <div className="rounded-xl bg-slate-950/50 p-4 border border-slate-800/80 text-left space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400">TODAY'S HOT DEALS</span>
              <span className="rounded bg-rose-500/10 text-rose-400 px-1.5 py-0.5 font-bold uppercase tracking-wider text-[9px]">
                Live Now
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">🔥 Hostinger Managed WordPress - 55% OFF</p>
              <p className="text-sm font-semibold text-white">🔥 GetResponse Email - 20% OFF</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/deals"
              onClick={() => setShowModal(false)}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-center text-sm font-bold text-primary-text hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              View Today's Hot Deals
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <button
              onClick={() => setShowModal(false)}
              className="w-full text-xs text-slate-500 hover:text-slate-400 py-1 font-medium transition-colors"
            >
              No thanks, I prefer paying full price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
