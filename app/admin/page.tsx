import React from "react";
import Link from "next/link";
import { BarChart3, MousePointerClick, Layers, ShoppingBag, PlusCircle, ArrowUpRight, CheckCircle2, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // DB Queries for real-time metrics
  const totalClicks = await db.click.count();
  
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const clicksToday = await db.click.count({
    where: {
      clickedAt: { gte: oneDayAgo }
    }
  });

  const amazonClicks = await db.click.count({ where: { affiliateNetwork: "Amazon" } });
  const flipkartClicks = await db.click.count({ where: { affiliateNetwork: "Flipkart" } });
  const otherClicks = totalClicks - (amazonClicks + flipkartClicks);

  const productCount = await db.product.count();
  const categoryCount = await db.category.count();
  const articleCount = await db.article.count();

  // Fetch 5 most recent clicks
  const recentClicks = await db.click.findMany({
    take: 5,
    orderBy: { clickedAt: "desc" }
  });

  // Calculate percentage distribution
  const amazonPct = totalClicks > 0 ? Math.round((amazonClicks / totalClicks) * 100) : 0;
  const flipkartPct = totalClicks > 0 ? Math.round((flipkartClicks / totalClicks) * 100) : 0;
  const otherPct = totalClicks > 0 ? Math.round((otherClicks / totalClicks) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="font-display text-3xl font-black tracking-tight text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Track clicks, monitor conversions, and oversee catalog items</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/admin/clicks"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 text-xs font-bold text-slate-200 transition-colors"
            >
              <MousePointerClick className="h-4 w-4 text-primary" /> View Clicks Log
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 text-xs font-bold text-slate-200 transition-colors"
            >
              <PlusCircle className="h-4 w-4 text-amber-500" /> Manage Catalog
            </Link>
            <Link
              href="/admin/articles"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-text hover:bg-primary-hover transition-colors"
            >
              <PlusCircle className="h-4 w-4" /> Manage Articles
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Clicks</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{totalClicks}</span>
              <MousePointerClick className="h-5 w-5 text-primary" />
            </div>
            <span className="text-[10px] text-slate-500 block">Accumulated clicks tracker logs</span>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Clicks (24h)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-emerald-400">{clicksToday}</span>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-500 block">Outbound redirects today</span>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Catalog Products</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{productCount}</span>
              <ShoppingBag className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-[10px] text-slate-500 block">Items in seeded SQLite DB</span>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Categories</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{categoryCount}</span>
              <Layers className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-500 block">Seeded parent + sub-categories</span>
          </div>
        </div>

        {/* Network and Recent Clicks split grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Network breakdown */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/20 p-6 space-y-6 lg:col-span-1">
            <h3 className="font-display text-lg font-black text-white">Referral Networks</h3>
            
            <div className="space-y-4">
              {/* Amazon */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Amazon Associates</span>
                  <span>{amazonClicks} ({amazonPct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${amazonPct}%` }} />
                </div>
              </div>

              {/* Flipkart */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Flipkart Affiliate</span>
                  <span>{flipkartClicks} ({flipkartPct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${flipkartPct}%` }} />
                </div>
              </div>

              {/* Others */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Others (Impact / CJ)</span>
                  <span>{otherClicks} ({otherPct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${otherPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent click stream */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/20 p-6 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-black text-white">Recent Clicks Activity</h3>
              <Link href="/admin/clicks" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-0.5">
                Full Log <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentClicks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6 text-center">No affiliate clicks recorded yet. Try clicking on a product buy button!</p>
            ) : (
              <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-3">Product ID</th>
                      <th className="p-3">Network</th>
                      <th className="p-3">Clicked At</th>
                      <th className="p-3">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {recentClicks.map((click: any) => (
                      <tr key={click.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-slate-300">{click.productId}</td>
                        <td className="p-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            click.affiliateNetwork === "Amazon" ? "bg-amber-950 text-amber-400 border border-amber-800" :
                            click.affiliateNetwork === "Flipkart" ? "bg-blue-950 text-blue-400 border border-blue-800" :
                            "bg-slate-800 text-slate-300"
                          }`}>
                            {click.affiliateNetwork}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{new Date(click.clickedAt).toLocaleString()}</td>
                        <td className="p-3 font-mono text-slate-500">{click.ip || "unknown"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Database catalog overview */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
          <h3 className="font-display text-lg font-black text-white">Database Catalog Sync</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium">Categories Table</span>
                <span className="block text-lg font-bold text-white mt-1">{categoryCount} Items</span>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <Link href="/admin/products" className="p-4 rounded-2xl bg-slate-955 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/40 flex items-center justify-between transition-all">
              <div>
                <span className="text-slate-400 font-medium">Products Table</span>
                <span className="block text-lg font-bold text-white mt-1">{productCount} Items</span>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </Link>
            <Link href="/admin/articles" className="p-4 rounded-2xl bg-slate-955 border border-slate-800 hover:border-primary/50 hover:bg-slate-900/40 flex items-center justify-between transition-all">
              <div>
                <span className="text-slate-400 font-medium">Articles Table</span>
                <span className="block text-lg font-bold text-white mt-1">{articleCount} Items</span>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
