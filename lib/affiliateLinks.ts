export const affiliateLinks: Record<string, { url: string; network?: string }> = {
  // ─── Existing: Freelancer SaaS Tools ────────────────────────────────────────
  "bonsai-invoicing": {
    url: "https://bonsai.sjv.io/c/123456/78910/bonsai-invoice-tool",
    network: "Impact",
  },
  "freshbooks-invoicing": {
    url: "https://freshbooks.pxf.io/c/234567/89101/freshbooks-accounting",
    network: "Impact",
  },
  "proposify-proposals": {
    url: "https://proposify.partnerstack.com/track?id=proposify-solopreneur",
    network: "PartnerStack",
  },
  "better-proposals": {
    url: "https://betterproposals.grsm.io/betterproposals-freelance",
    network: "GrowSumo",
  },
  "toggl-time-track": {
    url: "https://toggl.sjv.io/c/345678/90123/toggl-track-premium",
    network: "Impact",
  },
  "harvest-time-track": {
    url: "https://harvest.grsm.io/harvest-time-tracking-tool",
    network: "GrowSumo",
  },
  "asana-pm": {
    url: "https://asana.grsm.io/asana-project-mgmt",
    network: "GrowSumo",
  },
  "monday-pm": {
    url: "https://monday.partnerstack.com/track?id=monday-solopreneur-pm",
    network: "PartnerStack",
  },

  // ─── Home & Kitchen ──────────────────────────────────────────────────────────
  "amazon-home-kitchen-organizer": {
    url: "https://link.amazon/B0b86tIuX",
    network: "Amazon Associates",
  },
  "amazon-home-kitchen-cookware": {
    url: "https://link.amazon/B0hKvoVao",
    network: "Amazon Associates",
  },
  "amazon-home-kitchen-storage": {
    url: "https://link.amazon/B0hv50EQ2",
    network: "Amazon Associates",
  },

  // ─── Smart Home Appliances ───────────────────────────────────────────────────
  "amazon-smart-home-device-1": {
    url: "https://link.amazon/B081CXzON",
    network: "Amazon Associates",
  },
  "amazon-smart-home-device-2": {
    url: "https://link.amazon/B01GA8EE4",
    network: "Amazon Associates",
  },
  "amazon-smart-home-device-3": {
    url: "https://link.amazon/B05Ehxlur",
    network: "Amazon Associates",
  },

  // ─── Electronics & Gadgets ───────────────────────────────────────────────────
  "amazon-electronics-gadget-1": {
    url: "https://link.amazon/B05OKkhlM",
    network: "Amazon Associates",
  },
  "amazon-electronics-gadget-2": {
    url: "https://link.amazon/B0b0H37fG",
    network: "Amazon Associates",
  },
  "amazon-electronics-gadget-3": {
    url: "https://link.amazon/B0dhd5wcA",
    network: "Amazon Associates",
  },
  "amazon-electronics-gadget-4": {
    url: "https://link.amazon/B07unAJM7",
    network: "Amazon Associates",
  },
  "amazon-electronics-gadget-5": {
    url: "https://link.amazon/B07HvTOTt",
    network: "Amazon Associates",
  },
  "amazon-electronics-gadget-6": {
    url: "https://link.amazon/B00zjnrwN",
    network: "Amazon Associates",
  },
  "amazon-electronics-gadget-7": {
    url: "https://link.amazon/B0ic2SWyG",
    network: "Amazon Associates",
  },
  "amazon-electronics-gadget-8": {
    url: "https://link.amazon/B06uDs4Hv",
    network: "Amazon Associates",
  },

  // ─── Clothing & Accessories ──────────────────────────────────────────────────
  "amazon-clothing-item-1": {
    url: "https://link.amazon/B0foDOnkb",
    network: "Amazon Associates",
  },
  "amazon-clothing-item-2": {
    url: "https://link.amazon/B0cXsnkuX",
    network: "Amazon Associates",
  },
  "amazon-clothing-item-3": {
    url: "https://link.amazon/B0h1Aokca",
    network: "Amazon Associates",
  },
  "amazon-clothing-item-4": {
    url: "https://link.amazon/B0a0ndgc7",
    network: "Amazon Associates",
  },
  "amazon-clothing-item-5": {
    url: "https://link.amazon/B09AYGgUo",
    network: "Amazon Associates",
  },
  "amazon-clothing-item-6": {
    url: "https://link.amazon/B06VmxML0",
    network: "Amazon Associates",
  },
  "amazon-clothing-item-7": {
    url: "https://link.amazon/B0ckOmTZe",
    network: "Amazon Associates",
  },
  "amazon-clothing-item-8": {
    url: "https://link.amazon/B0apfGuLh",
    network: "Amazon Associates",
  },
  "amazon-clothing-item-9": {
    url: "https://link.amazon/B0j1VNi1S",
    network: "Amazon Associates",
  },
  "amazon-clothing-item-10": {
    url: "https://link.amazon/B031n8Ocy",
    network: "Amazon Associates",
  },
  "amazon-clothing-item-11": {
    url: "https://link.amazon/B06N9GfSO",
    network: "Amazon Associates",
  },
};

/**
 * Programmatically constructs the final outbound affiliate URL with strict UTM parameter tagging.
 * Handles merging existing search params on the partner link safely.
 */
export function getDestinationUrl(
  slug: string,
  campaign?: string | null,
  placement?: string | null
): string {
  const item = affiliateLinks[slug];
  if (!item) return "";

  try {
    const urlObj = new URL(item.url);
    
    // Set standardized tracking params
    urlObj.searchParams.set("utm_source", "brandbtss");
    urlObj.searchParams.set("utm_medium", "affiliate");
    urlObj.searchParams.set("utm_campaign", campaign || slug);
    
    if (placement) {
      urlObj.searchParams.set("utm_content", placement);
    }
    
    return urlObj.toString();
  } catch (error) {
    // Fallback if URL parsing fails on relative/partial links
    const separator = item.url.includes("?") ? "&" : "?";
    const campaignVal = encodeURIComponent(campaign || slug);
    const placementVal = placement ? `&utm_content=${encodeURIComponent(placement)}` : "";
    
    return `${item.url}${separator}utm_source=brandbtss&utm_medium=affiliate&utm_campaign=${campaignVal}${placementVal}`;
  }
}
