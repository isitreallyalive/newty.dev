// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import rssTailwind from "./plugins/rssTailwind";
import rssMinify from "./plugins/rssMinify";
import readingTime from "./plugins/readingTime";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), rssMinify()],
  },

  markdown: {
    remarkPlugins: [readingTime],
  },

  integrations: [rssTailwind(), svelte(), icon(), mdx()],
});
