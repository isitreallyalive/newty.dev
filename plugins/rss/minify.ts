import path from "node:path";
import type { Plugin } from "vite";
import fs from "node:fs/promises";
import { minify } from "html-minifier-terser";

const inPath = path.resolve(process.cwd(), "src", "rss", "feed.xsl");
const outPath = path.resolve(process.cwd(), "dist", "rss", "feed.xsl");

export default function rssMinify(): Plugin {
  return {
    name: "rss-minify",
    apply: "build",
    async writeBundle() {
      try {
        const raw = await fs.readFile(inPath, "utf8");
        const min = await minify(raw, {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true,
          keepClosingSlash: true,
        });
        if (min !== raw) {
          await fs.writeFile(outPath, min, "utf8");
        }
      } catch {}
    },
  };
}
