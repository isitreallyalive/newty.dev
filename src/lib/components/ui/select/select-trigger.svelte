<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  import Icon from "@iconify/svelte";
  import { cn, stopPropagation, type WithoutChild } from "$lib/utils.js";
  import { accentStore } from "$lib/stores/accent";
  import { onMount } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    rainbow = false,
    size = "default",
    ...restProps
  }: WithoutChild<SelectPrimitive.TriggerProps> & {
    size?: "sm" | "default";
    rainbow?: boolean;
  } = $props();

  function isOpen(): boolean {
    return ref?.ariaExpanded === "true";
  }

  const accent: ReturnType<typeof accentStore> | undefined = rainbow
    ? accentStore()
    : undefined;

  onMount(() => {
    if (!rainbow || !ref) return;
    const observer = new MutationObserver(() => {
      if (!isOpen()) accent?.clear();
    });
    observer.observe(ref, {
      attributes: true,
      attributeFilter: ["aria-expanded"],
    });
    return () => observer.disconnect();
  });
</script>

<SelectPrimitive.Trigger
  bind:ref
  data-slot="select-trigger"
  data-size={size}
  onmouseenter={() => {
    if (rainbow && !isOpen()) accent?.next();
  }}
  onmouseleave={() => {
    if (rainbow && !isOpen()) accent?.clear();
  }}
  class={cn(
    `border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring border focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 shadow-xs flex w-fit select-none items-center justify-between gap-1 whitespace-nowrap rounded-md bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0`,
    rainbow ? `border-${$accent}` : "hover:border-accent",
    className
  )}
  {...restProps}
>
  {@render children?.()}
  <span
    onmousedown={stopPropagation}
    onclick={stopPropagation}
    tabindex="-1"
    role="presentation"
  >
    <Icon icon="mdi:chevron-down" class="opacity-50 size-4" />
  </span>
</SelectPrimitive.Trigger>
