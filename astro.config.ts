// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs/promises";
import type { Plugin } from "vite";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import { minify } from "html-minifier-terser";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), minifyXsl()],
  },

  integrations: [svelte(), icon(), mdx()],
});

const distDir = path.resolve(process.cwd(), "dist");

async function collectFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await collectFiles(full)));
      } else {
        files.push(full);
      }
    }
    return files;
  } catch {
    return [];
  }
}

function minifyXsl(): Plugin {
  return {
    name: "minify-xsl",
    apply: "build",
    async writeBundle() {
      const allFiles = await collectFiles(distDir);
      const xslFiles = allFiles.filter((f) => f.endsWith(".xsl"));

      await Promise.all(
        xslFiles.map(async (file) => {
          try {
            const raw = await fs.readFile(file, "utf8");
            const min = await minify(raw, {
              collapseWhitespace: true,
              removeComments: true,
              minifyCSS: true,
              minifyJS: true,
              keepClosingSlash: true,
            });
            if (min !== raw) {
              await fs.writeFile(file, min, "utf8");
            }
          } catch {}
        }),
      );
    },
  };
}
