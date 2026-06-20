import React from "react";
import { SanityPost } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";

interface SchemaMarkupProps {
  type: "review" | "roundup" | "home";
  post?: SanityPost;
}

export default function SchemaMarkup({ type, post }: SchemaMarkupProps) {
  const schemas: any[] = [];
  const domain = "https://brandbtss.com";

  if (type === "home") {
    // WebSite schema for homepage
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "BrandBTSS",
      "url": domain,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${domain}/?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    });
  }

  if (post) {
    // BreadcrumbList schema for post pages
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": domain
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": post.postType === "roundup" ? "Roundups" : "Reviews",
          "item": `${domain}/${post.postType}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": `${domain}/${post.postType}/${post.slug}`
        }
      ]
    });

    if (post.postType === "review") {
      // Review schema
      const featuredProduct = post.featuredTools?.[0];
      const productLogoUrl = featuredProduct?.logo ? urlFor(featuredProduct.logo).url() : undefined;

      schemas.push({
        "@context": "https://schema.org",
        "@type": "Review",
        "name": post.seoTitle || post.title,
        "reviewBody": post.excerpt,
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt || post.publishedAt,
        "author": {
          "@type": "Person",
          "name": post.author?.name || "Editorial Team"
        },
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": featuredProduct?.name || post.title,
          "image": productLogoUrl,
          "description": featuredProduct?.tagline || post.excerpt,
          "applicationCategory": "BusinessApplication",
          "offers": {
            "@type": "Offer",
            "price": "0", // standard placeholder for software signups
            "priceCurrency": "USD",
            "description": featuredProduct?.priceText
          }
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": featuredProduct?.rating || 5,
          "bestRating": "5",
          "worstRating": "1"
        }
      });
    } else if (post.postType === "roundup") {
      // ItemList containing Product schemas
      schemas.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": post.title,
        "description": post.excerpt,
        "numberOfItems": post.featuredTools?.length || 0,
        "itemListElement": post.featuredTools?.map((tool, index) => {
          const logoUrl = tool.logo ? urlFor(tool.logo).url() : undefined;
          return {
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Product",
              "name": tool.name,
              "description": tool.tagline,
              "image": logoUrl,
              "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "description": tool.priceText
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": tool.rating || 5,
                "ratingCount": "1", // standard review aggregate placeholder
                "bestRating": "5",
                "worstRating": "1"
              }
            }
          };
        }) || []
      });
    }
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
