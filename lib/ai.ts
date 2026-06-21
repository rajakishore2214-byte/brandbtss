import { db } from "./db";

// Helper to slugify titles
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Telegram messaging helper
export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram bot token or Chat ID is missing. Skipping Telegram notification.");
    return false;
  }

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
      console.error("Telegram API Error:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send Telegram message:", err);
    return false;
  }
}

// Extract product from raw unstructured notes (e.g. Notebook LLM, copy-pasted spreadsheets)
export async function parseProductFromText(text: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }

  const prompt = `
You are an expert product catalog ingestion assistant. Extract structured product data from the following raw note or list:

"${text}"

Match the categories and specifications precisely. If some fields are missing, generate reasonable values based on the product. 
Choose a category slug from these known categories or create a clean slug if it fits:
- "kitchen-appliances" (Kitchen & cooking items)
- "electronics" (Computers, audio, accessories)
- "smart-home" (Home automation, security)
- "fitness" (Gym, health trackers)
- "web-services" (Hosting, SaaS tools, software)

Return the details in JSON according to the schema.
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING", description: "Clean URL-friendly identifier/slug, e.g. philips-airfryer-hd9252" },
          name: { type: "STRING", description: "Full descriptive name of the product" },
          brand: { type: "STRING", description: "Brand name" },
          categorySlug: { type: "STRING", description: "Url slug of the category, matching known categories if possible" },
          price: { type: "INTEGER", description: "Current price in INR" },
          originalPrice: { type: "INTEGER", description: "Original/list price in INR if discount is available (optional)" },
          rating: { type: "NUMBER", description: "Average rating out of 5 stars (default to 4.5 if not found)" },
          image: { type: "STRING", description: "Path to product image. Use placeholder URL or matching asset name if mentioned" },
          description: { type: "STRING", description: "Brief promotional tagline or summary" },
          features: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "List of key features (3 to 6 items)"
          },
          pros: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "List of pros/advantages"
          },
          cons: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "List of cons/drawbacks"
          },
          specs: {
            type: "OBJECT",
            description: "Key-value pairs of specs like Capacity, Weight, Power, etc."
          },
          affiliateUrls: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                network: { type: "STRING", description: "e.g. Amazon, Hostinger" },
                url: { type: "STRING", description: "Affiliate destination URL" },
                price: { type: "INTEGER" }
              },
              required: ["network", "url"]
            }
          },
          keywords: { type: "STRING", description: "Comma separated general keywords" },
          primaryKeyword: { type: "STRING", description: "Primary SEO target keyword" },
          secondaryKeywords: { type: "STRING", description: "Comma separated secondary SEO keywords" }
        },
        required: ["id", "name", "brand", "categorySlug", "price", "rating", "description", "features", "pros", "cons", "specs", "affiliateUrls"]
      }
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error parsing text: ${await response.text()}`);
  }

  const result = await response.json();
  const contentText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!contentText) {
    throw new Error("Empty response returned from Gemini API");
  }

  return JSON.parse(contentText);
}

// Generate an article review draft for a product
export async function generateProductReview(productId: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }

  const product = await db.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error(`Product with ID "${productId}" not found in database.`);
  }

  const specsParsed = JSON.parse(product.specs || "{}");
  const specsText = Object.entries(specsParsed)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const prompt = `
You are an expert SEO Content Copywriter. Generate a high-performance, comprehensive affiliate product review for the following product:

Product Name: ${product.name}
Brand: ${product.brand}
Category Slug: ${product.categorySlug}
Price: INR ${product.price}
Specs:
${specsText}

Product Description: ${product.description}
Features: ${product.features}
Pros: ${product.pros}
Cons: ${product.cons}

Ensure the article structure satisfies these rules:
1. Generate an engaging Title and SEO Meta Title (max 60 chars) and Meta Description (120-160 chars).
2. Write a detailed Introduction paragraph highlighting testing conditions and overall value.
3. Write standard Buying Guide Chapters (such as "Design & Build Quality", "Performance Test Results", "Who Is This For?"). Return these chapters in the \`buyingGuide\` field.
4. Prepare 3 FAQs with clear answers.
5. Provide a crisp Final Verdict Statement.
6. Provide an editor star rating (0.0 to 5.0) in the \`rating\` field.
7. Return a custom JSON-LD schema (as stringified JSON) modeling this product review.
8. Output commas-separated general keywords list.

Return the details ONLY as JSON matching the specified schema.
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          seoTitle: { type: "STRING" },
          seoDescription: { type: "STRING" },
          introduction: { type: "STRING" },
          keywords: { type: "STRING" },
          verdict: { type: "STRING" },
          rating: { type: "NUMBER" },
          buyingGuide: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                content: { type: "STRING" }
              },
              required: ["title", "content"]
            }
          },
          faqs: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                answer: { type: "STRING" }
              },
              required: ["question", "answer"]
            }
          },
          schema: { type: "STRING", description: "Stringified JSON-LD product review schema block" }
        },
        required: ["title", "seoTitle", "seoDescription", "introduction", "keywords", "verdict", "rating", "buyingGuide", "faqs", "schema"]
      }
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error generating review: ${await response.text()}`);
  }

  const result = await response.json();
  const contentText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!contentText) {
    throw new Error("Empty response returned from Gemini API");
  }

  const parsed = JSON.parse(contentText);
  
  // Format slug and insert into DB in draft status
  const slug = slugify(parsed.title || `${product.name} review`);
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Save the article draft in database
  const article = await db.article.create({
    data: {
      slug,
      type: "review",
      title: parsed.title,
      description: parsed.seoDescription,
      categorySlug: product.categorySlug,
      date: dateStr,
      author: "BrandBTSS AI Writer",
      image: product.image,
      introduction: parsed.introduction,
      productIds: JSON.stringify([product.id]),
      buyingGuide: JSON.stringify(parsed.buyingGuide),
      faqs: JSON.stringify(parsed.faqs),
      verdict: parsed.verdict,
      rating: parsed.rating || 4.5,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
      status: "draft",
      keywords: parsed.keywords,
      content: "",
      schema: parsed.schema
    } as any
  });

  // Send Telegram Notification
  const notifyText = `✍️ <b>AI Review Draft Generated!</b>\n\n<b>Product:</b> ${product.name}\n<b>Title:</b> ${article.title}\n<b>Status:</b> Draft (Hidden)\n\n<i>Log in to the Admin Panel to review and publish.</i>`;
  await sendTelegramMessage(notifyText);

  return article;
}
