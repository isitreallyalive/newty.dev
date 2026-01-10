<script lang="ts">
  import accentStore from "$lib/stores/accent";
  import { cn } from "$utils";
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    duration?: number;
    class?: string;
  }

  const accent = accentStore();
  const { children, class: clazz, duration = 100 } = $props() as Props;
</script>

<span
  class={cn(
    `hover:text-${$accent} transition-colors duration-${duration}`,
    clazz,
  )}
  role="presentation"
  onmouseenter={() => accent.next()}
  onmouseleave={() => accent.next()}
>
  {@render children()}
</span>
