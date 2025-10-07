<script lang="ts">
  import { onMount } from "svelte";

  // dark mode themes - latte included in all
  import frappe from "@catppuccin/tailwindcss/frappe.css?url";
  import macchiato from "@catppuccin/tailwindcss/macchiato.css?url";
  import mocha from "@catppuccin/tailwindcss/mocha.css?url";
  import * as Select from "$lib/components/ui/select";
  import { writable } from "svelte/store";

  type Theme = "latte" | "frappe" | "macchiato" | "mocha";
  const urls: Record<Exclude<Theme, "latte">, string> = {
    frappe,
    macchiato,
    mocha,
  };
  const emojis: Record<Theme, string> = {
    latte: "🌻",
    frappe: "🪴",
    macchiato: "🌺",
    mocha: "🌿",
  };

  const themes: Theme[] = ["latte", "frappe", "macchiato", "mocha"];
  const theme = writable<Theme>();
  let link: HTMLLinkElement;

  // load the stylesheet and then swap into the svelte managed <link> element
  // prevents a flash of unstyled content
  function loadStylesheet(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const tmp = document.createElement("link");
      tmp.rel = "stylesheet";
      tmp.href = url;
      tmp.onload = () => {
        link.href = url;
        tmp.remove();
        resolve();
      };
      tmp.onerror = (e) => {
        tmp.remove();
        reject(e);
      };
      document.head.appendChild(tmp);
    });
  }

  function detectTheme(): Theme {
    // saved preference wins
    const saved = localStorage.getItem("theme");
    if (saved) return saved as Theme;

    // prefers light or forced colours/high contrast -> light theme
    const forcedColours = window.matchMedia("(forced-colors: acive)").matches;
    const highContrast = window.matchMedia("(prefers-contrast: more)").matches;
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;

    if (prefersLight || forcedColours || highContrast) return "latte";
    else return "mocha"; // default to dark
  }

  async function applyTheme(theme: Theme) {
    const dark = theme !== "latte";

    // update stylesheet
    const url = dark ? urls[theme] : mocha;
    if (link.href !== url) await loadStylesheet(url);

    // update class
    const oldTheme = localStorage.getItem("theme");
    if (oldTheme) document.documentElement.classList.remove(oldTheme);
    document.documentElement.classList.add(theme);

    // store preference
    localStorage.setItem("theme", theme);
  }

  onMount(() => {
    theme.set(detectTheme());
    theme.subscribe(applyTheme);
  });
</script>

<!-- actually laod the necessary styles -->
<svelte:head>
  <link bind:this={link} href={mocha} rel="stylesheet" />
</svelte:head>

<!-- choose a theme :] -->
<Select.Root type="single" bind:value={$theme}>
  <Select.Trigger rainbow class="w-17 border-2">
    {emojis[$theme]}
  </Select.Trigger>
  <Select.Content>
    {#each themes as theme}
      <Select.Item value={theme}>{emojis[theme]} {theme}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
