import React from "react";
import Link from "next/link";
import { ArrowLeft, MousePointerClick, Calendar, Globe, Monitor } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminClicksLog() {
  let clicks: any[] = [];
  let dbError = null;

  try {
    // Fetch up to 100 recent clicks
    clicks = await db.click.findMany({
      take: 100,
      orderBy: { clickedAt: "desc" }
    });
  } catch (err: any) {
    console.error("Failed to fetch click logs in admin dashboard:", err);
    dbError = err.message || String(err);
  }

  return (
    <div className="admin-dark min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {dbError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-slate-100 flex items-start gap-4">
            <div className="rounded-lg bg-red-500/20 p-2 text-red-400 shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">Database Configuration Required</h3>
              <p className="text-[11px] text-slate-350 leading-relaxed">
                We couldn&apos;t connect to the database to retrieve click logs. Please verify your <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-red-300">DATABASE_URL</code> environment variable in your Vercel settings.
              </p>
              <p className="text-[10px] text-slate-400 pt-1">
                <strong>Error Details:</strong> <code className="text-slate-300 font-mono break-all">{dbError}</code>
              </p>
            </div>
          </div>
        )}
        
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

