import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, ShieldCheck, Star } from "lucide-react";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export default async function AdminProductsDashboard() {
  // Fetch products from database
  const productsList = await db.product.findMany({
    orderBy: { brand: "asc" }
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
            <ShoppingBag className="h-6 w-6 text-primary" /> Product Catalog Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage product specifications, review scores, and merchant details</p>
        </div>

        {/* Product rows table */}
        {productsList.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-12 text-center text-slate-400">
            <ShoppingBag className="h-12 w-12 mx-auto text-slate-600 mb-4" />
            <h3 className="font-bold text-sm text-slate-200">Catalog is Empty</h3>
            <p className="text-xs text-slate-500 mt-1">No products found in database.</p>
          </div>
        ) : (
          <div className="overflow-hidden border border-slate-800 rounded-2xl bg-slate-900/10 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-900/80 text-slate-300 font-bold uppercase tracking-wider">
                  <th className="p-4">Product ID</th>
                  <th className="p-4">Brand / Name</th>
                  <th className="p-4">Category Slug</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Specs Score</th>
                  <th className="p-4">Current Price</th>
                  <th className="p-4">Original Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 bg-slate-950/60">
                {productsList.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="p-4 text-slate-500 font-mono select-all">{product.id}</td>
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
