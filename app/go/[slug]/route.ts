import { NextRequest, NextResponse } from "next/server";
import { getDestinationUrl, affiliateLinks } from "@/lib/affiliateLinks";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const item = affiliateLinks[slug];

  if (!item) {
    return new NextResponse("Affiliate redirect link not found", { status: 404 });
  }

  // Extract query parameters for dynamic UTM campaigns and placements
  const { searchParams } = new URL(request.url);
  const campaign = searchParams.get("campaign");
  const placement = searchParams.get("placement");

  // Build the final UTM-tagged URL
  const destinationUrl = getDestinationUrl(slug, campaign, placement);

  // Log the click event (slug + destination + timestamp)
  const timestamp = new Date().toISOString();
  console.log(
    `[Affiliate Click] Slug: "${slug}" | Destination: "${destinationUrl}" | Campaign: "${campaign || "direct"}" | Placement: "${placement || "unknown"}" | Timestamp: ${timestamp}`
  );
  
  // TODO: send to analytics (e.g. Google Analytics, Mixpanel, custom click tracking service)

  // Issue a 307 Temporary Redirect
  return NextResponse.redirect(destinationUrl, 307);
}
