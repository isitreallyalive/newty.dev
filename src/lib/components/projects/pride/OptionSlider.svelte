<script lang="ts">
  import Label from "$lib/components/ui/label/label.svelte";
  import Slider from "$lib/components/ui/slider/slider.svelte";

  interface Props {
    label: string;
    value: number;
  }

  let { label, value = $bindable() } = $props() as Props;
  const id = label.toLowerCase();
</script>

<div class="flex items-center justify-between gap-8">
  <Label for={id}>{label}</Label>
  <Slider type="single" step={0.01} max={1} bind:value />
</div>
