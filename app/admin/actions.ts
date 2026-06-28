"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { headers, cookies } from "next/headers";

// Helper to ensure input is secure or validate credentials if needed
async function verifyAdminAuth() {
  const headersList = await headers();
  const basicAuth = headersList.get("authorization");
  
  let authValue = "";
  if (basicAuth) {
    authValue = basicAuth.split(" ")[1];
  } else {
    // Try cookie fallback for Server Actions triggered via fetch
    const cookieStore = await cookies();
    const adminTokenCookie = cookieStore.get("admin_token");
    if (adminTokenCookie) {
      authValue = adminTokenCookie.value;
    }
  }
  
  if (!authValue) {
    throw new Error("Unauthorized access. Admin authentication required.");
  }
  
  try {
    const [user, pwd] = atob(authValue).split(":");
    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";
    
    if (user !== adminUser || pwd !== adminPassword) {
      throw new Error("Unauthorized: Invalid admin credentials.");
    }
  } catch (e) {
    throw new Error("Unauthorized: Invalid admin credentials.");
  }
}

// PRODUCT CRUD ACTIONS
export async function createProduct(formData: FormData) {
  await verifyAdminAuth();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const categorySlug = formData.get("categorySlug") as string;
  const subcategorySlug = (formData.get("subcategorySlug") as string) || null;
  const price = parseInt(formData.get("price") as string) || 0;
  const originalPrice = formData.get("originalPrice") ? parseInt(formData.get("originalPrice") as string) : null;
  const rating = parseFloat(formData.get("rating") as string) || 5.0;
  const image = formData.get("image") as string;
  const description = formData.get("description") as string;
  const dealTag = (formData.get("dealTag") as string) || null;
  const score = parseInt(formData.get("score") as string) || 80;
  const featured = formData.get("featured") === "true";
  const status = (formData.get("status") as string) || "active";
  const keywords = (formData.get("keywords") as string) || null;
  const primaryKeyword = (formData.get("primaryKeyword") as string) || null;
  const secondaryKeywords = (formData.get("secondaryKeywords") as string) || null;

  // Parse arrays and spec objects
  const features = JSON.stringify(
    (formData.get("features") as string || "")
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean)
  );

  const pros = JSON.stringify(
    (formData.get("pros") as string || "")
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
  );

  const cons = JSON.stringify(
    (formData.get("cons") as string || "")
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean)
  );

  // Parse specs textarea key=value
  const specsObj: Record<string, string> = {};
  const specsRaw = formData.get("specs") as string || "";
  specsRaw.split("\n").forEach((line) => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      specsObj[parts[0].trim()] = parts.slice(1).join("=").trim();
    }
  });
  const specs = JSON.stringify(specsObj);

  // Parse affiliate URLs JSON
  const affiliateUrlsRaw = formData.get("affiliateUrls") as string || "";
  const affiliateUrlsList = affiliateUrlsRaw
    .split("\n")
    .map((line) => {
      const [network, url, priceStr] = line.split("|");
      if (!network || !url) return null;
      return {
        network: network.trim(),
        url: url.trim(),
        price: priceStr ? parseInt(priceStr.trim()) : undefined,
      };
    })
    .filter(Boolean);

  const affiliateUrls = JSON.stringify(affiliateUrlsList);

  await db.product.create({
    data: {
      id,
      name,
      brand,
      categorySlug,
      subcategorySlug,
      price,
      originalPrice,
      rating,
      image,
      description,
      features,
      pros,
      cons,
      specs,
      dealTag,
      score,
      featured,
      status,
      affiliateUrls,
      keywords,
      primaryKeyword,
      secondaryKeywords,
    } as any,
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath(`/category/${categorySlug}`);
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  await verifyAdminAuth();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const categorySlug = formData.get("categorySlug") as string;
  const subcategorySlug = (formData.get("subcategorySlug") as string) || null;
  const price = parseInt(formData.get("price") as string) || 0;
  const originalPrice = formData.get("originalPrice") ? parseInt(formData.get("originalPrice") as string) : null;
  const rating = parseFloat(formData.get("rating") as string) || 5.0;
  const image = formData.get("image") as string;
  const description = formData.get("description") as string;
  const dealTag = (formData.get("dealTag") as string) || null;
  const score = parseInt(formData.get("score") as string) || 80;
  const featured = formData.get("featured") === "true";
  const status = (formData.get("status") as string) || "active";
  const keywords = (formData.get("keywords") as string) || null;
  const primaryKeyword = (formData.get("primaryKeyword") as string) || null;
  const secondaryKeywords = (formData.get("secondaryKeywords") as string) || null;

  const features = JSON.stringify(
    (formData.get("features") as string || "")
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean)
  );

  const pros = JSON.stringify(
    (formData.get("pros") as string || "")
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
  );

  const cons = JSON.stringify(
    (formData.get("cons") as string || "")
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean)
  );

  const specsObj: Record<string, string> = {};
  const specsRaw = formData.get("specs") as string || "";
  specsRaw.split("\n").forEach((line) => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      specsObj[parts[0].trim()] = parts.slice(1).join("=").trim();
    }
  });
  const specs = JSON.stringify(specsObj);

  const affiliateUrlsRaw = formData.get("affiliateUrls") as string || "";
  const affiliateUrlsList = affiliateUrlsRaw
    .split("\n")
    .map((line) => {
      const [network, url, priceStr] = line.split("|");
      if (!network || !url) return null;
      return {
        network: network.trim(),
        url: url.trim(),
        price: priceStr ? parseInt(priceStr.trim()) : undefined,
      };
    })
    .filter(Boolean);

  const affiliateUrls = JSON.stringify(affiliateUrlsList);

  await db.product.update({
    where: { id },
    data: {
      name,
      brand,
      categorySlug,
      subcategorySlug,
      price,
      originalPrice,
      rating,
      image,
      description,
      features,
      pros,
      cons,
      specs,
      dealTag,
      score,
      featured,
      status,
      affiliateUrls,
      keywords,
      primaryKeyword,
      secondaryKeywords,
    } as any,
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${id}`);
  revalidatePath(`/category/${categorySlug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await verifyAdminAuth();
  await db.product.delete({
    where: { id },
  });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

// ARTICLE CRUD ACTIONS
export async function createArticle(formData: FormData) {
  await verifyAdminAuth();
  const slug = formData.get("slug") as string;
  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const categorySlug = formData.get("categorySlug") as string;
  const date = formData.get("date") as string || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const author = formData.get("author") as string || "BrandBTSS Editorial Team";
  const image = formData.get("image") as string;
  const introduction = formData.get("introduction") as string;
  const verdict = (formData.get("verdict") as string) || null;
  const rating = formData.get("rating") ? parseFloat(formData.get("rating") as string) : null;
  const seoTitle = formData.get("seoTitle") as string || title;
  const seoDescription = formData.get("seoDescription") as string || description;
  const status = formData.get("status") as string || "published";
  
  // Blog-specific schema updates
  const keywords = (formData.get("keywords") as string) || null;
  const content = (formData.get("content") as string) || null;
  const schema = (formData.get("schema") as string) || null;

  // Parse links
  const productIds = JSON.stringify(
    (formData.get("productIds") as string || "")
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
  );

  // Recommendations: overallPickId|budgetPickId|premiumPickId|summary
  const quickRecSummary = formData.get("quickRecSummary") as string || "";
  const quickRecommendation = quickRecSummary ? JSON.stringify({
    overallPickId: (formData.get("overallPickId") as string) || "",
    budgetPickId: (formData.get("budgetPickId") as string) || "",
    premiumPickId: (formData.get("premiumPickId") as string) || "",
    summary: quickRecSummary,
  }) : null;

  // Top Picks award list: productId|tag|awardReason
  const topPicksRaw = formData.get("topPicks") as string || "";
  const topPicksList = topPicksRaw
    .split("\n")
    .map((line) => {
      const [productId, tag, awardReason] = line.split("|");
      if (!productId || !tag) return null;
      return { productId: productId.trim(), tag: tag.trim(), awardReason: awardReason ? awardReason.trim() : "" };
    })
    .filter(Boolean);
  const topPicks = topPicksList.length > 0 ? JSON.stringify(topPicksList) : null;

  // Buying Guide: Section Title===Section Content
  const buyingGuideRaw = formData.get("buyingGuide") as string || "";
  const buyingGuideList = buyingGuideRaw
    .split("\n\n")
    .map((block) => {
      const parts = block.split("===");
      if (parts.length < 2) return null;
      return { title: parts[0].trim(), content: parts.slice(1).join("===").trim() };
    })
    .filter(Boolean);
  const buyingGuide = buyingGuideList.length > 0 ? JSON.stringify(buyingGuideList) : null;

  // FAQs: Question===Answer
  const faqsRaw = formData.get("faqs") as string || "";
  const faqsList = faqsRaw
    .split("\n\n")
    .map((block) => {
      const parts = block.split("===");
      if (parts.length < 2) return null;
      return { question: parts[0].trim(), answer: parts.slice(1).join("===").trim() };
    })
    .filter(Boolean);
  const faqs = faqsList.length > 0 ? JSON.stringify(faqsList) : null;

  await db.article.create({
    data: {
      slug,
      type,
      title,
      description,
      categorySlug,
      date,
      author,
      image,
      introduction,
      quickRecommendation,
      topPicks,
      productIds,
      buyingGuide,
      faqs,
      verdict,
      rating,
      seoTitle,
      seoDescription,
      status,
      keywords,
      content,
      schema,
    } as any,
  });

  revalidatePath("/");
  revalidatePath("/admin/articles");
  revalidatePath(`/blog`);
  redirect("/admin/articles");
}

export async function updateArticle(formData: FormData) {
  await verifyAdminAuth();
  const id = formData.get("id") as string;
  const slug = formData.get("slug") as string;
  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const categorySlug = formData.get("categorySlug") as string;
  const date = formData.get("date") as string;
  const author = formData.get("author") as string;
  const image = formData.get("image") as string;
  const introduction = formData.get("introduction") as string;
  const verdict = (formData.get("verdict") as string) || null;
  const rating = formData.get("rating") ? parseFloat(formData.get("rating") as string) : null;
  const seoTitle = formData.get("seoTitle") as string || title;
  const seoDescription = formData.get("seoDescription") as string || description;
  const status = formData.get("status") as string || "published";

  // Blog-specific schema updates
  const keywords = (formData.get("keywords") as string) || null;
  const content = (formData.get("content") as string) || null;
  const schema = (formData.get("schema") as string) || null;

  const productIds = JSON.stringify(
    (formData.get("productIds") as string || "")
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
  );

  const quickRecSummary = formData.get("quickRecSummary") as string || "";
  const quickRecommendation = quickRecSummary ? JSON.stringify({
    overallPickId: (formData.get("overallPickId") as string) || "",
    budgetPickId: (formData.get("budgetPickId") as string) || "",
    premiumPickId: (formData.get("premiumPickId") as string) || "",
    summary: quickRecSummary,
  }) : null;

  const topPicksRaw = formData.get("topPicks") as string || "";
  const topPicksList = topPicksRaw
    .split("\n")
    .map((line) => {
      const [productId, tag, awardReason] = line.split("|");
      if (!productId || !tag) return null;
      return { productId: productId.trim(), tag: tag.trim(), awardReason: awardReason ? awardReason.trim() : "" };
    })
    .filter(Boolean);
  const topPicks = topPicksList.length > 0 ? JSON.stringify(topPicksList) : null;

  const buyingGuideRaw = formData.get("buyingGuide") as string || "";
  const buyingGuideList = buyingGuideRaw
    .split("\n\n")
    .map((block) => {
      const parts = block.split("===");
      if (parts.length < 2) return null;
      return { title: parts[0].trim(), content: parts.slice(1).join("===").trim() };
    })
    .filter(Boolean);
  const buyingGuide = buyingGuideList.length > 0 ? JSON.stringify(buyingGuideList) : null;

  const faqsRaw = formData.get("faqs") as string || "";
  const faqsList = faqsRaw
    .split("\n\n")
    .map((block) => {
      const parts = block.split("===");
      if (parts.length < 2) return null;
      return { question: parts[0].trim(), answer: parts.slice(1).join("===").trim() };
    })
    .filter(Boolean);
  const faqs = faqsList.length > 0 ? JSON.stringify(faqsList) : null;

  await db.article.update({
    where: { id },
    data: {
      slug,
      type,
      title,
      description,
      categorySlug,
      date,
      author,
      image,
      introduction,
      quickRecommendation,
      topPicks,
      productIds,
      buyingGuide,
      faqs,
      verdict,
      rating,
      seoTitle,
      seoDescription,
      status,
      keywords,
      content,
      schema,
    } as any,
  });

  revalidatePath("/");
  revalidatePath("/admin/articles");
  revalidatePath(`/blog`);
  revalidatePath(`/${type === "blog" ? "blog" : "best-products"}/${slug}`);
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await verifyAdminAuth();
  await db.article.delete({
    where: { id },
  });
  revalidatePath("/admin/articles");
  revalidatePath("/");
}

export async function importRawText(formData: FormData) {
  const { parseProductFromText, generateProductReview } = await import("@/lib/ai");
  await verifyAdminAuth();
  const text = formData.get("text") as string;
  if (!text || !text.trim()) {
    throw new Error("No text provided for ingestion.");
  }
  
  const parsedProduct = await parseProductFromText(text);
  
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

  // Generate review draft automatically
  await generateProductReview(product.id);

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin/articles");
  redirect("/admin/products");
}

// ADMIN LOGIN ACTIONS
export async function adminLogin(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "password123";

  if (username === adminUser && password === adminPassword) {
    const authValue = btoa(`${username}:${password}`);
    const cookieStore = await cookies();
    cookieStore.set("admin_token", authValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return { success: true, error: null };
  }
  return { success: false, error: "Invalid admin credentials" };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}
