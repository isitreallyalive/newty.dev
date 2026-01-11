<script lang="ts">
  import type { PartialRepoData } from "$lib/projects";
  import type { CollectionEntry } from "astro:content";
  import { onMount } from "svelte";

  interface Props {
    projects: (CollectionEntry<"projects">["data"] & { id: string })[];
  }

  const { projects } = $props() as Props;
  let data = $state<{ [id: string]: PartialRepoData } | null>(null);

  // merge static project data with fetched github data
  const fullProjects = $derived.by(() => {
    return projects.map((project) => ({
      ...project,
      ...(data?.[project.id] || {}),
    }));
  });

  onMount(async () => {
    try {
      const response = await fetch(`/api/projects/list`);
      if (response.ok) {
        data = await response.json();
      }
    } catch (error) {
      console.error("Failed to fetch project list:", error);
    }
  });
</script>

<div class="grid grid-cols-3 gap-6">
  {#each fullProjects as { id, name, tagline, stars, primaryLanguage: lang }}
    <a href={`/projects/${id}`} class="text-inherit">
      <article
        class="bg-crust flex flex-col justify-between rounded-lg p-4 shadow-md"
      >
        <div>
          <h2 class="mt-0! text-lg font-bold">{name}</h2>
          <p class="text-muted-foreground mt-2 font-mono text-sm">{tagline}</p>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="iconify mdi--star text-yellow"></span>
            {#if stars}
              <span class="font-mono">{stars}</span>
            {:else}
              <span class="font-mono">???</span>
            {/if}
            <span class="text-sm">stars</span>
          </div>
          {#if lang}
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                style={`background-color: ${lang.colour}`}
              ></span>
              <span class="font-mono text-sm">{lang.name}</span>
            </div>
          {/if}
        </div>
      </article>
    </a>
  {/each}
</div>
