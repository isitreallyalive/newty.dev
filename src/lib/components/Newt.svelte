<script lang="ts">
  import Accent from "$lib/components/Accent.svelte";

  interface Props {
    bold?: boolean;
  }

  const { bold = true }: Props = $props();
</script>

<Accent class={bold ? "font-semibold" : ""}>newt</Accent>
