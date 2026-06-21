import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://brandbtss.com";

  // Static Paths
  const staticPaths = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  try {
    // 1. Fetch categories
    const categories = await db.category.findMany({
      select: { slug: true, updatedAt: true }
    });
    const categoryPaths = categories.map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // 2. Fetch products
    const products = await db.product.findMany({
      where: { status: "active" },
      select: { id: true, updatedAt: true }
    });
    const productPaths = products.map((p) => ({
      url: `${baseUrl}/product/${p.id}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // 3. Fetch articles (filtered to published)
    const articles = await db.article.findMany({
      where: { status: "published" },
      select: { slug: true, type: true, productIds: true, updatedAt: true }
    });
    const articlePaths = articles.map((a) => {
      let path = `/${a.type}/${a.slug}`;
      if (a.type === "best") {
        path = `/best-products/${a.slug}`;
      } else if (a.type === "review") {
        let productId = a.slug;
        if (a.productIds) {
          try {
            const ids = JSON.parse(a.productIds);
            if (Array.isArray(ids) && ids.length > 0) {
              productId = ids[0];
            }
          } catch {}
        }
        path = `/reviews/${productId}-review`;
      } else if (a.type === "blog") {
        path = `/blog/${a.slug}`;
      } else if (a.type === "comparison") {
        path = `/comparisons/${a.slug}`;
      } else if (a.type === "deal") {
        path = `/deals/${a.slug}`;
      }

      return {
        url: `${baseUrl}${path}`,
        lastModified: new Date(a.updatedAt),
        changeFrequency: "weekly" as const,
        priority: a.type === "best" ? 0.9 : 0.8,
      };
    });

    // 4. Fetch Comparisons
    const comparisons = await db.comparison.findMany({
      select: { slug: true, updatedAt: true }
    });
    const comparisonPaths = comparisons.map((comp) => ({
      url: `${baseUrl}/comparisons/${comp.slug}`,
      lastModified: new Date(comp.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticPaths, ...categoryPaths, ...productPaths, ...articlePaths, ...comparisonPaths];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
    return staticPaths;
  }
}
