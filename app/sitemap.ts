import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity.client";
import seedData from "../data/seed-data.json";

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
  ];

  try {
    const projectId = client.config().projectId;
    if (!projectId || projectId === "placeholder-id") {
      throw new Error("Sanity Project ID is not configured.");
    }
    
    // Fetch all posts from Sanity to list in the sitemap
    const posts: Array<{ postType: string; slug: string; updatedAt?: string; publishedAt: string }> =
      await client.fetch(`
        *[_type == "post"] {
          postType,
          "slug": slug.current,
          publishedAt,
          updatedAt
        }
      `);

    const dynamicPaths = posts.map((post) => ({
      url: `${baseUrl}/${post.postType}/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
      changeFrequency: "weekly" as const,
      priority: post.postType === "roundup" ? 0.9 : 0.8,
    }));

    return [...staticPaths, ...dynamicPaths];
  } catch (error) {
    console.warn("Failed to generate dynamic sitemap from Sanity. Falling back to seed data:", (error as Error).message);
    
    const dynamicPaths = seedData
      .filter((d: any) => d._type === "post")
      .map((post: any) => ({
        url: `${baseUrl}/${post.postType}/${post.slug.current}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
        changeFrequency: "weekly" as const,
        priority: post.postType === "roundup" ? 0.9 : 0.8,
      }));

    return [...staticPaths, ...dynamicPaths];
  }
}
