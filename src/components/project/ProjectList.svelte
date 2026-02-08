<script lang="ts">
  import type { PartialRepoData } from "$lib/projects";
  import type { CollectionEntry } from "astro:content";

  interface Props {
    projects: CollectionEntry<"projects">[];
  }

  const { projects } = $props() as Props;
  projects.sort((a, b) => a.data.name.localeCompare(b.data.name));

  const extraInfo = fetch("/api/projects/list").then((res) =>
    res.json(),
  ) as Promise<{ [key: string]: PartialRepoData }>;
</script>

<div class="grid grid-cols-3 gap-6">
  {#each projects as { id, data: { name, tagline } } (id)}
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
          {#await extraInfo}
            <div class="flex items-center gap-2">
              <span class="iconify mdi--star text-yellow"></span>
              <div class="bg-card h-4 w-8 rounded"></div>
              <div class="bg-card h-4 w-12 rounded"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="bg-card size-2 rounded-full"></div>
              <div class="bg-card h-4 w-16 rounded"></div>
            </div>
          {:then extraInfo}
            {@const { stars, primaryLanguage: lang } = extraInfo[id]}
            <div class="flex items-center gap-2">
              <span class="iconify mdi--star text-yellow"></span>
              <span class="font-mono">{stars}</span>
              <span class="text-sm">star{stars === 1 ? "" : "s"}</span>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                style="background-color: {lang.colour}"
              ></span>
              <span class="font-mono text-sm">{lang.name}</span>
            </div>
          {/await}
        </div>
      </article>
    </a>
  {/each}
</div>
