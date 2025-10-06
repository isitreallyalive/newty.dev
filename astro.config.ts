// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import minifyXsl from "./plugins/minifyXsl";
import readingTime from "./plugins/readingTime";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), minifyXsl()],
  },

  markdown: {
    remarkPlugins: [readingTime],
  },

  integrations: [svelte(), icon(), mdx()],
});
