import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Plus, Edit, Calendar, User, Tag } from "lucide-react";
import { db } from "@/lib/db";
import DeleteArticleButton from "@/components/DeleteArticleButton";

export const dynamic = "force-dynamic";

export default async function AdminArticlesDashboard() {
  let articlesList: any[] = [];
  let dbError = null;

  try {
    // Fetch articles from database
    articlesList = await db.article.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (err: any) {
    console.error("Failed to fetch articles in admin dashboard:", err);
    dbError = err.message || String(err);
  }

  return (
    <div className="admin-dark min-h-screen py-6 sm:py-10">
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
              <p className="text-[11px] text-slate-355 leading-relaxed">
                We couldn&apos;t connect to the database to retrieve articles. Please verify your <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-red-300">DATABASE_URL</code> environment variable in your Vercel settings.
              </p>
              <p className="text-[10px] text-slate-400 pt-1">
                <strong>Error Details:</strong> <code className="text-slate-300 font-mono break-all">{dbError}</code>
              </p>
            </div>
          </div>
        )}
        
        {/* Navigation and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link href="/admin" className="text-slate-400 hover:text-white inline-flex items-center gap-1.5 text-xs font-bold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-text hover:bg-primary-hover active:scale-95 transition-all w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Add Article / Blog
          </Link>
        </div>

        {/* Title */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="font-display text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Articles & Blogs Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Publish and edit buying guides, product reviews, and blog updates</p>
        </div>

        {/* Articles list container */}
        {articlesList.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-12 text-center text-slate-400">
            <BookOpen className="h-12 w-12 mx-auto text-slate-600 mb-4" />
            <h3 className="font-bold text-sm text-slate-200">No Articles Found</h3>
            <p className="text-xs text-slate-500 mt-1">Get started by creating your first review or buying guide.</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden border border-slate-800 rounded-2xl bg-slate-900/10 shadow-xl">
              <table className="w-full text-left border-collapse text-xs min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-850 bg-slate-900/80 text-slate-300 font-bold uppercase tracking-wider">
                    <th className="p-4">Title</th>
                    <th className="p-4 w-28">Type</th>
                    <th className="p-4 w-32">Category</th>
                    <th className="p-4 w-36">Author</th>
                    <th className="p-4 w-28">Publish Date</th>
                    <th className="p-4 w-20">Status</th>
                    <th className="p-4 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 bg-slate-950/60">
                  {articlesList.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-xs sm:text-sm line-clamp-2 max-w-sm">{article.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5 select-all">/{article.slug}</div>
                      </td>
                      <td className="p-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                          article.type === "best" ? "bg-indigo-950 text-indigo-400 border border-indigo-900/40" :
                          article.type === "review" ? "bg-amber-950 text-amber-400 border border-amber-900/40" :
                          article.type === "comparison" ? "bg-blue-950 text-blue-400 border border-blue-900/40" :
                          "bg-slate-800 text-slate-300"
                        }`}>
                          {article.type}
                        </span>
                      </td>
                      <td className="p-4 capitalize text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {article.categorySlug}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-slate-500" /> {article.author}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-500" /> {article.date}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          article.status === "published" ? "text-emerald-400" : "text-amber-500"
                        }`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit Article"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <DeleteArticleButton id={article.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="grid gap-4 md:hidden">
              {articlesList.map((article) => (
                <div key={article.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                  <div className="space-y-1">
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase inline-block ${
                      article.type === "best" ? "bg-indigo-950 text-indigo-400 border border-indigo-900/40" :
                      article.type === "review" ? "bg-amber-950 text-amber-400 border border-amber-900/40" :
                      article.type === "comparison" ? "bg-blue-950 text-blue-400 border border-blue-900/40" :
                      "bg-slate-800 text-slate-300"
                    }`}>
                      {article.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono select-all block mt-1">/{article.slug}</span>
                    <span className="font-extrabold text-white text-sm block leading-tight">{article.title}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-medium capitalize">
                      <Tag className="h-3 w-3 text-slate-500" /> {article.categorySlug}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <User className="h-3 w-3 text-slate-500" /> {article.author}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="h-3 w-3 text-slate-500" /> {article.date}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-3 border-t border-slate-800/60">
                    <div>
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        article.status === "published" ? "text-emerald-400" : "text-amber-500"
                      }`}>
                        Status: {article.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="inline-flex h-8 px-3 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                        title="Edit Article"
                      >
                        Edit
                      </Link>
                      <DeleteArticleButton id={article.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

