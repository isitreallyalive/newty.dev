<script lang="ts">
  import { cn } from "$lib/utils";
  import { persistentAtom } from "@nanostores/persistent";

  interface Props {
    class?: string;
  }

  const { class: clazz } = $props() as Props;

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
  class={cn([
    "relative font-mono text-sm font-bold -tracking-[0.125em] transition-colors select-none hover:cursor-pointer hover:brightness-125 sm:text-base md:text-lg",
    !$enabled ? "text-muted-foreground" : "",
    clazz,
  ])}
  onclick={() => ($enabled = !$enabled)}
  aria-label="Toggle cat"
>
  {#if !$enabled}
    <div
      class="pointer-events-none absolute -top-3 -right-6 motion-safe:animate-bounce"
    >
      zzz
    </div>
  {/if}
  <div>/\_/\</div>
  <div>
    ( {eye}.{eye} )
  </div>
  <div>&gt; ^ &lt;</div>
</button>
