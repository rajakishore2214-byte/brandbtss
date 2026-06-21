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

  // Validate affiliate URL domain to prevent Open Redirect vulnerability
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Whitelist check
    const isWhitelisted = 
      hostname.endsWith("amazon.com") || 
      hostname.endsWith("amazon.in") || 
      hostname.endsWith("link.amazon") ||
      hostname.endsWith("sjv.io") || 
      hostname.endsWith("pxf.io") || 
      hostname.endsWith("partnerstack.com") || 
      hostname.endsWith("grsm.io") ||
      hostname.endsWith("hostinger.com") ||
      hostname.endsWith("convertkit.com") ||
      hostname.endsWith("semrush.com") ||
      hostname === "localhost" ||
      hostname === "127.0.0.1";
      
    if (!isWhitelisted) {
      return NextResponse.json({ error: "Invalid redirection target domain." }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Invalid redirect URL format." }, { status: 400 });
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
