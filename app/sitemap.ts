import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://brandbtss.com";

  // 1. Static Pages
  const staticPaths = [
    "",
    "/deals",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/affiliate-disclosure",
    "/admin", // Admin dashboard (will be blocked in robots.txt anyway)
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: path === "" ? 1.0 : 0.7,
  }));

  try {
    // 2. Dynamic Categories
    const categories = await db.category.findMany();
    const categoryPaths = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // 3. Dynamic Products Specs Pages
    const products = await db.product.findMany();
    const productPaths = products.map((prod) => ({
      url: `${baseUrl}/product/${prod.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

    // 4. Dynamic Listicles & Buying Guides
    const articles = await db.article.findMany();
    const bestProductPaths = articles
      .filter((a) => a.type === "best")
      .map((art) => ({
        url: `${baseUrl}/best-products/${art.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));

    // 5. Dynamic Single Reviews
    const reviewPaths = articles
      .filter((a) => a.type === "review")
      .map((art) => {
        let pIds: string[] = [];
        try { pIds = JSON.parse(art.productIds || "[]"); } catch (e) { pIds = []; }
        return {
          url: `${baseUrl}/reviews/${pIds[0] || "product"}-review`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      });

    // 6. Dynamic Comparisons
    const comparisons = await db.comparison.findMany();
    const comparisonPaths = comparisons.map((comp) => ({
      url: `${baseUrl}/comparisons/${comp.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [
      ...staticPaths,
      ...categoryPaths,
      ...productPaths,
      ...bestProductPaths,
      ...reviewPaths,
      ...comparisonPaths,
    ];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
    // Fallback to static paths only
    return staticPaths;
  }
}
