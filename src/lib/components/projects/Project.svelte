<script lang="ts">
  import { GITHUB_USERNAME } from "$lib/data";
  import type { CollectionEntry } from "astro:content";
  import { getRepoData } from "$lib/octokit";
  import accentStore from "$lib/stores/accent";
  import { cn } from "$lib/utils";
  import type { Language } from "$components/projects/Languages.svelte";
  import nc from "nearest-color";
  import { colours } from "$lib/stores/theme";

  type Props = CollectionEntry<"projects">;
  const { id, data } = $props() as Props;
  const { title, tagline, repo } = data;
  const [owner, repoName] = repo?.split("/") || [GITHUB_USERNAME, id];

  const accent = accentStore();
  const nearestColor = $derived(nc.from($colours));

  interface RepoData {
    stargazerCount: number;
    languages: {
      nodes: Language["node"][];
    };
  }

  const {
    stargazerCount: stars,
    languages: { nodes: languages },
  } = await getRepoData<RepoData>(
    { owner, name: repoName },
    `
stargazerCount
languages(first: 1) {
  nodes {
    name
    color
  }
}
    `,
    {
      stargazerCount: 0,
      languages: { nodes: [{ name: "Rust", color: "#dea584" }] },
    },
  );

  const languageColor = $derived(
    languages[0] ? nearestColor(languages[0].color)?.name : undefined,
  );
</script>

<article
  class={cn(
    "prose-headings:my-0 prose-p:my-0 text-muted-foreground w-full rounded-xl border-2 p-4 transition-colors duration-200 hover:shadow-2xl",
    `border-${$accent}`,
  )}
  onmouseenter={() => accent.next()}
  onmouseleave={() => accent.clear()}
>
  <a class="flex flex-col justify-between md:flex-row" href={`/projects/${id}`}>
    <div class="mb-4 md:mb-0">
      <h3 class="font-heading text-lg font-bold md:text-xl">{title}</h3>
      <p class="text-muted-foreground font-mono text-sm md:text-base">
        {tagline}
      </p>
    </div>
    <ul
      class="text-muted-foreground not-prose flex items-end justify-between gap-1 text-right font-mono text-sm *:flex *:items-center *:gap-1 md:flex-col md:justify-start"
    >
      <li class="hover:text-yellow">
        <span class="iconify mdi--star"></span>
        {stars} star{stars === 1 ? "" : "s"}
      </li>
      <li>
        <div
          class={cn("mr-1 h-2 w-2 rounded-full", `bg-${languageColor}`)}
        ></div>
        {languages[0].name}
      </li>
    </ul>
  </a>
</article>
