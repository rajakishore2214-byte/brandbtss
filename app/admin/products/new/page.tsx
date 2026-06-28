import React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { createProduct } from "@/app/admin/actions";
import { db } from "@/lib/db";
import ImageUploadInput from "@/components/ImageUploadInput";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  // Fetch categories to show in dropdown
  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="admin-dark min-h-screen py-8 px-4 sm:px-6 lg:px-8">
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
            <Plus className="h-6 w-6 text-primary" /> Add New Product
          </h1>
          <p className="text-xs text-slate-400 mt-1">Create a new product card with pricing, keywords, and affiliate shortlinks</p>
        </div>

        {/* Form */}
        <form action={createProduct} className="space-y-6 bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* ID */}
            <div className="space-y-1.5">
              <label htmlFor="id" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Product ID (Unique Slug)</label>
              <input
                type="text"
                id="id"
                name="id"
                placeholder="e.g. philips-airfryer-hd9252"
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-500 block">Use lowercase letters and dashes only. No spaces.</span>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Essential Digital Air Fryer"
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Brand */}
            <div className="space-y-1.5">
              <label htmlFor="brand" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Brand Name</label>
              <input
                type="text"
                id="brand"
                name="brand"
                placeholder="e.g. Philips"
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label htmlFor="categorySlug" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Main Category</label>
              <select
                id="categorySlug"
                name="categorySlug"
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Subcategory */}
            <div className="space-y-1.5">
              <label htmlFor="subcategorySlug" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Sub-Category (Optional Slug)</label>
              <input
                type="text"
                id="subcategorySlug"
                name="subcategorySlug"
                placeholder="e.g. air-fryers"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Deal Tag */}
            <div className="space-y-1.5">
              <label htmlFor="dealTag" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Deal/Offer Tag (Optional)</label>
              <input
                type="text"
                id="dealTag"
                name="dealTag"
                placeholder="e.g. Save 45% or Best Seller"
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
                placeholder="e.g. 4999"
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
                placeholder="e.g. 8999"
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
                placeholder="e.g. 92"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
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
                placeholder="e.g. 4.6"
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Featured */}
            <div className="space-y-1.5">
              <label htmlFor="featured" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Featured Product</label>
              <select
                id="featured"
                name="featured"
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
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              >
                <option value="active">Active (Visible)</option>
                <option value="archived">Archived (Hidden)</option>
              </select>
            </div>
          </div>

          {/* SEO Keywords Upgrade */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-4">
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest border-b border-slate-800 pb-2">SEO Keyword Tuning</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="primaryKeyword" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Primary Keyword</label>
                <input
                  type="text"
                  id="primaryKeyword"
                  name="primaryKeyword"
                  placeholder="e.g. best air fryer in India"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="secondaryKeywords" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Secondary Keywords (Comma Separated)</label>
                <input
                  type="text"
                  id="secondaryKeywords"
                  name="secondaryKeywords"
                  placeholder="e.g. digital airfryer, healthy frying, oil free snacks"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="keywords" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">General Meta Keywords (Comma Separated)</label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                placeholder="e.g. philips, airfryer, kitchen, healthy, buy online"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Unified Image Upload component */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Product Image</span>
            <ImageUploadInput name="image" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Product Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              placeholder="Provide a detailed description of the product and testing summary..."
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
              placeholder="4.1 Liters Capacity&#10;7 touch presets&#10;90% less oil consumption"
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
                placeholder="Extremely easy to clean&#10;Consistent heating texture"
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
                placeholder="Smaller basket capacity&#10;Beeper sound is loud"
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
              placeholder="Capacity = 4.1 Liters&#10;Power = 1400 Watts&#10;Controls = Digital Touchscreen&#10;Warranty = 2 Years"
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
              placeholder="Amazon | https://link.amazon/A03V0DFKE | 4999&#10;Flipkart | https://fktr.in/0TLcJu7 | 5100"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-primary px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-y font-mono text-xs"
            />
            <span className="text-[10px] text-slate-500 block">Provide the Merchant/Network name, followed by your redirect/referral URL, and the price at that shop. Separate each with a pipe `|` symbol.</span>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover py-3 text-center text-sm font-black text-primary-text hover:shadow-lg hover:shadow-primary/10 active:scale-98 transition-all"
            >
              <Save className="h-4.5 w-4.5" /> Save Product
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

