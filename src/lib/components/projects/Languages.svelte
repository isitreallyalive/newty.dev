<script lang="ts" module>
  export interface Language {
    size: number;
    node: {
      color: string;
      name: string;
    };
  }
</script>

<script lang="ts">
  import theme, { colours } from "$lib/stores/theme";
  import { cn } from "$lib/utils";
  import { flavors } from "@catppuccin/palette";
  import nc from "nearest-color";

  interface Props {
    languages: Language[];
  }

  const { languages: data } = $props() as Props;
  const totalSize = data.reduce((acc, { size }) => acc + size, 0);

  const nearestColor = $derived(nc.from($colours));
  const languages = $derived(
    data.map(({ size, node }) => {
      const percentage = totalSize > 0 ? (size / totalSize) * 100 : 0;
      const colour = node.color || flavors[$theme].colors.text;
      return {
        accent: nearestColor(colour).name,
        name: node.name,
        percentage,
        formattedPercentage: percentage.toFixed(1),
      };
    }),
  );
</script>

<div class="not-prose my-4 space-y-2">
  <div class="flex h-2 w-full overflow-hidden rounded-full">
    {#each languages as { accent, percentage }}
      <div
        class={cn("h-full transition-all hover:opacity-80", `bg-${accent}`)}
        style="width: {percentage}%"
      ></div>
    {/each}
  </div>
  <ul class="flex gap-4 md:gap-8">
    {#each languages as { name, accent, percentage }}
      <li class="flex items-center gap-2 font-mono text-sm">
        <div
          class={cn("h-2 w-2 rounded-full", `bg-${accent}`)}
          aria-hidden="true"
        ></div>
        <span>{name}</span>
        <span class="text-muted-foreground">{percentage.toFixed(1)}%</span>
      </li>
    {/each}
  </ul>
</div>
