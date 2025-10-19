<script lang="ts">
  import type { Snippet } from "svelte";
  import accentStore from "$lib/stores/accent";

  interface Props {
    children: Snippet;
    class?: string;
  }

  const { children, class: clazz }: Props = $props();
  const accent = accentStore();
  const classList = clazz?.split(" ") ?? [];
</script>

<span
  role="presentation"
  onmouseenter={() => accent.next()}
  onmouseleave={() => accent.clear()}
  class={[$accent ? `text-${$accent}` : "", "transition-colors", ...classList]}
>
  {@render children()}
</span>
