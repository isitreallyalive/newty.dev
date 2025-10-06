import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({
    base: "./content/blog",
    pattern: "**/*.mdx",
    // remove file extension and directory to get slug
    generateId: ({ entry }) => entry.split("/").pop()!.split(".")[0],
  }),
  schema: z.object({
    title: z.string(),
    published: z.date().optional(),
  }),
});

export const collections = { blog };
