<script lang="ts">
  import type { RepoData } from "$lib/projects";
  import { formatDistanceToNowStrict } from "date-fns";
  import bert from "$img/bert.webp?url";

  interface Props {
    repo: Promise<RepoData>;
  }

  const COLOURS = [
    "border-mauve",
    "border-pink",
    "border-teal",
    "border-peach",
    "border-lavender",
  ];

  const { repo } = $props() as Props;

  // shuffle for variety
  COLOURS.sort(() => Math.random() - 0.5);
</script>

{#await repo}
  <ul class="not-prose flex flex-col gap-4">
    {#each Array(3) as _, i}
      <li
        class="bg-crust border-surface0 flex items-center gap-2 overflow-hidden rounded-lg border-l-4 p-2"
      >
        <div
          class="bg-surface0 row-span-2 size-12 animate-pulse rounded-full"
        ></div>
        <div class="grid flex-1 grid-rows-2 gap-1">
          <div class="bg-surface0 h-5 w-3/4 animate-pulse rounded"></div>
          <div class="flex items-center gap-2">
            <div class="bg-surface0 h-4 w-24 animate-pulse rounded"></div>
            <span class="text-muted-foreground">•</span>
            <div class="bg-surface0 h-4 w-16 animate-pulse rounded"></div>
            <span class="text-muted-foreground">•</span>
            <div class="bg-surface0 h-4 w-20 animate-pulse rounded"></div>
          </div>
        </div>
      </li>
    {/each}
  </ul>
{:then { commits: { sample: commits } }}
  <ul class="not-prose flex flex-col gap-4">
    {#each commits as { author: { name: authorName, avatar, url: authorUrl }, message, hash, date, url }, i (hash)}
      <li
        class="bg-crust transition- flex items-center gap-2 overflow-hidden rounded-lg border-l-4 p-2 {COLOURS[
          i % COLOURS.length
        ]}"
      >
        <img
          src={avatar || bert}
          alt={authorName}
          class="row-span-2 size-12 rounded-full select-none"
        />
        <div class="grid grid-rows-2">
          <p class="text-text">{message}</p>
          <div class="flex items-center gap-2 text-sm">
            <a
              href={authorUrl}
              class="text-accent hover:text-accent/80 no-underline"
              >{authorName}</a
            >
            <span class="text-muted-foreground">•</span>
            <a
              href={url}
              class="text-mauve hover:bg-mauve/40 bg-mauve/20 rounded-lg px-1.5 py-0.5 font-mono text-xs no-underline transition-colors duration-200"
            >
              {hash}
            </a>
            <span class="text-muted-foreground">•</span>
            <span class="text-muted-foreground" title={date.toLocaleString()}>
              {formatDistanceToNowStrict(date, { addSuffix: true })}
            </span>
          </div>
        </div>
      </li>
    {/each}
  </ul>
{/await}
