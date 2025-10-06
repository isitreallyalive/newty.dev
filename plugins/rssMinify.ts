import type { Plugin } from "vite";
import { getPaths } from "./_helpers";
import fs from "node:fs/promises";
import { minify } from "html-minifier-terser";

const [inPath, outPath] = getPaths("rss", "feed.xsl");

export default function rssMinify(): Plugin {
  return {
    name: "minify-xsl",
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
