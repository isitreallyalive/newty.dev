import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

/**
 * Load all MDX files from a given directory.
 */
function mdx(dir: string) {
  return glob({
    base: `./content/${dir}`,
    pattern: "**/*.mdx",
    // remove file extension and path leaving only the filename as a slug
    generateId: ({ entry }) =>
      entry.split("/").pop()!.split(".")[0].toLowerCase().replace(/\s+/g, "-"),
  });
}

const projects = defineCollection({
  loader: mdx("projects"),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    links: z
      .object({
        // repo
        github: z
          .string()
          .regex(/^.+\/.+$/, "Just need the 'username/repo' part of the URL")
          .optional(),

        // packages
        "crates.io": z.string().optional(),
        npm: z.string().optional(),
      })
      .refine((links) => links.github, {
        message: "There must be at least a GitHub link.",
      }),
  }),
});

export const collections = { projects };
