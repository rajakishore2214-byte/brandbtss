import React from "react";
import Link from "next/link";
import { MousePointerClick, Layers, ShoppingBag, PlusCircle, ArrowUpRight, CheckCircle2, TrendingUp, LogOut } from "lucide-react";
import { db } from "@/lib/db";
import { adminLogout } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

function getOneDayAgo() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}

export default async function AdminDashboard() {
  let dbError = null;
  let totalClicks = 0;
  let clicksToday = 0;
  let amazonClicks = 0;
  let flipkartClicks = 0;
  let otherClicks = 0;
  let productCount = 0;
  let categoryCount = 0;
  let articleCount = 0;
  let blogCount = 0;
  let draftArticleCount = 0;
  let publishedArticleCount = 0;
  let productSeoPct = 100;
  let articleTitlePct = 100;
  let articleDescPct = 100;
  let productsWithKeywords = 0;
  let validTitlesCount = 0;
  let validDescsCount = 0;
  let seoOverallScore = 100;
  let recentClicks: any[] = [];
  let amazonPct = 0;
  let flipkartPct = 0;
  let otherPct = 0;

  try {
    totalClicks = await db.click.count();
    const oneDayAgo = getOneDayAgo();
    clicksToday = await db.click.count({ where: { clickedAt: { gte: oneDayAgo } } });
    amazonClicks = await db.click.count({ where: { affiliateNetwork: "Amazon" } });
    flipkartClicks = await db.click.count({ where: { affiliateNetwork: "Flipkart" } });
    otherClicks = totalClicks - (amazonClicks + flipkartClicks);
    productCount = await db.product.count();
    categoryCount = await db.category.count();
    articleCount = await db.article.count();
    blogCount = await db.article.count({ where: { type: "blog" } });
    draftArticleCount = await db.article.count({ where: { status: "draft" } });
    publishedArticleCount = await db.article.count({ where: { status: "published" } });

    productsWithKeywords = await db.product.count({
      where: { AND: [{ NOT: { keywords: null } }, { NOT: { keywords: "" } }] }
    });
    productSeoPct = productCount > 0 ? Math.round((productsWithKeywords / productCount) * 100) : 100;

    const articlesListForSeo = await db.article.findMany({
      select: { seoTitle: true, seoDescription: true }
    });
    validTitlesCount = articlesListForSeo.filter(a => a.seoTitle && a.seoTitle.trim().length > 10).length;
    validDescsCount = articlesListForSeo.filter(a => a.seoDescription && a.seoDescription.trim().length >= 100 && a.seoDescription.trim().length <= 170).length;
    articleTitlePct = articleCount > 0 ? Math.round((validTitlesCount / articleCount) * 100) : 100;
    articleDescPct = articleCount > 0 ? Math.round((validDescsCount / articleCount) * 100) : 100;
    seoOverallScore = Math.round((productSeoPct + articleTitlePct + articleDescPct) / 3);

    recentClicks = await db.click.findMany({ take: 5, orderBy: { clickedAt: "desc" } });
    amazonPct = totalClicks > 0 ? Math.round((amazonClicks / totalClicks) * 100) : 0;
    flipkartPct = totalClicks > 0 ? Math.round((flipkartClicks / totalClicks) * 100) : 0;
    otherPct = totalClicks > 0 ? Math.round((otherClicks / totalClicks) * 100) : 0;
  } catch (err: any) {
    console.error("Database connection failure in AdminDashboard:", err);
    dbError = err.message || String(err);
  }

  return (
    <div className="admin-dark min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

        {/* DB Error Banner */}
        {dbError && (
          <div className="rounded-xl border border-red-500/40 bg-red-950/60 p-5 flex items-start gap-4">
            <div className="rounded-lg bg-red-500/25 p-2 text-red-400 shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">Database Configuration Required</h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                We couldn&apos;t connect to the database. The <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-red-300">DATABASE_URL</code> environment variable has not been configured in your Vercel deployment settings, or the PostgreSQL server is offline.
              </p>
              <p className="text-[10px] text-slate-400 pt-1">
                <strong>Error:</strong> <code className="font-mono break-all text-slate-400">{dbError}</code>
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Admin Panel</span>
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400 mt-0.5">Track clicks, monitor conversions, and oversee catalog items</p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            <Link href="/admin/clicks" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/8 hover:border-primary/40 hover:bg-primary/10 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-all">
              <MousePointerClick className="h-4 w-4 text-primary" /> Clicks Log
            </Link>
            <Link href="/admin/products" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/8 hover:border-amber-500/40 hover:bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-all">
              <PlusCircle className="h-4 w-4 text-amber-400" /> Products
            </Link>
            <Link href="/admin/articles" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/8 hover:border-indigo-500/40 hover:bg-indigo-500/10 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-all">
              <PlusCircle className="h-4 w-4 text-indigo-400" /> Articles
            </Link>
            <Link href="/admin/import" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-primary/20 transition-all">
              <PlusCircle className="h-4 w-4" /> Import Note / Links
            </Link>
            <form action={adminLogout} className="inline-flex">
              <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/8 hover:border-red-500/40 hover:bg-red-950/40 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-red-400 transition-all cursor-pointer">
                <LogOut className="h-4 w-4" /> Log Out
              </button>
            </form>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="admin-card p-5 space-y-3 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Clicks</span>
              <div className="rounded-lg bg-primary/10 p-2"><MousePointerClick className="h-4 w-4 text-primary" /></div>
            </div>
            <span className="text-4xl font-black text-white block">{totalClicks}</span>
            <span className="text-[10px] text-slate-500 block">Today: <span className="text-slate-300 font-semibold">{clicksToday}</span></span>
          </div>

          <div className="admin-card p-5 space-y-3 hover:border-amber-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Products</span>
              <div className="rounded-lg bg-amber-500/10 p-2"><ShoppingBag className="h-4 w-4 text-amber-400" /></div>
            </div>
            <span className="text-4xl font-black text-white block">{productCount}</span>
            <span className="text-[10px] text-slate-500 block">Seeded products in catalog</span>
          </div>

          <div className="admin-card p-5 space-y-3 hover:border-indigo-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Articles & Blogs</span>
              <div className="rounded-lg bg-indigo-500/10 p-2"><Layers className="h-4 w-4 text-indigo-400" /></div>
            </div>
            <span className="text-4xl font-black text-white block">{articleCount}</span>
            <span className="text-[10px] text-slate-500 block">
              <span className="text-emerald-400 font-semibold">{publishedArticleCount}</span> Published ·{" "}
              <span className="text-amber-400 font-semibold">{draftArticleCount}</span> Drafts
            </span>
          </div>

          <div className="admin-card p-5 space-y-3 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">SEO Health Score</span>
              <div className="rounded-lg bg-emerald-500/10 p-2"><TrendingUp className="h-4 w-4 text-emerald-400" /></div>
            </div>
            <span className={`text-4xl font-black block ${seoOverallScore >= 80 ? "text-emerald-400" : seoOverallScore >= 50 ? "text-amber-400" : "text-rose-400"}`}>
              {seoOverallScore}%
            </span>
            <span className="text-[10px] text-slate-500 block">Keywords & Meta checks</span>
          </div>
        </div>

        {/* SEO Status Report */}
        <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="font-display text-lg font-black text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> SEO Status Report
            </h3>
            <span className="text-xs text-slate-500">Calculated from database records</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="admin-card-muted p-4 space-y-2.5">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Product Keywords</span>
                <span className="text-white font-black">{productSeoPct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${productSeoPct}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 block">{productsWithKeywords} of {productCount} products have tags</span>
            </div>
            <div className="admin-card-muted p-4 space-y-2.5">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>SEO Titles (min 10 chars)</span>
                <span className="text-white font-black">{articleTitlePct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${articleTitlePct}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 block">{validTitlesCount} of {articleCount} articles optimized</span>
            </div>
            <div className="admin-card-muted p-4 space-y-2.5">
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Meta Descs (100–170 chars)</span>
                <span className="text-white font-black">{articleDescPct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${articleDescPct}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 block">{validDescsCount} of {articleCount} articles in range</span>
            </div>
          </div>
        </section>

        {/* Network + Recent Clicks */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-5 lg:col-span-1">
            <h3 className="font-display text-lg font-black text-white">Referral Networks</h3>
            <div className="space-y-5">
              {[
                { label: "Amazon Associates", clicks: amazonClicks, pct: amazonPct, color: "bg-amber-400", textColor: "text-amber-400" },
                { label: "Flipkart Affiliate", clicks: flipkartClicks, pct: flipkartPct, color: "bg-blue-400", textColor: "text-blue-400" },
                { label: "Others (Impact / CJ)", clicks: otherClicks, pct: otherPct, color: "bg-primary", textColor: "text-primary" },
              ].map(({ label, clicks, pct, color, textColor }) => (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>{label}</span>
                    <span className={textColor}>{clicks} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-black text-white">Recent Clicks Activity</h3>
              <Link href="/admin/clicks" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-0.5 transition-colors">
                Full Log <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {recentClicks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6 text-center">No affiliate clicks recorded yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
                <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-3">Product ID</th>
                      <th className="p-3">Network</th>
                      <th className="p-3">Clicked At</th>
                      <th className="p-3">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentClicks.map((click: any) => (
                      <tr key={click.id} className="hover:bg-white/3 transition-colors">
                        <td className="p-3 font-semibold text-slate-300">{click.productId}</td>
                        <td className="p-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            click.affiliateNetwork === "Amazon" ? "bg-amber-950/60 text-amber-400 border border-amber-800/50" :
                            click.affiliateNetwork === "Flipkart" ? "bg-blue-950/60 text-blue-400 border border-blue-800/50" :
                            "bg-white/5 text-slate-300 border border-white/10"
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

        {/* Database Catalog Sync */}
        <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-4">
          <h3 className="font-display text-lg font-black text-white">Database Catalog Sync</h3>
          <div className="grid sm:grid-cols-4 gap-4 text-xs">
            <div className="admin-card-muted p-4 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium">Categories Table</span>
                <span className="block text-xl font-black text-white mt-1">{categoryCount} <span className="text-xs font-medium text-slate-500">Items</span></span>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            </div>
            <Link href="/admin/products" className="admin-card-muted p-4 flex items-center justify-between hover:border-amber-500/30 transition-all">
              <div>
                <span className="text-slate-400 font-medium">Products Table</span>
                <span className="block text-xl font-black text-white mt-1">{productCount} <span className="text-xs font-medium text-slate-500">Items</span></span>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            </Link>
            <Link href="/admin/articles" className="admin-card-muted p-4 flex items-center justify-between hover:border-primary/30 transition-all">
              <div>
                <span className="text-slate-400 font-medium">Articles Table</span>
                <span className="block text-xl font-black text-white mt-1">{articleCount} <span className="text-xs font-medium text-slate-500">({blogCount} Blogs)</span></span>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            </Link>
            <div className="admin-card-muted p-4 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium">Draft Articles</span>
                <span className="block text-xl font-black text-white mt-1">{draftArticleCount} <span className="text-xs font-medium text-slate-500">Items</span></span>
              </div>
              <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

