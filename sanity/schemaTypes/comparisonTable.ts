import { defineField, defineType } from "sanity";

export const comparisonTable = defineType({
  name: "comparisonTable",
  title: "Comparison Table",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Table Title",
      type: "string",
    }),
    defineField({
      name: "rows",
      title: "Table Rows",
      type: "array",
      of: [
        {
          type: "object",
          name: "row",
          title: "Row",
          fields: [
            defineField({
              name: "toolName",
              title: "Tool Name",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: "bestFor",
              title: "Best For",
              type: "string",
            }),
            defineField({
              name: "startingPrice",
              title: "Starting Price",
              type: "string",
            }),
            defineField({
              name: "rating",
              title: "Rating",
              type: "number",
              validation: (Rule: any) => Rule.min(1).max(5),
            }),
            defineField({
              name: "affiliateSlug",
              title: "Affiliate Slug",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
});
