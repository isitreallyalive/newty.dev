<script lang="ts">
  import { onMount } from "svelte";

  // dark mode themes - latte included in all
  import frappe from "@catppuccin/tailwindcss/frappe.css?url";
  import macchiato from "@catppuccin/tailwindcss/macchiato.css?url";
  import mocha from "@catppuccin/tailwindcss/mocha.css?url";
  import * as Select from "$lib/components/ui/select";
  import { writable } from "svelte/store";

  type Theme = "latte" | "frappe" | "macchiato" | "mocha";
  const themes: Theme[] = ["latte", "frappe", "macchiato", "mocha"];
  const urls: Record<Exclude<Theme, "latte">, string> = {
    frappe,
    macchiato,
    mocha,
  };
  let link: HTMLLinkElement;

  function detectTheme(): Theme {
    // saved preference wins
    const saved = localStorage.getItem("theme");
    if (saved) return saved as Theme;

    // prefers light or forced colours/high contrast -> light theme
    const forcedColours = window.matchMedia("(forced-colors: acive)").matches;
    const highContrast = window.matchMedia("(prefers-contrast: more)").matches;
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;

    if (prefersLight || forcedColours || highContrast) return "latte";
    else return "mocha"; // default to dark
  }

  function applyTheme(theme: Theme) {
    const dark = theme !== "latte";
    // update stylesheet
    link.href = dark ? urls[theme] : mocha;
    // update class
    const oldTheme = localStorage.getItem("theme");
    if (oldTheme) document.documentElement.classList.remove(oldTheme);
    document.documentElement.classList.add(theme);
    // store preference
    localStorage.setItem("theme", theme);
  }

  const theme = writable<Theme>();

  onMount(() => {
    console.log(detectTheme());
    theme.set(detectTheme());
    theme.subscribe(applyTheme);
  });
</script>

<!-- actually laod the necessary styles -->
<svelte:head>
  <link bind:this={link} rel="stylesheet" />
</svelte:head>

<!-- choose a theme :] -->
<Select.Root type="single" bind:value={$theme}>
  <Select.Trigger></Select.Trigger>
  <Select.Content>
    {#each themes as theme}
      <Select.Item value={theme}>{theme}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
