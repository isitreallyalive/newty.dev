<script lang="ts">
  import type { RepoData } from "src/pages/api/projects/[id]";
  import { formatDistanceToNowStrict } from "date-fns";
  import bert from "$img/bert.webp?url";

  const { sample: commits } = $props() as RepoData["commits"];
  const colors = [
    "border-mauve",
    "border-pink",
    "border-teal",
    "border-peach",
    "border-lavender",
  ];

  // shuffle colors to add variety
  colors.sort(() => Math.random() - 0.5);
</script>

<ul class="not-prose flex flex-col gap-4">
  {#each commits as { author: { name: authorName, avatar, url: authorUrl }, message, hash, date, url }, i}
    <li
      class="bg-crust transition- flex items-center gap-2 overflow-hidden rounded-lg border-l-4 p-2 {colors[
        i % colors.length
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
