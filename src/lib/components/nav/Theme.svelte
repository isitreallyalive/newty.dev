<script lang="ts">
  import { onMount } from "svelte";
  import * as Select from "$components/ui/select";
  import theme, {
    detectTheme,
    applyTheme,
    themes,
    mocha,
  } from "$lib/stores/theme";
  import type { FlavorName } from "@catppuccin/palette";
  import { cn } from "$lib/utils";

  interface Props {
    class?: string;
  }
  const { class: clazz } = $props() as Props;

  const emojis: Record<FlavorName, string> = {
    latte: "🌻",
    frappe: "🪴",
    macchiato: "🌺",
    mocha: "🌿",
  };

  let link: HTMLLinkElement;

  onMount(() => {
    theme.set(detectTheme());
    theme.subscribe((t) => applyTheme(t, link));
  });
</script>

<!-- actually laod the necessary styles -->
<svelte:head>
  <link bind:this={link} href={mocha} rel="stylesheet" />
</svelte:head>

<!-- choose a theme :] -->
<Select.Root type="single" bind:value={$theme}>
  <Select.Trigger rainbow class={cn("w-17 border-2", clazz)}>
    {emojis[$theme]}
  </Select.Trigger>
  <Select.Content>
    {#each themes as theme}
      <Select.Item value={theme}>{emojis[theme]} {theme}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
