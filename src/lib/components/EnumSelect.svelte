<script lang="ts">
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";

  interface Props {
    label: string;
    enum: Record<string, string>;
    value: string;
  }

  let { label, enum: enumObj, value = $bindable() } = $props() as Props;
  const id = label.toLowerCase();
  const entries = Object.entries(enumObj).filter(([k, _]) => isNaN(Number(k)));
</script>

<div class="flex">
  <Label for={id} class="w-12 pr-4 text-right">{label}</Label>
  <Select.Root type="single" bind:value>
    <Select.Trigger class="w-24">{enumObj[value]}</Select.Trigger>
    <Select.Content>
      {#each entries as [key, value]}
        <Select.Item class="hover:text-background hover:bg-accent" {value}
          >{key}</Select.Item
        >
      {/each}
    </Select.Content>
  </Select.Root>
</div>
