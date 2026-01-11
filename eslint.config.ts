import js from "@eslint/js";
import ts from "typescript-eslint";
import * as mdx from "eslint-plugin-mdx";
import astro from "eslint-plugin-astro";
import svelte from "eslint-plugin-svelte";
import globals from "globals";

import svelteConfig from "./svelte.config.js";

export default ts.config(
  // languages
  js.configs.recommended,
  ts.configs.recommended,

  {
    files: ["**/*.mdx"],
    ...mdx.configs.flat,
    rules: {
      ...mdx.configs.flat.rules,
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // astro + a11y
  astro.configs.recommended,
  astro.configs["jsx-a11y-recommended"],

  // svelte
  svelte.configs.recommended,
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    // See more details at: https://typescript-eslint.io/packages/parser/
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        svelteConfig,
      },
    },
  },

  // i didn't write the shadcn code so i don't care that much!
  {
    ignores: ["src/components/ui"],
  },

  // we need globals!
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
);
