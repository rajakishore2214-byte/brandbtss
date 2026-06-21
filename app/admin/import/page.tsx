import React from "react";
import Link from "next/link";
import { ArrowLeft, Import, FileText } from "lucide-react";
import { importRawText } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Back Link */}
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>

        {/* Title */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="font-display text-2xl font-black text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Notebook LLM Note Importer
          </h1>
          <p className="text-xs text-slate-400 mt-1">Paste unstructured catalog sheets, specifications, or raw text blocks to extract database products and generate reviews</p>
        </div>

        {/* Form */}
        <form action={importRawText} className="space-y-6 bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
          
          <div className="space-y-1.5">
            <label htmlFor="text" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Raw Product Specifications / Text Notes</label>
            <textarea
              id="text"
              name="text"
              rows={12}
              required
              placeholder="Example:
Philips Digital Airfryer HD9252
Price is Rs 4999 (original Rs 6999). Rated 4.6 stars.
It has 4.1L capacity, uses 1400 Watts power, Rapid Air technology, 7 presets touch screen.
Pros: Very easy to clean, food cooks perfectly, small footprint.
Cons: Short power cord, slightly noisy.
Buy on Amazon: https://amazon.in/dp/B08HS8WDF4"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-3 text-sm text-white focus:outline-none transition-colors resize-y font-mono text-xs"
            />
            <span className="text-[10px] text-slate-500 block">Gemini will extract specifications, categories, pros/cons, features, and affiliate URLs, then write the product and queue a draft review.</span>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover py-3 text-center text-sm font-black text-primary-text hover:shadow-lg hover:shadow-primary/10 active:scale-98 transition-all"
            >
              <Import className="h-4.5 w-4.5" /> Parse & Auto-Generate Draft
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
