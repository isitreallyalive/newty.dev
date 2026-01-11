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
  const {
    name,
    links: { github, "crates.io": crates, npm },
  } = data;

  let repo = $state<RepoData | null>(null);

  onMount(async () => {
    repo = await fetch(`/api/projects/${id}`).then((res) => res.json());
  });
</script>

<header>
  <div class="grid grid-cols-2">
    <h1 class="font-mono">{name}</h1>
    <!-- social links -->
    <ul class="not-prose flex items-center gap-4 justify-self-end">
      {#if github}
        {@render link(
          `https://github.com/${github}`,
          "mdi--github hover:text-black dark:hover:text-white",
          "GitHub",
        )}
      {/if}
      {#if crates}
        {@render link(
          `https://crates.io/crates/${crates}`,
          "catppuccin--cargo hover:text-peach",
          "crates.io",
        )}
      {/if}
      {#if npm}
        {@render link(
          `https://www.npmjs.com/package/${npm}`,
          "simple-icons--npm hover:text-red",
          "npm",
        )}
      {/if}
    </ul>
  </div>

  {#if repo}
    <RepoStats {...repo} />
  {/if}
</header>

<article>
  <section>
    {@render children()}
  </section>
  <section>
    {#if repo}
      <Commits {...repo.commits} />
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
