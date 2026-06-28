import React from "react";

interface StructuredDataProps {
  type: "article" | "product" | "review" | "faq";
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let schema: any = null;

  if (type === "article") {
    schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title,
      "description": data.description,
      "image": data.image,
      "datePublished": data.date,
      "author": {
        "@type": "Person",
        "name": data.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "BrandBTSS",
        "logo": {
          "@type": "ImageObject",
          "url": "https://brandbtss.com/logo.png" // Fallback logo URL
        }
      }
    };
  } else if (type === "product") {
    const fallbackImage = data.image.startsWith("http") ? data.image : `https://brandbtss.com${data.image}`;
    
    const parsedOffers = data.affiliateUrlsParsed && data.affiliateUrlsParsed.length > 0
      ? data.affiliateUrlsParsed.map((aff: any) => ({
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": aff.price || data.price,
          "availability": "https://schema.org/InStock",
          "url": `https://brandbtss.com/api/redirect?productId=${data.id}&network=${encodeURIComponent(aff.network)}&url=${encodeURIComponent(aff.url)}`
        }))
      : [];

    const offerSection = parsedOffers.length > 1
      ? {
          "@type": "AggregateOffer",
          "priceCurrency": "INR",
          "lowPrice": Math.min(...parsedOffers.map((o: any) => Number(o.price))),
          "highPrice": Math.max(...parsedOffers.map((o: any) => Number(o.price))),
          "offerCount": parsedOffers.length,
          "offers": parsedOffers
        }
      : parsedOffers.length === 1
      ? parsedOffers[0]
      : {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": data.price,
          "availability": "https://schema.org/InStock",
          "url": data.affiliateUrl.startsWith("http") ? data.affiliateUrl : `https://brandbtss.com${data.affiliateUrl}`
        };

    schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": data.name,
      "image": fallbackImage,
      "description": data.description,
      "brand": {
        "@type": "Brand",
        "name": data.brand
      },
      "offers": offerSection,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": data.rating,
        "reviewCount": 24 // Simulated reviews count
      }
    };
  } else if (type === "review") {
    schema = {
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "Product",
        "name": data.productName,
        "image": data.productImage,
        "brand": {
          "@type": "Brand",
          "name": data.productBrand
        }
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": data.rating,
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": data.author
      },
      "reviewBody": data.verdict,
      "publisher": {
        "@type": "Organization",
        "name": "BrandBTSS"
      }
    };
  } else if (type === "faq") {
    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.map((faq: { question: string; answer: string }) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
