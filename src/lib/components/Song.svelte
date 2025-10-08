<script lang="ts">
  import { DISCORD_ID } from "$lib/data";
  import { useLanyard } from "svelte-lanyard";
  import { derived, readable } from "svelte/store";

  const data = useLanyard(DISCORD_ID);

  const isPlaying = derived(data, (d) => !!d?.spotify);
  const song = derived(data, (d) => d?.spotify?.song ?? "");
  // only first artist if multiple
  const artist = derived(
    data,
    (d) => d?.spotify?.artist?.split(";")?.[0] ?? "",
  );

  // format milliseconds to M:SS
  const fmt = (ms: number) => {
    if (!Number.isFinite(ms) || ms <= 0) return "0:00";
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  // total length of song
  const total = derived(data, (d) => {
    const ts = d?.spotify?.timestamps;
    if (!ts || typeof ts.start !== "number" || typeof ts.end !== "number")
      return "";
    return fmt(ts.end - ts.start);
  });

  // current position in song
  const curr = readable("", (set) => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let currentStart = 0;
    let currentEnd = 0;

    const clearTimer = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const updateOnce = () => {
      const now = Date.now();
      const duration = currentEnd - currentStart;
      if (duration <= 0) {
        set("");
        clearTimer();
        return;
      }
      let pos = now - currentStart;
      if (pos < 0) pos = 0;
      if (pos >= duration) {
        pos = duration;
        set(fmt(pos));
        clearTimer();
        return;
      }
      set(fmt(pos));
    };

    const unsubscribe = data.subscribe((d: any) => {
      const ts = d?.spotify?.timestamps;
      const hasTimestamps =
        ts && typeof ts.start === "number" && typeof ts.end === "number";

      if (!hasTimestamps || !d?.spotify) {
        currentStart = 0;
        currentEnd = 0;
        set("");
        clearTimer();
        return;
      }

      // if timestamps changed (new song or seek), update them
      if (ts.start !== currentStart || ts.end !== currentEnd) {
        currentStart = ts.start;
        currentEnd = ts.end;
      }

      // set immediately and ensure an interval updates it
      updateOnce();
      if (!interval) {
        interval = setInterval(updateOnce, 500);
      }
    });

    return () => {
      unsubscribe();
      clearTimer();
    };
  });
</script>

{#if $isPlaying}
  <p>{$song} by {$artist} ({$curr} / {$total})</p>
{/if}
