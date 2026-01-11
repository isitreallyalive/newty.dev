<script lang="ts">
  import type { CollectionEntry } from "astro:content";

  interface Props {
    projects: CollectionEntry<"projects">[];
  }

  const { projects: projectList } = $props() as Props;

  const projects = fetch("/api/projects/list")
    .then((res) => res.json())
    .then((res) =>
      projectList.map((project) => {
        return {
          id: project.id,
          ...project.data,
          ...(res?.[project.id] || {}),
        };
      }),
    );
</script>

{#await projects}
  <div class="grid grid-cols-3 gap-6">
    {#each projectList as _}
      {@render projectSkeleton()}
    {/each}
  </div>
{:then projectsData}
  <div class="grid grid-cols-3 gap-6">
    {#each projectsData as { id, name, tagline, stars, primaryLanguage: lang } (id)}
      <a href={`/projects/${id}`} class=" after:bg-accent text-inherit">
        <article
          class="bg-crust flex flex-col justify-between rounded-lg p-4 shadow-md"
        >
          <div>
            <h2 class="mt-0! text-lg font-bold">{name}</h2>
            <p class="text-muted-foreground mt-2 font-mono text-sm">
              {tagline}
            </p>
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
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                style="background-color: {lang.colour}"
              ></span>
              <span class="font-mono text-sm">{lang.name}</span>
            </div>
          </div>
        </article>
      </a>
    {/each}
  </div>
{/await}

{#snippet projectSkeleton()}
  <div
    class="bg-crust flex animate-pulse flex-col justify-between rounded-lg p-4 shadow-md"
  >
    <div>
      <div class="bg-surface0 h-6 w-3/4 rounded"></div>
      <div class="bg-surface0 mt-2 h-4 w-full rounded"></div>
      <div class="bg-surface0 mt-1 h-4 w-2/3 rounded"></div>
    </div>
    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="bg-surface0 size-4 rounded"></div>
        <div class="bg-surface0 h-4 w-8 rounded"></div>
        <div class="bg-surface0 h-4 w-12 rounded"></div>
      </div>
      <div class="flex items-center gap-2">
        <div class="bg-surface0 size-2 rounded-full"></div>
        <div class="bg-surface0 h-4 w-16 rounded"></div>
      </div>
    </div>
  </div>
{/snippet}
