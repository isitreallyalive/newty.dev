<script lang="ts">
  import { GITHUB_USERNAME } from "$lib/data";
  import type { CollectionEntry } from "astro:content";
  import { getRepoData } from "$lib/octokit";
  import accentStore from "$lib/stores/accent";
  import { cn } from "$lib/utils";
  import type { Language } from "$components/projects/Languages.svelte";
  import Icon from "@iconify/svelte";
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
    { stargazerCount: 0, languages: { nodes: [] } },
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
  <a class="flex justify-between" href={`/projects/${id}`}>
    <div>
      <h3>{title}</h3>
      <p class="text-muted-foreground font-mono">{tagline}</p>
    </div>
    <ul
      class="text-muted-foreground not-prose flex-col gap-4 font-mono text-sm"
    >
      <li class="hover:text-yellow">
        <Icon icon="mdi:star" />
        {stars} star{stars === 1 ? "" : "s"}
      </li>
      <li class="flex items-center gap-2">
        <div class={cn("h-2 w-2 rounded-full", `bg-${languageColor}`)}></div>
        <span>{languages[0].name}</span>
      </li>
    </ul>
  </a>
</article>
