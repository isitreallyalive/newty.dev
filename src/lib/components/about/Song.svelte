<script lang="ts">
  import { DISCORD_ID } from "$lib/data";
  import { useLanyard } from "svelte-lanyard";
  import {
    derived,
    readable,
    writable,
    type Readable,
    type Writable,
  } from "svelte/store";
  import Progress from "$components/ui/progress/progress.svelte";
  import { onMount } from "svelte";
  type LanyardData =
    ReturnType<typeof useLanyard> extends Readable<infer T> ? T : never;

  async function fetchRest(): Promise<LanyardData["spotify"]> {
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
    );
    const data = await response.json();
    return data?.data?.spotify as LanyardData["spotify"];
  }

  const data: Writable<LanyardData["spotify"] | null> = writable(
    await fetchRest(),
  );

  const isPlaying = derived(data, (d) => d !== null);
  const href = derived(data, (d) =>
    d?.track_id ? `https://open.spotify.com/track/${d.track_id}` : "#",
  );
  // only first artist if multiple
  const artist = derived(data, (d) => d?.artist?.split(";")?.[0] ?? "");

  // format milliseconds to M:SS
  const fmt = (ms: number) => {
    if (!Number.isFinite(ms) || ms <= 0) return "0:00";
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  // total length of song
  const total = derived(data, (d) => {
    const ts = d?.timestamps;
    if (!ts || typeof ts.start !== "number" || typeof ts.end !== "number")
      return "";
    return fmt(ts.end - ts.start);
  });

  // current position in song
  const current = readable("", (set) => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let start = 0;
    let end = 0;

    const clearTimer = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const updateOnce = () => {
      const now = Date.now();
      const duration = end - start;
      if (duration <= 0) {
        set("");
        clearTimer();
        return;
      }
      let pos = now - start;
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
      const ts = d?.timestamps;
      const hasTimestamps =
        ts && typeof ts.start === "number" && typeof ts.end === "number";

      if (!hasTimestamps || !isPlaying) {
        // Changed $isPlaying to isPlaying
        start = 0;
        end = 0;
        set("");
        clearTimer();
        return;
      }

      if (ts.start !== start || ts.end !== end) {
        start = ts.start;
        end = ts.end;
      }

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

  function convertTime(time: string) {
    if (!time) return 0;

    const parts = time.split(":").map(Number);
    let seconds = 0;

    if (parts.length === 3) {
      // hh:mm:ss
      const [h, m, s] = parts;
      seconds = h * 3600 + m * 60 + s;
    } else if (parts.length === 2) {
      // mm:ss
      const [m, s] = parts;
      seconds = m * 60 + s;
    } else if (parts.length === 1) {
      // ss
      seconds = parts[0];
    }

    return seconds;
  }

  onMount(() => {
    const lanyard = useLanyard(DISCORD_ID);
    lanyard.subscribe((value) => {
      if (value === undefined) return;
      data.set(value.spotify);
    });
  });
</script>

<div class="not-prose relative select-none">
  {#if $isPlaying}
    <div class="flex items-center gap-4 sm:gap-5">
      <div class="relative">
        <img
          class="h-20 w-20 animate-[spin_8s_linear_infinite] rounded-full sm:h-24 sm:w-24"
          src={$data?.album_art_url}
          alt={$data?.album}
          decoding="async"
          loading="lazy"
        />
      </div>

      <div class="min-w-0 flex-1">
        <div class="text-accent text-xs tracking-wide uppercase">
          Now Playing
        </div>
        <a
          href={$href}
          class="hover:text-accent mt-1 truncate text-base font-semibold"
        >
          {$data?.song}
        </a>
        <p class="text-muted-foreground truncate text-sm">{$artist}</p>

        <div class="mt-3">
          <Progress value={convertTime($current)} max={convertTime($total)} />
          <div class="text-muted-foreground mt-1 text-xs tabular-nums">
            {$current} / {$total}
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="flex items-center gap-4 sm:gap-5">
      <div class="relative">
        <img
          class="h-20 w-20 animate-[spin_8s_linear_infinite] rounded-full sm:h-24 sm:w-24"
          src="/bert.webp"
          alt="bert :3c"
          decoding="async"
          loading="lazy"
        />
      </div>

      <div class="min-w-0 flex-1">
        <div class="text-accent text-xs tracking-wide uppercase">
          Not Playing
        </div>
        <div class="mt-1 truncate text-base font-semibold">
          I'm not listening to anything right now.
        </div>
      </div>
    </div>
  {/if}
</div>
