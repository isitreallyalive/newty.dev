<script lang="ts">
  import {
    PresetFlag,
    applyRing,
    applyOverlay,
    type Flag,
  } from "pride-overlay";
  import EnumSelect from "./EnumSelect.svelte";
  import OptionSlider from "./OptionSlider.svelte";
  import bert from "$img/bert.webp?url";
  import input from "$img/bert.webp?uint8array";

  enum Effect {
    Ring,
    Overlay,
  }

  // state
  let flag: Flag = $state(PresetFlag.Rainbow);
  let effect: Effect = $state(Effect.Overlay);
  let opacity: number = $state(0.5);
  let thickness: number = $state(0.1);

  // output
  let output = $derived(applyEffect(input));
  let outputUrl = $derived(URL.createObjectURL(new Blob([output])));

  function applyEffect(data: Uint8Array): Uint8Array {
    switch (effect) {
      case Effect.Ring:
        return applyRing(data, flag, opacity, thickness);
      case Effect.Overlay:
        return applyOverlay(data, flag, opacity);
    }
  }
</script>

<form class="grid grid-cols-2 grid-rows-2 gap-x-12">
  <!-- flag and effect -->
  <EnumSelect label="Flag" options={PresetFlag} bind:value={flag} />
  <EnumSelect label="Effect" options={Effect} bind:value={effect} />

  <!-- options -->
  <OptionSlider label="Opacity" bind:value={opacity} />
  {#if effect === Effect.Ring}
    <OptionSlider label="Thickness" bind:value={thickness} />
  {/if}
</form>

<div class="grid grid-cols-2 *:flex *:flex-col *:items-center **:my-2">
  <div>
    <p class="text-2xl font-bold">Before</p>
    <img src={bert} alt="Bert the dog, before pride-overlay" />
  </div>
  <div>
    <p class="text-2xl font-bold">After</p>
    <img src={outputUrl} alt="Bert the dog, after pride-overlay" />
  </div>
</div>
