<script lang="ts">
  import type { RepoData } from "$lib/projects";

  let {
    url,
    stars,
    forks,
    languages,
    mainBranch,
    commits,
  }: {
    url: string;
    stars: number;
    forks: number;
    languages: RepoData["languages"];
    mainBranch: string;
    commits: RepoData["commits"];
  } = $props();

  const totalSize = languages.reduce(
    (acc: number, { size }: { size: number }) => acc + size,
    0,
  );
  const fullLang = languages.map((language: RepoData["languages"][0]) => ({
    ...language,
    percentage: totalSize > 0 ? (language.size / totalSize) * 100 : 0,
  }));
</script>

<div class="my-4 space-y-2">
  <!-- bar -->
  <div class="flex h-2 overflow-hidden rounded-full">
    {#each fullLang as { size, colour, percentage }}
      <div
        class="transition-opacity hover:opacity-80"
        style={`width: ${percentage}%; background-color: ${colour}`}
      ></div>
    {/each}
  </div>

  <div class="grid grid-cols-2 font-mono text-sm">
    <!-- legend -->
    <ul class="not-prose flex gap-4">
      {#each fullLang as { name, colour, percentage }}
        <li class="flex items-center gap-2">
          <div
            class="size-2 rounded-full"
            style={`background-color: ${colour}`}
          ></div>
          {name}
          <span class="text-muted-foreground">{percentage.toFixed(1)}%</span>
        </li>
      {/each}
    </ul>
    <!-- stats -->
    <ul class="not-prose flex gap-4 justify-self-end">
      <li>
        <a href={`${url}/stargazers`} class="group no-underline!">
          <span class="iconify mdi--star group-hover:text-yellow"></span>
          {stars}
        </a>
      </li>
      <li>
        <a href={`${url}/forks`} class="group no-underline!">
          <span
            class="iconify mdi--source-fork group-hover:text-muted-foreground"
          ></span>
          {forks}
        </a>
      </li>
      <li>
        <a href={`${url}/commits/${mainBranch}`} class="group no-underline!">
          <span class="iconify mdi--history group-hover:text-muted-foreground"
          ></span>
          {commits.count}
        </a>
      </li>
    </ul>
  </div>
</div>
