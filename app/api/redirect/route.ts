import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const network = searchParams.get("network");
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing redirect URL" }, { status: 400 });
  }

  // If we have product and network tracking details, save them in the DB
  if (productId && network) {
    try {
      const userAgent = request.headers.get("user-agent") || null;
      // Get client IP address
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        null;

      await db.click.create({
        data: {
          productId,
          affiliateNetwork: network,
          ip,
          userAgent,
        },
      });
    } catch (err) {
      console.error("Failed to log affiliate click tracker:", err);
      // Fail silently for user so the redirect still works
    }
  }

  // Redirect to the affiliate URL using a 307 temporary redirect
  return NextResponse.redirect(url, 307);
}
