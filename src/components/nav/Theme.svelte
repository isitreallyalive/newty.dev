<script lang="ts">
  import * as Select from "$components/ui/select";
  import { theme, THEMES } from "$stores/theme";
  import type { FlavorName } from "@catppuccin/palette";

  const emojis: Record<FlavorName, string> = {
    latte: "🌻",
    frappe: "🪴",
    macchiato: "🌺",
    mocha: "🌿",
  };
</script>

<Select.Root type="single" bind:value={$theme}>
  <Select.Trigger class="w-17 border-2" accent>{emojis[$theme]}</Select.Trigger>
  <Select.Content>
    {#each THEMES as theme}
      <Select.Item value={theme}>{emojis[theme]} {theme}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
