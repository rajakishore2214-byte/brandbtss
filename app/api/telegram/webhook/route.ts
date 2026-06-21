import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseProductFromText, generateProductReview } from "@/lib/ai";

// Helper to reply back to the Telegram chat
async function sendReply(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
    
    if (!res.ok) {
      console.error("Failed to send reply to Telegram:", await res.text());
    }
  } catch (err) {
    console.error("Error sending reply to Telegram:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Telegram webhook posts updates
    const message = body?.message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat?.id;
    const text = (message.text || "").trim();
    
    if (!chatId || !text) {
      return NextResponse.json({ ok: true });
    }

    // Verify authorized user
    const adminChatId = process.env.TELEGRAM_CHAT_ID;
    if (adminChatId && String(chatId) !== String(adminChatId)) {
      await sendReply(chatId, "🚫 <b>Unauthorized:</b> You do not have permissions to command this bot.");
      return NextResponse.json({ ok: true });
    }

    // Command Parser
    const command = text.split(" ")[0].toLowerCase();

    // 1. Status / Start Command
    if (command === "/start" || command === "/status") {
      const productCount = await db.product.count();
      const articleCount = await db.article.count();
      const draftCount = await db.article.count({ where: { status: "draft" } });
      const webhookStatus = "Active ✅";
      
      const replyText = `🤖 <b>BrandBTSS Assistant Status</b>\n\n` +
        `📦 <b>Total Products:</b> ${productCount}\n` +
        `📄 <b>Total Articles:</b> ${articleCount} (${draftCount} drafts)\n` +
        `🔌 <b>Webhook Status:</b> ${webhookStatus}\n\n` +
        `💡 <b>Commands:</b>\n` +
        `• <code>/products</code> - List recent products\n` +
        `• <code>/generate [productId]</code> - Generate review draft\n` +
        `• <code>/addproduct [text]</code> - Extract product & generate review\n` +
        `• Or paste raw notes directly!`;
        
      await sendReply(chatId, replyText);
      return NextResponse.json({ ok: true });
    }

    // 2. Products List Command
    if (command === "/products") {
      const products = await db.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, price: true }
      });
      
      if (products.length === 0) {
        await sendReply(chatId, "📦 No products found in database.");
        return NextResponse.json({ ok: true });
      }
      
      const list = products
        .map((p, idx) => `${idx + 1}. <b>${p.name}</b> (ID: <code>${p.id}</code>) - ₹${p.price}`)
        .join("\n\n");
        
      await sendReply(chatId, `📦 <b>Recent Products (Last 5):</b>\n\n${list}`);
      return NextResponse.json({ ok: true });
    }

    // 3. Manual Generate Command
    if (command === "/generate") {
      const targetProductId = text.substring(9).trim();
      if (!targetProductId) {
        await sendReply(chatId, "⚠️ Please provide a product ID. Example: <code>/generate philips-airfryer</code>");
        return NextResponse.json({ ok: true });
      }

      await sendReply(chatId, `✍️ Generating review draft for product <code>${targetProductId}</code>...`);
      
      try {
        const article = await generateProductReview(targetProductId);
        await sendReply(chatId, `✅ <b>Success!</b> Review draft generated:\n\n<b>Title:</b> ${article.title}\n<b>Slug:</b> ${article.slug}`);
      } catch (err: any) {
        await sendReply(chatId, `❌ <b>Error:</b> ${err.message}`);
      }
      return NextResponse.json({ ok: true });
    }

    // 4. Ingest and Add Product Command (Or general text payload)
    let rawPayload = text;
    if (command === "/addproduct") {
      rawPayload = text.substring(11).trim();
    }

    if (!rawPayload) {
      await sendReply(chatId, "⚠️ Please specify product notes or specs to extract.");
      return NextResponse.json({ ok: true });
    }

    await sendReply(chatId, "🔍 Ingesting product notes via Gemini AI parser...");

    try {
      const parsedProduct = await parseProductFromText(rawPayload);
      
      // Auto-create category if missing
      let category = await db.category.findUnique({
        where: { slug: parsedProduct.categorySlug }
      });
      
      if (!category) {
        category = await db.category.create({
          data: {
            slug: parsedProduct.categorySlug,
            name: parsedProduct.categorySlug
              .split("-")
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" "),
            description: `Automated category for ${parsedProduct.categorySlug}`,
            image: "/images/category-placeholder.png",
            seoTitle: `Best ${parsedProduct.categorySlug} Reviews`,
            seoDescription: `Find reviews and ratings for ${parsedProduct.categorySlug}.`
          }
        });
      }

      const featuresStr = JSON.stringify(parsedProduct.features || []);
      const prosStr = JSON.stringify(parsedProduct.pros || []);
      const consStr = JSON.stringify(parsedProduct.cons || []);
      const specsStr = JSON.stringify(parsedProduct.specs || {});
      const affiliateUrlsStr = JSON.stringify(parsedProduct.affiliateUrls || []);

      const product = await db.product.upsert({
        where: { id: parsedProduct.id },
        create: {
          id: parsedProduct.id,
          name: parsedProduct.name,
          brand: parsedProduct.brand,
          categorySlug: parsedProduct.categorySlug,
          price: parsedProduct.price,
          originalPrice: parsedProduct.originalPrice,
          rating: parsedProduct.rating || 4.5,
          image: parsedProduct.image || "/images/product-placeholder.png",
          description: parsedProduct.description || "",
          features: featuresStr,
          pros: prosStr,
          cons: consStr,
          specs: specsStr,
          affiliateUrls: affiliateUrlsStr,
          keywords: parsedProduct.keywords,
          primaryKeyword: parsedProduct.primaryKeyword,
          secondaryKeywords: parsedProduct.secondaryKeywords
        } as any,
        update: {
          name: parsedProduct.name,
          brand: parsedProduct.brand,
          categorySlug: parsedProduct.categorySlug,
          price: parsedProduct.price,
          originalPrice: parsedProduct.originalPrice,
          rating: parsedProduct.rating || 4.5,
          image: parsedProduct.image || "/images/product-placeholder.png",
          description: parsedProduct.description || "",
          features: featuresStr,
          pros: prosStr,
          cons: consStr,
          specs: specsStr,
          affiliateUrls: affiliateUrlsStr,
          keywords: parsedProduct.keywords,
          primaryKeyword: parsedProduct.primaryKeyword,
          secondaryKeywords: parsedProduct.secondaryKeywords
        } as any
      });

      await sendReply(chatId, `📦 <b>Product Ingested & Saved!</b>\n<b>ID:</b> <code>${product.id}</code>\n<b>Name:</b> ${product.name}\n\n✍️ Triggering AI review generation...`);

      // Trigger automatic review article draft generation
      const article = await generateProductReview(product.id);

      await sendReply(chatId, `✅ <b>Success!</b> Review draft generated:\n<b>Title:</b> ${article.title}\n<b>Slug:</b> ${article.slug}`);

    } catch (err: any) {
      console.error(err);
      await sendReply(chatId, `❌ <b>Ingestion Failed:</b> ${err.message}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
