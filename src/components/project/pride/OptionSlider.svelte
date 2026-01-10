<script lang="ts">
  import Label from "$components/ui/label/label.svelte";
  import Slider from "$components/ui/slider/slider.svelte";

  interface Props {
    label: string;
    value: number;
  }

  let { label, value = $bindable() } = $props() as Props;
  const id = label.toLowerCase();
</script>

<div class="flex items-center gap-4">
  <Label for={id}>{label}</Label>
  <Slider type="single" step={0.01} max={1} bind:value />
  <p class="not-prose text-muted-foreground w-[4ch] text-sm">
    {(value * 100).toFixed(0)}%
  </p>
</div>
