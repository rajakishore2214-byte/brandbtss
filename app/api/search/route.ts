import { NextRequest, NextResponse } from "next/server";
import { db, mapDbProduct, mapDbArticle } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";

  if (q.length < 2) {
    return NextResponse.json({ products: [], articles: [] });
  }

  try {
    // Find products matching the query (case-insensitive contains is native in SQLite)
    const dbProducts = await db.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { brand: { contains: q } },
          { categorySlug: { contains: q } }
        ]
      },
      take: 4
    });
    const products = dbProducts.map(mapDbProduct);

    // Find articles matching the query
    const dbArticles = await db.article.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { categorySlug: { contains: q } }
        ]
      },
      take: 4
    });
    const articles = dbArticles.map(mapDbArticle);

    return NextResponse.json({ products, articles });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 });
  }
}
