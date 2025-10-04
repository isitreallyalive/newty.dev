<script lang="ts">
	import Icon from "@iconify/svelte";
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SelectPrimitive.ScrollDownButtonProps> = $props();
</script>

<SelectPrimitive.ScrollDownButton
	bind:ref
	data-slot="select-scroll-down-button"
	class={cn("flex justify-center items-center py-1 cursor-default", className)}
	{...restProps}
>
	<Icon icon="mdi:chevron-down" class="size-4" />
</SelectPrimitive.ScrollDownButton>
