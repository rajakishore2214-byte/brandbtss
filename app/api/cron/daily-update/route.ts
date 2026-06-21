import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendTelegramMessage } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Authenticate cron trigger (optional but recommended in production)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Scan for products lacking review articles
    const products = (await db.product.findMany({
      select: { id: true, name: true, keywords: true } as any
    })) as any[];
    
    const articles = await db.article.findMany({
      where: { type: "review" },
      select: { productIds: true }
    });

    const productsWithoutReview = products.filter(p => {
      const hasReview = articles.some(a => {
        try {
          const ids = JSON.parse(a.productIds || "[]") as string[];
          return ids.includes(p.id);
        } catch {
          return false;
        }
      });
      return !hasReview;
    });

    // 2. Scan for articles updated over 90 days ago
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const outdatedArticles = await db.article.findMany({
      where: {
        updatedAt: { lt: ninetyDaysAgo },
        status: "published"
      },
      select: { title: true, slug: true, updatedAt: true }
    });

    // 3. Scan for products/articles missing keywords
    const productsWithoutKeywords = products.filter(p => !p.keywords || p.keywords.trim() === "");

    // 4. Build report message
    let message = `📅 <b>BrandBTSS Daily SEO Audit Report</b>\n\n`;

    if (productsWithoutReview.length > 0) {
      message += `⚠️ <b>Products Lacking Reviews (${productsWithoutReview.length}):</b>\n`;
      productsWithoutReview.slice(0, 5).forEach(p => {
        message += `• <b>${p.name}</b> (ID: <code>${p.id}</code>)\n`;
      });
      if (productsWithoutReview.length > 5) {
        message += `<i>...and ${productsWithoutReview.length - 5} more.</i>\n`;
      }
      message += `\n`;
    } else {
      message += `✅ All products have review articles!\n\n`;
    }

    if (outdatedArticles.length > 0) {
      message += `⏳ <b>Outdated Articles (>90 days) (${outdatedArticles.length}):</b>\n`;
      outdatedArticles.slice(0, 5).forEach(a => {
        message += `• <b>${a.title}</b> (Last updated: ${new Date(a.updatedAt).toLocaleDateString()})\n`;
      });
      if (outdatedArticles.length > 5) {
        message += `<i>...and ${outdatedArticles.length - 5} more.</i>\n`;
      }
      message += `\n`;
    } else {
      message += `✅ All published articles are recently updated!\n\n`;
    }

    if (productsWithoutKeywords.length > 0) {
      message += `🔍 <b>Products Lacking Keywords (${productsWithoutKeywords.length}):</b>\n`;
      productsWithoutKeywords.slice(0, 5).forEach(p => {
        message += `• <b>${p.name}</b> (ID: <code>${p.id}</code>)\n`;
      });
      if (productsWithoutKeywords.length > 5) {
        message += `<i>...and ${productsWithoutKeywords.length - 5} more.</i>\n`;
      }
      message += `\n`;
    }

    message += `<i>Tip: Run <code>/generate [productId]</code> in Telegram to auto-create missing review drafts!</i>`;

    // Send Telegram Notification
    await sendTelegramMessage(message);

    return NextResponse.json({
      success: true,
      stats: {
        productsWithoutReview: productsWithoutReview.length,
        outdatedArticles: outdatedArticles.length,
        productsWithoutKeywords: productsWithoutKeywords.length
      }
    });

  } catch (err: any) {
    console.error("Cron audit failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
