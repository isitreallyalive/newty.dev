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
  import theme from "$lib/stores/theme";
  import { cn } from "$lib/utils";
  import { flavors } from "@catppuccin/palette";
  import nearest from "nearest-color";

  interface Props {
    languages: Language[];
  }

  const { languages: data } = $props() as Props;
  const totalSize = data.reduce((acc, { size }) => acc + size, 0);

  const colours = $derived(
    Object.fromEntries(
      flavors[$theme].colorEntries.map(([name, { hex }]) => [name, hex]),
    ),
  );
  const nearestColor = $derived(nearest.from(colours));
  const languages = $derived(
    data.map(({ size, node }) => {
      const percentage = totalSize > 0 ? (size / totalSize) * 100 : 0;
      return {
        accent: nearestColor(node.color).name,
        name: node.name,
        percentage,
        formattedPercentage: percentage.toFixed(1),
      };
    }),
  );
</script>

<div class="not-prose space-y-2">
  <div class="flex h-2 w-full overflow-hidden rounded-full">
    {#each languages as { accent, percentage }}
      <div
        class={cn("h-full transition-all hover:opacity-80", `bg-${accent}`)}
        style="width: {percentage}%"
      ></div>
    {/each}
  </div>
  <ul class="flex flex-wrap gap-2">
    {#each languages as { name, accent, percentage }}
      <li class="flex items-center gap-2 font-mono text-sm">
        <span
          class={cn("h-2 w-2 rounded-full", `bg-${accent}`)}
          aria-hidden="true"
        ></span>
        <span>{name}</span>
        <span class="text-muted-foreground">{percentage.toFixed(1)}%</span>
      </li>
    {/each}
  </ul>
</div>
