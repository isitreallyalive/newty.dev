<script lang="ts">
  import Label from "$components/ui/label/label.svelte";
  import * as Select from "$components/ui/select";

  interface Props {
    label: string;
    options: Record<string, string>;
    value: string;
  }

  let { label, options, value = $bindable() } = $props() as Props;
  const id = label.toLowerCase();
  const entries = Object.entries(options).filter(([k]) => isNaN(Number(k)));
</script>

<div class="flex items-center gap-8">
  <Label for={id}>{label}</Label>
  <Select.Root type="single" bind:value>
    <Select.Trigger class="border-2">{options[value]}</Select.Trigger>
    <Select.Content>
      {#each entries as [key, value] (key)}
        <Select.Item class="hover:text-background hover:bg-accent" {value}
          >{key}</Select.Item
        >
      {/each}
    </Select.Content>
  </Select.Root>
</div>
