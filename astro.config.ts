// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";

import { PLAYERS } from "$data";
import { donwloadPlayerAssets } from "$build/mc";

for (const player of Object.keys(PLAYERS)) {
  await donwloadPlayerAssets(player as keyof typeof PLAYERS);
}

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), wasm()],
  },

  integrations: [svelte(), mdx()],
  adapter: vercel(),
});
