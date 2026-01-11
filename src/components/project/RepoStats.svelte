<script lang="ts">
  import type { RepoData } from "$lib/projects";

  interface Props {
    repo: Promise<RepoData>;
  }

  const { repo } = $props() as Props;
</script>

{#await repo}
  <div class="my-4 space-y-2">
    <!-- bar skeleton -->
    <div
      class="bg-card flex h-2 animate-pulse overflow-hidden rounded-full"
    ></div>

    <div class="grid grid-cols-2 font-mono text-sm">
      <!-- legend skeleton -->
      <ul class="not-prose flex gap-4">
        {#each Array(2) as _}
          <li class="flex items-center gap-2">
            <div class="bg-card size-2 animate-pulse rounded-full"></div>
            <div class="bg-card h-4 w-16 animate-pulse rounded"></div>
            <div class="bg-card h-4 w-10 animate-pulse rounded"></div>
          </li>
        {/each}
      </ul>
      <!-- stats skeleton -->
      <ul class="not-prose flex gap-4 justify-self-end">
        {#each Array(3) as _}
          <li class="flex items-center gap-1">
            <div class="bg-card size-4 animate-pulse rounded"></div>
            <div class="bg-card h-4 w-8 animate-pulse rounded"></div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
{:then data}
  {@const totalSize = data.languages.reduce(
    (acc: number, { size }: { size: number }) => acc + size,
    0,
  )}
  {@const fullLang = data.languages.map(
    (language: RepoData["languages"][0]) => ({
      ...language,
      percentage: totalSize > 0 ? (language.size / totalSize) * 100 : 0,
    }),
  )}
  <div class="my-4 space-y-2">
    <!-- bar -->
    <div class="flex h-2 overflow-hidden rounded-full">
      {#each fullLang as { name, colour, percentage } (name)}
        <div
          class="transition-opacity hover:opacity-80"
          style={`width: ${percentage}%; background-color: ${colour}`}
        ></div>
      {/each}
    </div>

    <div class="grid grid-cols-2 font-mono text-sm">
      <!-- legend -->
      <ul class="not-prose flex gap-4">
        {#each fullLang as { name, colour, percentage } (name)}
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
          <a href={`${data.url}/stargazers`} class="group no-underline!">
            <span class="iconify mdi--star group-hover:text-yellow"></span>
            {data.stars}
          </a>
        </li>
        <li>
          <a href={`${data.url}/forks`} class="group no-underline!">
            <span
              class="iconify mdi--source-fork group-hover:text-muted-foreground"
            ></span>
            {data.forks}
          </a>
        </li>
        <li>
          <a
            href={`${data.url}/commits/${data.mainBranch}`}
            class="group no-underline!"
          >
            <span class="iconify mdi--history group-hover:text-muted-foreground"
            ></span>
            {data.commits.count}
          </a>
        </li>
      </ul>
    </div>
  </div>
{/await}
