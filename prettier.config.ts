import type { Config } from "prettier";

const plugin = (name: string) => `prettier-plugin-${name}`;

export default {
  plugins: [plugin("astro"), plugin("svelte"), plugin("tailwindcss")],
} satisfies Config;
