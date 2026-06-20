import React from "react";

interface AffiliateButtonProps {
  slug: string;
  text?: string;
  className?: string;
  campaign?: string;
  placement?: string;
}

export default function AffiliateButton({
  slug,
  text = "Check Current Price",
  className = "",
  campaign,
  placement,
}: AffiliateButtonProps) {
  // Construct the redirect URL with tracking parameters
  const queryParams = new URLSearchParams();
  if (campaign) queryParams.set("campaign", campaign);
  if (placement) queryParams.set("placement", placement);
  
  const queryString = queryParams.toString();
  const redirectHref = `/go/${slug}${queryString ? `?${queryString}` : ""}`;

  return (
    <a
      href={redirectHref}
      target="_blank"
      rel="nofollow sponsored"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 px-6 text-center text-sm font-black text-slate-950 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all duration-200 cursor-pointer ${className}`}
    >
      <span>{text}</span>
      <svg
        className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  );
}
