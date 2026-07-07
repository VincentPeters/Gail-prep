import { defineCollection, z } from "astro:content";

const study = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    domain: z.string(), // Domain.id
    order: z.number().default(0),
    summary: z.string(),
    readingMinutes: z.number().default(10),
  }),
});

export const collections = { study };
