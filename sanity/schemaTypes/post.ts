import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "postType",
      title: "Post Type",
      type: "string",
      options: {
        list: [
          { title: "Comparison / Roundup", value: "roundup" },
          { title: "Product Review", value: "review" },
        ],
        layout: "radio",
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description: "Short summary of the post, max ~160 characters (used for SEO meta description).",
      validation: (Rule: any) => Rule.required().max(160),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body Content",
      type: "array",
      of: [
        {
          type: "block",
        },
        {
          type: "image",
          options: { hotspot: true },
        },
        {
          type: "productCard",
          title: "Inline Product Card",
        },
        {
          type: "comparisonTable",
          title: "Comparison Table",
        },
        {
          type: "verdictBox",
          title: "Verdict Box",
        },
      ],
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title Override",
      type: "string",
      description: "Optional override for <title>.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description Override",
      type: "string",
      description: "Optional override for meta description.",
    }),
    defineField({
      name: "featuredTools",
      title: "Featured Tools",
      type: "array",
      description: "Used to auto-populate schema.org Product/Review structured data for the page.",
      of: [
        {
          type: "reference",
          to: [{ type: "productCard" }],
        },
      ],
    }),
  ],
});
