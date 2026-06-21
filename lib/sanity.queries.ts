import { client } from "./sanity.client";
import seedData from "../data/seed-data.json";

// Query to get all post slugs and post types for generateStaticParams
export const getAllPostSlugsQuery = `
  *[_type == "post"] {
    postType,
    "slug": slug.current
  }
`;

// Query to get a single post by slug
export const getPostBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    postType,
    excerpt,
    mainImage,
    body,
    author->,
    publishedAt,
    updatedAt,
    seoTitle,
    seoDescription,
    featuredTools[]->
  }
`;

// Query for homepage listing (recent posts)
export const getRecentPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) [0...10] {
    title,
    "slug": slug.current,
    postType,
    excerpt,
    mainImage,
    publishedAt,
    updatedAt,
    author->
  }
`;

// Query to get posts by specific slugs (for curated homepage features)
export const getPostsBySlugsQuery = `
  *[_type == "post" && slug.current in $slugs] {
    title,
    "slug": slug.current,
    postType,
    excerpt,
    mainImage,
    publishedAt,
    updatedAt,
    author->
  }
`;

// Helper types for the frontend typescript code
export interface SanityAuthor {
  name: string;
  photo?: any;
  bio?: string;
  credentials?: string;
}

export interface SanityProductCard {
  _id: string;
  name: string;
  logo?: any;
  tagline?: string;
  rating?: number;
  pros?: string[];
  cons?: string[];
  priceText?: string;
  affiliateSlug: string;
  ctaText?: string;
}

export interface SanityComparisonTable {
  title?: string;
  rows?: Array<{
    toolName: string;
    bestFor?: string;
    startingPrice?: string;
    rating?: number;
    affiliateSlug: string;
  }>;
}

export interface SanityVerdictBox {
  winnerName: string;
  summary: string;
  affiliateSlug: string;
}

export interface SanityPost {
  title: string;
  slug: string;
  postType: "roundup" | "review";
  excerpt: string;
  mainImage: any;
  body: any[];
  author?: SanityAuthor;
  publishedAt: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  featuredTools?: SanityProductCard[];
}

// Fallback resolver for local seed data
// Fallback image helper based on post slug
function getFallbackPostMainImage(slug: string): string {
  if (slug === "best-home-kitchen-amazon") {
    return "/images/home_kitchen_roundup.png";
  }
  if (slug === "best-electronics-gadgets-amazon") {
    return "/images/electronics_roundup.png";
  }
  if (slug === "best-clothing-accessories-amazon") {
    return "/images/clothing_roundup.png";
  }
  if (slug === "best-smart-home-appliances") {
    return "/images/smart_home_roundup.png";
  }
  return "/images/web_hosting.png";
}

// Fallback image helper for product cards based on name & slug
function getFallbackProductImage(name: string, affiliateSlug: string): string {
  const n = name.toLowerCase();
  const s = (affiliateSlug || "").toLowerCase();
  
  if (n.includes("organizer") || s.includes("organizer")) {
    return "/images/kitchen_organizer.png";
  }
  if (n.includes("cookware") || n.includes("pan") || n.includes("pot") || s.includes("cookware")) {
    return "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600";
  }
  if (n.includes("airfryer") || n.includes("air fryer") || s.includes("airfryer")) {
    return "/images/philips_airfryer.png";
  }
  if (n.includes("storage") || n.includes("container") || s.includes("storage")) {
    return "https://images.unsplash.com/photo-1595348020910-87cfdae90e3f?auto=format&fit=crop&q=80&w=600";
  }
  if (n.includes("watch") || n.includes("tracker") || n.includes("band") || s.includes("watch") || s.includes("tracker")) {
    return "/images/samsung_watch.png";
  }
  if (n.includes("speaker") || s.includes("speaker")) {
    return "/images/jbl_speaker.png";
  }
  if (n.includes("earbud") || n.includes("headphone") || n.includes("tws") || s.includes("earbud") || s.includes("headphone")) {
    return "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600";
  }
  if (n.includes("charge") || n.includes("power bank") || s.includes("charge") || s.includes("power")) {
    return "https://images.unsplash.com/photo-1609592424089-9a7cd118ba82?auto=format&fit=crop&q=80&w=600";
  }
  if (n.includes("tee") || n.includes("shirt") || n.includes("clothing") || n.includes("jacket") || n.includes("jogger") || n.includes("belt") || n.includes("wallet") || n.includes("bag") || n.includes("boot") || n.includes("sunglasses") || s.includes("clothing") || s.includes("wear")) {
    return "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600";
  }
  if (s.includes("bonsai")) {
    return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600";
  }
  return "/images/web_hosting.png";
}

