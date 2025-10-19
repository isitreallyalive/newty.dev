<script lang="ts">
  import { Progress as ProgressPrimitive } from "bits-ui";
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  let {
    ref = $bindable(null),
    class: className,
    max = 100,
    value,
    ...restProps
  }: WithoutChildrenOrChild<ProgressPrimitive.RootProps> = $props();

  const clamp = (n: number, min = 0, max = 100) =>
    Math.min(Math.max(n, min), max);
  const pct = (
    val: number | undefined | null,
    m: number | undefined | null,
  ) => {
    const v = typeof val === "number" ? val : 0;
    const mm = typeof m === "number" && m !== 0 ? m : 1;
    return clamp((100 * v) / mm);
  };

  const progress = tweened(pct(value, max), {
    duration: 500,
    easing: cubicOut,
  });

  $effect(() => {
    progress.set(pct(value, max));
  });
</script>

<ProgressPrimitive.Root
  bind:ref
  data-slot="progress"
  class={cn(
    "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
    className,
  )}
  {value}
  {max}
  {...restProps}
>
  <div
    data-slot="progress-indicator"
    class="bg-primary h-full w-full flex-1"
    style="will-change: transform; transform: translate3d(-{100 -
      $progress}%, 0, 0)"
  ></div>
</ProgressPrimitive.Root>
