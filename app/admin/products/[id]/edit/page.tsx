import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Save, Edit } from "lucide-react";
import { updateProduct } from "@/app/admin/actions";
import { db } from "@/lib/db";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch product to edit
  const product = await db.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  // Fetch categories to show in dropdown
  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  });

  // Helper parsing formats
  const featuresRaw = (JSON.parse(product.features) as string[]).join("\n");
  const prosRaw = (JSON.parse(product.pros) as string[]).join("\n");
  const consRaw = (JSON.parse(product.cons) as string[]).join("\n");
  
  const specsRaw = Object.entries(JSON.parse(product.specs) as Record<string, string>)
    .map(([key, val]) => `${key} = ${val}`)
    .join("\n");

  const affiliateUrlsList = JSON.parse(product.affiliateUrls) as {
    network: string;
    url: string;
    price?: number;
  }[];
  const affiliateUrlsRaw = affiliateUrlsList
    .map((aff) => `${aff.network} | ${aff.url} | ${aff.price || ""}`)
    .join("\n");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <div>
          <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
        </div>

        {/* Title */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Edit className="h-6 w-6 text-primary" /> Edit Product: {product.brand} {product.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">Modify product details, prices, and affiliate networks</p>
        </div>

        {/* Form */}
        <form action={updateProduct} className="space-y-6 bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
          
          {/* Read-only ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Product ID (ReadOnly ID)</label>
            <input
              type="text"
              name="id"
              value={product.id}
              readOnly
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm text-slate-450 focus:outline-none select-all"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={product.name}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <label htmlFor="brand" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Brand Name</label>
              <input
                type="text"
                id="brand"
                name="brand"
                defaultValue={product.brand}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Category */}
            <div className="space-y-1.5">
              <label htmlFor="categorySlug" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Main Category</label>
              <select
                id="categorySlug"
                name="categorySlug"
                defaultValue={product.categorySlug}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name} ({cat.slug})
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div className="space-y-1.5">
              <label htmlFor="subcategorySlug" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Sub-Category (Optional Slug)</label>
              <input
                type="text"
                id="subcategorySlug"
                name="subcategorySlug"
                defaultValue={product.subcategorySlug || ""}
                placeholder="e.g. air-fryers"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Deal Tag */}
            <div className="space-y-1.5">
              <label htmlFor="dealTag" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Deal/Offer Tag (Optional)</label>
              <input
                type="text"
                id="dealTag"
                name="dealTag"
                defaultValue={product.dealTag || ""}
                placeholder="e.g. Save 45% or Best Seller"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Specs Score */}
            <div className="space-y-1.5">
              <label htmlFor="score" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Specs Score (1-100)</label>
              <input
                type="number"
                id="score"
                name="score"
                min="1"
                max="100"
                defaultValue={product.score}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Price */}
            <div className="space-y-1.5">
              <label htmlFor="price" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Deal Price (INR)</label>
              <input
                type="number"
                id="price"
                name="price"
                defaultValue={product.price}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Original Price */}
            <div className="space-y-1.5">
              <label htmlFor="originalPrice" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Original Price (Optional INR)</label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                defaultValue={product.originalPrice || ""}
                placeholder="e.g. 8999"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <label htmlFor="rating" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Rating (0-5 Stars)</label>
              <input
                type="number"
                step="0.1"
                id="rating"
                name="rating"
                min="0"
                max="5"
                defaultValue={product.rating}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Featured */}
            <div className="space-y-1.5">
              <label htmlFor="featured" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Featured Product</label>
              <select
                id="featured"
                name="featured"
                defaultValue={product.featured ? "true" : "false"}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              >
                <option value="false">No (Standard Catalog)</option>
                <option value="true">Yes (Showcase on Homepage)</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label htmlFor="status" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Catalog Status</label>
              <select
                id="status"
                name="status"
                defaultValue={product.status}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              >
                <option value="active">Active (Visible)</option>
                <option value="archived">Archived (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-1.5">
            <label htmlFor="image" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              defaultValue={product.image}
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Product Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              defaultValue={product.description}
              placeholder="Provide a detailed description of the product..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-sans"
            />
          </div>

          {/* Features */}
          <div className="space-y-1.5">
            <label htmlFor="features" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Key Features (One Per Line)</label>
            <textarea
              id="features"
              name="features"
              rows={4}
              defaultValue={featuresRaw}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-mono text-xs"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Pros */}
            <div className="space-y-1.5">
              <label htmlFor="pros" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Pros (One Per Line)</label>
              <textarea
                id="pros"
                name="pros"
                rows={4}
                defaultValue={prosRaw}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-mono text-xs"
              />
            </div>

            {/* Cons */}
            <div className="space-y-1.5">
              <label htmlFor="cons" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Cons (One Per Line)</label>
              <textarea
                id="cons"
                name="cons"
                rows={4}
                defaultValue={consRaw}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-mono text-xs"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-1.5">
            <label htmlFor="specs" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Specifications (Key=Value format, One Per Line)</label>
            <textarea
              id="specs"
              name="specs"
              rows={5}
              defaultValue={specsRaw}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-mono text-xs"
            />
          </div>

          {/* Affiliate URLs */}
          <div className="space-y-1.5">
            <label htmlFor="affiliateUrls" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Affiliate Merchant Links (Format: Network | URL | Price, One Per Line)</label>
            <textarea
              id="affiliateUrls"
              name="affiliateUrls"
              rows={4}
              defaultValue={affiliateUrlsRaw}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-mono text-xs"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover py-3 text-center text-sm font-black text-primary-text hover:shadow-lg hover:shadow-primary/10 active:scale-98 transition-all"
            >
              <Save className="h-4.5 w-4.5" /> Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
