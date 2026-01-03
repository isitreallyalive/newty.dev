import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function mdxLoader(dir: string) {
  return glob({
    base: `./content/${dir}`,
    pattern: "**/*.mdx",
    // remove file extension and directory to get slug
    generateId: ({ entry }) => entry.split("/").pop()!.split(".")[0],
  });
}

const blog = defineCollection({
  loader: mdxLoader("blog"),
  schema: z.object({
    title: z.string(),
    draft: z.boolean().optional(),
    published: z.date().optional(),
  }),
});

const projects = defineCollection({
  loader: mdxLoader("projects"),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    "crates.io": z.string().optional(),
    npm: z.string().optional(),
    repoAuthor: z.string().optional(),
    repoName: z.string().optional(),
  }),
});

export const collections = { blog, projects };
