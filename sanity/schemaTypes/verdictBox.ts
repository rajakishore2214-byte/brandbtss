import { defineField, defineType } from "sanity";

export const verdictBox = defineType({
  name: "verdictBox",
  title: "Verdict Box",
  type: "object",
  fields: [
    defineField({
      name: "winnerName",
      title: "Winner / Recommended Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Verdict Summary",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: "affiliateSlug",
      title: "Affiliate Slug",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    }),
  ],
});
