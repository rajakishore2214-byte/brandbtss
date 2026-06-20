import { PrismaClient, Product as DbProduct, Category as DbCategory, Comparison as DbComparison, Article as DbArticle } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Mapping interfaces
export interface AffiliateUrl {
  network: string;
  url: string;
  price?: number;
}

export function mapDbProduct(p: DbProduct) {
  let affs: AffiliateUrl[] = [];
  try { affs = JSON.parse(p.affiliateUrls); } catch (e) { affs = []; }
  
  const defaultAff = affs[0] || { network: "Amazon", url: "#" };
  const affiliateUrl = `/api/redirect?productId=${p.id}&network=${encodeURIComponent(defaultAff.network)}&url=${encodeURIComponent(defaultAff.url)}`;

  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.categorySlug,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    rating: p.rating,
    image: p.image,
    affiliateUrl, // Auto click-tracking redirect URL
    description: p.description,
    features: JSON.parse(p.features) as string[],
    pros: JSON.parse(p.pros) as string[],
    cons: JSON.parse(p.cons) as string[],
    specs: JSON.parse(p.specs) as Record<string, string>,
    dealTag: p.dealTag ?? undefined,
    score: p.score,
    affiliateUrlsParsed: affs
  };
}

export function mapDbCategory(c: DbCategory) {
  return {
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
    seoTitle: c.seoTitle,
    seoDescription: c.seoDescription,
    parentSlug: c.parentSlug ?? undefined
  };
}

export function mapDbComparison(comp: DbComparison) {
  return {
    slug: comp.slug,
    title: comp.title,
    productAId: comp.productAId,
    productBId: comp.productBId,
    introduction: comp.introduction,
    featureBreakdown: JSON.parse(comp.featureBreakdown) as {
      feature: string;
      productAValue: string;
      productBValue: string;
      winner: "A" | "B" | "Tie";
    }[],
    verdict: comp.verdict,
    seoTitle: comp.seoTitle,
    seoDescription: comp.seoDescription
  };
}

export function mapDbArticle(art: DbArticle) {
  return {
    id: art.id,
    slug: art.slug,
    type: art.type as "best" | "review" | "blog",
    title: art.title,
    description: art.description,
    category: art.categorySlug,
    date: art.date,
    author: art.author,
    image: art.image,
    introduction: art.introduction,
    quickRecommendation: art.quickRecommendation ? JSON.parse(art.quickRecommendation) as {
      overallPickId: string;
      budgetPickId: string;
      premiumPickId: string;
      summary: string;
    } : undefined,
    topPicks: art.topPicks ? JSON.parse(art.topPicks) as {
      productId: string;
      tag: string;
      awardReason: string;
    }[] : undefined,
    productIds: art.productIds ? JSON.parse(art.productIds) as string[] : undefined,
    buyingGuide: art.buyingGuide ? JSON.parse(art.buyingGuide) as {
      title: string;
      content: string;
    }[] : undefined,
    faqs: art.faqs ? JSON.parse(art.faqs) as {
      question: string;
      answer: string;
    }[] : undefined,
    verdict: art.verdict ?? undefined,
    rating: art.rating ?? undefined,
    seoTitle: art.seoTitle,
    seoDescription: art.seoDescription,
    status: art.status
  };
}

