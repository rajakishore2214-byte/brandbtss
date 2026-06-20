import React from "react";
import AffiliateButton from "./AffiliateButton";
import { Award } from "lucide-react";

interface VerdictBoxProps {
  winnerName: string;
  summary: string;
  affiliateSlug: string;
  campaign?: string;
}

export default function VerdictBox({
  winnerName,
  summary,
  affiliateSlug,
  campaign,
}: VerdictBoxProps) {
  return (
    <div className="relative overflow-hidden my-8 rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/5 to-indigo-500/5 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1.5 text-xs font-black text-indigo-700 uppercase tracking-wider">
            <Award className="h-4 w-4" />
            <span>Our Top Pick</span>
          </div>
          
          <h3 className="font-display text-2xl font-black text-slate-900 tracking-tight">
            {winnerName}
          </h3>
          
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {summary}
          </p>
        </div>
        
        <div className="shrink-0 flex items-center">
          <AffiliateButton
            slug={affiliateSlug}
            text="Get It Now"
            campaign={campaign}
            placement="verdict-box"
            className="w-full md:w-auto shadow-indigo-500/10 bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/20"
          />
        </div>
      </div>
    </div>
  );
}
