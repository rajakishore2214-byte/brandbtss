import { defineField, defineType } from "sanity";

export const productCard = defineType({
  name: "productCard",
  title: "Product Card",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      validation: (Rule: any) => Rule.min(1).max(5),
    }),
    defineField({
      name: "pros",
      title: "Pros",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "cons",
      title: "Cons",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "priceText",
      title: "Price Text",
      type: "string",
      description: "e.g., 'From $9/month' or 'Free trial available'",
    }),
    defineField({
      name: "affiliateSlug",
      title: "Affiliate Slug",
      type: "string",
      description: "Slug representing the affiliate link (e.g., 'hostinger-biz')",
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
      initialValue: "Check Current Price",
    }),
  ],
});