// Fallback resolver for local seed data
function getFallbackPost(slug: string): SanityPost | null {
  const rawPost = seedData.find(
    (d: any) => d._type === "post" && d.slug?.current === slug
  ) as any;
  
  if (!rawPost) return null;

  // Resolve author reference if possible
  let resolvedAuthor: SanityAuthor | undefined = undefined;
  if (rawPost.author && rawPost.author._ref) {
    const rawAuthor = seedData.find(
      (d: any) => d._type === "author" && d._id === rawPost.author._ref
    ) as any;
    if (rawAuthor) {
      resolvedAuthor = {
        name: rawAuthor.name || "Anonymous",
        bio: rawAuthor.bio,
        credentials: rawAuthor.credentials,
        photo: rawAuthor.photo || "/images/author-jane.png",
      };
    }
  }

  // Resolve featuredTools references if possible
  let resolvedTools: SanityProductCard[] | undefined = undefined;
  if (rawPost.featuredTools) {
    resolvedTools = rawPost.featuredTools
      .map((ref: any) => {
        const rawTool = seedData.find(
          (d: any) => d._type === "productCard" && d._id === ref._ref
        ) as any;
        return rawTool
          ? {
              _id: rawTool._id,
              name: rawTool.name || "Unnamed Tool",
              logo: rawTool.logo || getFallbackProductImage(rawTool.name || "", rawTool.affiliateSlug || ""),
              tagline: rawTool.tagline,
              rating: rawTool.rating,
              pros: rawTool.pros,
              cons: rawTool.cons,
              priceText: rawTool.priceText,
              affiliateSlug: rawTool.affiliateSlug || "",
              ctaText: rawTool.ctaText,
            }
          : null;
      })
      .filter(Boolean) as SanityProductCard[];
  }

  // Inject fallback images into block content productCard types
  const resolvedBody = rawPost.body
    ? rawPost.body.map((block: any) => {
        if (block._type === "productCard") {
          return {
            ...block,
            logo: block.logo || getFallbackProductImage(block.name || "", block.affiliateSlug || ""),
          };
        }
        return block;
      })
    : [];

  return {
    title: rawPost.title,
    slug: rawPost.slug.current,
    postType: rawPost.postType,
    excerpt: rawPost.excerpt,
    mainImage: rawPost.mainImage || getFallbackPostMainImage(slug),
    body: resolvedBody,
    author: resolvedAuthor,
    publishedAt: rawPost.publishedAt,
    updatedAt: rawPost.updatedAt,
    seoTitle: rawPost.seoTitle,
    seoDescription: rawPost.seoDescription,
    featuredTools: resolvedTools,
  };
}

// Fetch helper functions with automated local fallback
export async function getAllPostsSlugs(): Promise<Array<{ postType: string; slug: string }>> {
  try {
    const projectId = client.config().projectId;
    if (!projectId || projectId === "placeholder-id") {
      throw new Error("Sanity Project ID is not configured.");
    }
    return await client.fetch(getAllPostSlugsQuery);
  } catch (error) {
    console.warn("Falling back to local seed data for slugs:", (error as Error).message);
    return seedData
      .filter((d: any) => d._type === "post")
      .map((p: any) => ({
        postType: p.postType,
        slug: p.slug.current,
      }));
  }
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  try {
    const projectId = client.config().projectId;
    if (!projectId || projectId === "placeholder-id") {
      throw new Error("Sanity Project ID is not configured.");
    }
    const result = await client.fetch(getPostBySlugQuery, { slug });
    if (!result) throw new Error(`Post not found in Sanity: ${slug}`);
    return result;
  } catch (error) {
    console.warn(`Falling back to local seed data for post "${slug}":`, (error as Error).message);
    return getFallbackPost(slug);
  }
}

export async function getRecentPosts(): Promise<SanityPost[]> {
  try {
    const projectId = client.config().projectId;
    if (!projectId || projectId === "placeholder-id") {
      throw new Error("Sanity Project ID is not configured.");
    }
    return await client.fetch(getRecentPostsQuery);
  } catch (error) {
    console.warn("Falling back to local seed data for recent posts:", (error as Error).message);
    return seedData
      .filter((d: any) => d._type === "post")
      .map((p: any) => getFallbackPost(p.slug.current))
      .filter(Boolean) as SanityPost[];
  }
}

export async function getPostsBySlugs(slugs: string[]): Promise<SanityPost[]> {
  try {
    const projectId = client.config().projectId;
    if (!projectId || projectId === "placeholder-id") {
      throw new Error("Sanity Project ID is not configured.");
    }
    return await client.fetch(getPostsBySlugsQuery, { slugs });
  } catch (error) {
    console.warn("Falling back to local seed data for curated slugs:", (error as Error).message);
    return slugs
      .map((s) => getFallbackPost(s))
      .filter(Boolean) as SanityPost[];
  }
}
