<script lang="ts">
  import { cn } from "$utils";
  import type { CollectionEntry } from "astro:content";
  import type { RepoData } from "$lib/projects";
  import { type Snippet } from "svelte";
  import RepoStats from "$components/project/RepoStats.svelte";
  import Commits from "$components/project/Commits.svelte";

  interface Props extends CollectionEntry<"projects"> {
    children: Snippet;
  }

  const { id, data, children } = $props() as Props;
  const { name, links } = data;
  const repo: Promise<RepoData> = fetch(`/api/projects/${id}`).then((res) =>
    res.json(),
  );
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

  <RepoStats {repo} />
</header>

<article>
  <section>
    {@render children()}
  </section>
  <section>
    <Commits {repo} />
  </section>
</article>

{#snippet link(href: string, clazz: string, label: string)}
  <li>
    <a {href} aria-label={label}>
      <span class={cn("iconify size-6", clazz)}></span>
    </a>
  </li>
{/snippet}
