<script lang="ts">
  import { persistentAtom } from "@nanostores/persistent";

  // state
  const enabled = persistentAtom<boolean>("cat", false, {
    encode: JSON.stringify,
    decode: JSON.parse,
  });
  let open = $state(true);
  const eye = $derived($enabled ? (open ? "o" : "~") : "u");

  // open and close eyes
  let interval: ReturnType<typeof setInterval>;

  $effect(() => {
    if ($enabled) {
      interval = setInterval(() => {
        open = !open;
      }, 1000);
    } else {
      clearInterval(interval);
      open = true;
    }
  });
</script>

<button
  class="relative font-mono font-bold text-sm sm:text-base -tracking-[0.125em] transition-colors select-none hover:cursor-pointer hover:brightness-125 {!$enabled
    ? 'text-muted-foreground'
    : ''}"
  onclick={() => ($enabled = !$enabled)}
  aria-label="Toggle cat"
>
  {#if !$enabled}
    <div class="-right-8 absolute motion-safe:animate-bounce">zzz</div>
  {/if}
  <div>/\_/\</div>
  <div>
    ( {eye}.{eye} )
  </div>
  <div>&gt; ^ &lt;</div>
</button>
