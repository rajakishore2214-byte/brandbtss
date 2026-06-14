import React from "react";
import Link from "next/link";
import { ArrowLeft, MousePointerClick, Calendar, Globe, Monitor } from "lucide-react";
import { db } from "@/lib/db";

export default async function AdminClicksLog() {
  // Fetch up to 100 recent clicks
  const clicks = await db.click.findMany({
    take: 100,
    orderBy: { clickedAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation back */}
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>

        {/* Title */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="font-display text-2xl font-black text-white flex items-center gap-2">
            <MousePointerClick className="h-6 w-6 text-primary" /> Affiliate Clicks Timeline Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">Showing last 100 recorded redirect events in database</p>
        </div>

        {/* Clicks log table */}
        {clicks.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-12 text-center text-slate-400">
            <MousePointerClick className="h-12 w-12 mx-auto text-slate-600 mb-4" />
            <h3 className="font-bold text-sm text-slate-200">No Clicks Recorded</h3>
            <p className="text-xs text-slate-500 mt-1">Click on a product Buy Button anywhere on the site to trigger logging.</p>
          </div>
        ) : (
          <div className="overflow-hidden border border-slate-800 rounded-2xl bg-slate-900/10 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-900/80 text-slate-300 font-bold uppercase tracking-wider">
                  <th className="p-4">Click ID</th>
                  <th className="p-4">Product ID</th>
                  <th className="p-4">Affiliate Network</th>
                  <th className="p-4 flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-500" /> Timestamp</th>
                  <th className="p-4"><Globe className="h-3.5 w-3.5 text-slate-500" /> Client IP</th>
                  <th className="p-4"><Monitor className="h-3.5 w-3.5 text-slate-500" /> User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 bg-slate-950/60">
                {clicks.map((click: any) => (
                  <tr key={click.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="p-4 text-slate-500 font-mono">#{click.id}</td>
                    <td className="p-4 font-bold text-white">{click.productId}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        click.affiliateNetwork === "Amazon" ? "bg-amber-950 text-amber-400 border border-amber-800" :
                        click.affiliateNetwork === "Flipkart" ? "bg-blue-950 text-blue-400 border border-blue-800" :
                        "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}>
                        {click.affiliateNetwork}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(click.clickedAt).toLocaleString()}</td>
                    <td className="p-4 font-mono text-slate-500">{click.ip || "unknown"}</td>
                    <td className="p-4 text-slate-400 font-sans truncate max-w-xs" title={click.userAgent || ""}>
                      {click.userAgent || "unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
