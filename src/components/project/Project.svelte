<script lang="ts">
  import { cn } from "$utils";
  import type { CollectionEntry } from "astro:content";
  import type { RepoData } from "$lib/projects";
  import { onMount, type Snippet } from "svelte";
  import RepoStats from "$components/project/RepoStats.svelte";
  import Commits from "$components/project/Commits.svelte";

  interface Props extends CollectionEntry<"projects"> {
    children: Snippet;
  }

  const { id, data, children } = $props() as Props;
  const { name, links } = data;

  let repo = $state<RepoData | null>(null);

  // fetch full repo data on mount
  onMount(async () => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (response.ok) {
        repo = await response.json();
      }
    } catch (error) {
      console.error(`Failed to fetch repo data for ${id}:`, error);
    }
  });
</script>

<header>
  <div class="grid grid-cols-2">
    <h1 class="font-mono">{name}</h1>
    <ul class="not-prose flex items-center gap-4 justify-self-end">
      {#if links.github}
        {@render link(
          `https://github.com/${links.github}`,
          "mdi--github hover:text-black dark:hover:text-white",
          "GitHub",
        )}
      {/if}
      {#if links["crates.io"]}
        {@render link(
          `https://crates.io/crates/${links["crates.io"]}`,
          "catppuccin--cargo hover:text-peach",
          "crates.io",
        )}
      {/if}
      {#if links.npm}
        {@render link(
          `https://www.npmjs.com/package/${links.npm}`,
          "simple-icons--npm hover:text-red",
          "npm",
        )}
      {/if}
    </ul>
  </div>

  {#if repo}
    <RepoStats
      url={repo.url}
      stars={repo.stars}
      forks={repo.forks}
      languages={repo.languages}
      mainBranch={repo.mainBranch}
      commits={repo.commits}
    />
  {/if}
</header>

<article>
  <section>
    {@render children()}
  </section>
  <section>
    {#if repo}
      <Commits sample={repo.commits.sample} />
    {/if}
  </section>
</article>

{#snippet link(href: string, clazz: string, label: string)}
  <li>
    <a {href} aria-label={label}>
      <span class={cn("iconify size-6", clazz)}></span>
    </a>
  </li>
{/snippet}
