<script lang="ts">
  import { GITHUB_USERNAME } from "$lib/data";
  import type { CollectionEntry } from "astro:content";
  import { getRepoData } from "$lib/octokit";
  import accentStore from "$lib/stores/accent";
  import { cn } from "$lib/utils";

  type Props = CollectionEntry<"projects">;
  const { id, data } = $props() as Props;
  const { title, tagline, repo } = data;
  const [owner, repoName] = repo?.split("/") || [GITHUB_USERNAME, id];

  const accent = accentStore();

  interface RepoData {
    stargazerCount: number;
    languages: {
      nodes: { name: string }[];
    };
  }

  const {
    stargazerCount: stars,
    languages: { nodes },
  } = await getRepoData<RepoData>(
    { owner, name: repoName },
    `
stargazerCount,
languages(first: 1) {
  nodes {
    name
  }
}
    `,
    { stargazerCount: 0, languages: { nodes: [] } },
  );
  const language = nodes.map((lang) => lang.name);
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
    <div
      class="text-muted-foreground flex-col gap-4 text-right font-mono text-sm"
    >
      <div class="hover:text-yellow">{stars} star{stars === 1 ? "" : "s"}</div>
      <div>{language}</div>
    </div>
  </a>
</article>
