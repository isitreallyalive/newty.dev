import { getPaths } from "./_helpers";
import type { AstroIntegration } from "astro";
import fs from "node:fs/promises";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

const [inPath, outPath] = getPaths("rss", "feed.css");

export default function rssTailwind(): AstroIntegration {
  return {
    name: "rss-tailwind",
    hooks: {
      "astro:build:done": async () => {
        const css = await fs.readFile(inPath, "utf8");
        const processor = postcss([tailwindcss()]);
        const result = await processor.process(css, {
          from: inPath,
          to: outPath,
        });
        await fs.writeFile(outPath, result.css);
      },
    },
  };
}
