import path from "node:path";
import type { AstroIntegration } from "astro";
import fs from "node:fs/promises";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import { watch, type FSWatcher } from "node:fs";

const inPath = path.resolve(process.cwd(), "src", "styles", "rss.css");
const outPath = path.resolve(process.cwd(), "public", "rss", "rss.css");

async function processCss() {
  const css = await fs.readFile(inPath, "utf8");
  const processor = postcss([
    tailwindcss({ base: path.resolve(process.cwd(), "public", "rss") }),
  ]);
  const result = await processor.process(css, {
    from: inPath,
    to: outPath,
  });
  await fs.writeFile(outPath, result.css);
}

export default function rssTailwind(): AstroIntegration {
  let watchHandle: FSWatcher | null = null;
  let debounceTimer: NodeJS.Timeout | null = null;

  return {
    name: "rss-tailwind",
    hooks: {
      // dev server
      "astro:config:done": async () => {
        await processCss();

        if (process.env.NODE_ENV !== "production") {
          try {
            watchHandle = watch(inPath, { persistent: true }, () => {
              // simple debounce to avoid multiple runs
              if (debounceTimer) clearTimeout(debounceTimer);
              debounceTimer = setTimeout(() => {
                void processCss();
              }, 100);
            });
          } catch {}
        }
      },

      // build
      "astro:build:start": async () => {
        await processCss();

        if (watchHandle) {
          try {
            watchHandle.close();
            watchHandle = null;
          } catch {}
        }
      },
    },
  };
}
