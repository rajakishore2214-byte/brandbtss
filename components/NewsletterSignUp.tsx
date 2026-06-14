"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

export default function NewsletterSignUp() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    
    // Simulate API registration
    setTimeout(() => {
      setStatus("success");
      setMessage("Success! Welcome to the BrandBTSS Insider newsletter.");
      setEmail("");
    }, 1200);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white p-8 md:p-12 shadow-2xl">
      {/* Background blobs for premium depth */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-amber-600/20 blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="h-6 w-6" />
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-black tracking-tight">
          Join the BrandBTSS Newsletter
        </h3>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
          Get weekly curated collections of the best-tested web hosts, autoresponder tools, and SEO software coupon alerts.
        </p>

        <div className="pt-4 max-w-md mx-auto">
          {status === "success" ? (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-400 flex items-center justify-center gap-2 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-black text-primary-text hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Subscribing
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
              {status === "error" && (
                <p className="text-xs text-rose-400 text-left pl-1">{message}</p>
              )}
            </form>
          )}
        </div>
        <p className="text-[10px] text-slate-500">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
