<script lang="ts">
  import { DISCORD_ID } from "$lib/data";
  import { useLanyard } from "svelte-lanyard";
  import { derived, readable } from "svelte/store";
  import Progress from "$components/ui/progress/progress.svelte";
  import { GITHUB_USERNAME } from "$lib/data";

  const data = useLanyard(DISCORD_ID);

  const isPlaying = derived(data, (d) => !!d?.spotify);
  const song = derived(data, (d) => d?.spotify?.song ?? "");
  const href = derived(data, (d) =>
    d?.spotify ? `https://open.spotify.com/track/${d.spotify.track_id}` : "#",
  );
  // only first artist if multiple
  const artist = derived(
    data,
    (d) => d?.spotify?.artist?.split(";")?.[0] ?? "",
  );
  const albumName = derived(data, (d) => d?.spotify?.album ?? "");
  const albumArt = derived(data, (d) => d?.spotify?.album_art_url ?? "");

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

  // current position in song (formatted)
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

      if (ts.start !== currentStart || ts.end !== currentEnd) {
        currentStart = ts.start;
        currentEnd = ts.end;
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
</script>

<div class="not-prose relative select-none">
  {#if $isPlaying}
    <div class="flex items-center gap-4 sm:gap-5">
      <div class="relative">
        <img
          class="h-20 w-20 animate-[spin_8s_linear_infinite] rounded-full sm:h-24 sm:w-24"
          src={$albumArt}
          alt={$albumName}
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
          {$song}
        </a>
        <p class="text-muted-foreground truncate text-sm">{$artist}</p>

        <div class="mt-3">
          <Progress value={convertTime($curr)} max={convertTime($total)} />
          <div class="text-muted-foreground mt-1 text-xs tabular-nums">
            {$curr} / {$total}
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="flex items-center gap-4 sm:gap-5">
      <div class="relative">
        <img
          class="h-20 w-20 animate-[spin_8s_linear_infinite] rounded-full sm:h-24 sm:w-24"
          src={`https://github.com/${GITHUB_USERNAME}.png`}
          alt={$albumName}
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
