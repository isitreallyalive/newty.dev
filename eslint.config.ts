import { defineConfig } from "eslint/config";

import js from "@eslint/js";
import ts from "typescript-eslint";
import * as mdx from "eslint-plugin-mdx";
import astro from "eslint-plugin-astro";
import svelte from "eslint-plugin-svelte";

export default defineConfig(
  // languages
  js.configs.recommended,
  ts.configs.recommended,
  mdx.configs.flat,
  // astro + a11y
  astro.configs.recommended,
  //   a11y.flatConfigs.recommended,
  astro.configs["jsx-a11y-recommended"],
  // other
  svelte.configs.recommended,
);
