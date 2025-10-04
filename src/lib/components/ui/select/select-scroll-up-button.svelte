<script lang="ts">
	import Icon from "@iconify/svelte";
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps> = $props();
</script>

<SelectPrimitive.ScrollUpButton
	bind:ref
	data-slot="select-scroll-up-button"
	class={cn("flex justify-center items-center py-1 cursor-default", className)}
	{...restProps}
>
	<Icon icon="mdi:chevron-up" class="size-4" />
</SelectPrimitive.ScrollUpButton>
