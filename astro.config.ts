// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import rssTailwind from "./plugins/rssTailwind";
import rssMinify from "./plugins/rssMinify";
import readingTime from "./plugins/readingTime";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  prefetch: true,

  vite: {
    plugins: [tailwindcss(), wasm(), rssMinify()],
  },

  markdown: {
    remarkPlugins: [readingTime],
  },

  integrations: [rssTailwind(), svelte(), icon(), mdx()],
});
