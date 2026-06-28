import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, ShieldCheck, Star, Plus, Edit } from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import DeleteProductButton from "@/components/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsDashboard() {
  let productsList: any[] = [];
  let dbError = null;

  try {
    // Fetch products from database
    productsList = await db.product.findMany({
      orderBy: { brand: "asc" }
    });
  } catch (err: any) {
    console.error("Failed to fetch products in admin dashboard:", err);
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
              <p className="text-[11px] text-slate-350 leading-relaxed">
                We couldn&apos;t connect to the database to retrieve products. Please verify your <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-red-300">DATABASE_URL</code> environment variable in your Vercel deployment dashboard.
              </p>
              <p className="text-[10px] text-slate-400 pt-1">
                <strong>Error Details:</strong> <code className="text-slate-300 font-mono break-all">{dbError}</code>
              </p>
            </div>
          </div>
        )}
        
        {/* Navigation back and Add Product */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link href="/admin" className="text-slate-400 hover:text-white inline-flex items-center gap-1.5 text-xs font-bold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-text hover:bg-primary-hover active:scale-95 transition-all w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>

        {/* Title */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="font-display text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" /> Product Catalog Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage product specifications, review scores, and merchant details</p>
        </div>

        {/* Product listing container */}
        {productsList.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-12 text-center text-slate-400">
            <ShoppingBag className="h-12 w-12 mx-auto text-slate-600 mb-4" />
            <h3 className="font-bold text-sm text-slate-200">Catalog is Empty</h3>
            <p className="text-xs text-slate-500 mt-1">No products found in database.</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden border border-slate-800 rounded-2xl bg-slate-900/10 shadow-xl">
              <table className="w-full text-left border-collapse text-xs min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-850 bg-slate-900/80 text-slate-300 font-bold uppercase tracking-wider">
                    <th className="p-4 w-28">Product ID</th>
                    <th className="p-4">Brand / Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 w-20">Rating</th>
                    <th className="p-4 w-28">Score</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Original Price</th>
                    <th className="p-4 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 bg-slate-950/60">
                  {productsList.map((product: any) => (
                    <tr key={product.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4 text-slate-500 font-mono select-all truncate max-w-[120px]">{product.id}</td>
                      <td className="p-4 font-bold text-white">
                        <div className="font-bold text-white text-xs sm:text-sm">{product.brand} {product.name}</div>
                      </td>
                      <td className="p-4 capitalize text-slate-400 font-medium">{product.categorySlug}</td>
                      <td className="p-4 font-semibold text-slate-300">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-current text-amber-500" /> {product.rating}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          product.score >= 90 ? "text-emerald-400" :
                          product.score >= 80 ? "text-amber-400" : "text-rose-400"
                        }`}>
                          <ShieldCheck className="h-4 w-4" /> {product.score}/100
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-primary text-sm">{formatINR(product.price)}</td>
                      <td className="p-4 text-slate-500 line-through">
                        {product.originalPrice ? formatINR(product.originalPrice) : "-"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <DeleteProductButton id={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="grid gap-4 md:hidden">
              {productsList.map((product: any) => (
                <div key={product.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono select-all block">{product.id}</span>
                      <span className="font-extrabold text-white text-sm block mt-0.5">{product.brand} {product.name}</span>
                      <span className="text-[10px] capitalize text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded-full inline-block mt-1">{product.categorySlug}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-extrabold text-primary">{formatINR(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-slate-500 line-through">{formatINR(product.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-[11px] pt-3 border-t border-slate-800/60">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 font-semibold text-slate-300">
                        <Star className="h-3 w-3 fill-current text-amber-500" /> {product.rating}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" /> {product.score}/100
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex h-8 px-3 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                        title="Edit Product"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={product.id} />
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

