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
    <div className="relative overflow-hidden my-8 rounded-lg border-l-4 border-l-primary border-y border-r border-slate-200 bg-[#FAF9F6] p-6 sm:p-8 shadow-xs transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-sm bg-primary/10 px-2.5 py-1 text-[10px] font-black text-primary uppercase tracking-wider">
            <Award className="h-3.5 w-3.5" />
            <span>Our Top Pick</span>
          </div>
          
          <h3 className="font-sans text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug">
            {winnerName}
          </h3>
          
          <p className="text-base text-slate-700 leading-relaxed font-serif">
            {summary}
          </p>
        </div>
        
        <div className="shrink-0 flex items-center">
          <AffiliateButton
            slug={affiliateSlug}
            text="Get It Now"
            campaign={campaign}
            placement="verdict-box"
            className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white font-black hover:shadow-md active:scale-98 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
