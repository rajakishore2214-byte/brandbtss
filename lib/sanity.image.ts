import imageUrlBuilder from "@sanity/image-url";
import { client } from "./sanity.client";
import { SanityImageSource } from "@sanity/image-url";

const builder = imageUrlBuilder(client);

// Safe image builder that falls back to empty URLs rather than crashing when Sanity is not configured
export function urlFor(source: SanityImageSource) {
  try {
    const projectId = client.config().projectId;
    if (!source || !projectId || projectId === "placeholder-id") {
      const mockBuilder = {
        width: () => mockBuilder,
        height: () => mockBuilder,
        url: () => "",
      };
      return mockBuilder as any;
    }
    return builder.image(source);
  } catch (error) {
    console.warn("Sanity image builder failed. Returning fallback empty URL builder.", error);
    const mockBuilder = {
      width: () => mockBuilder,
      height: () => mockBuilder,
      url: () => "",
    };
    return mockBuilder as any;
  }
}
