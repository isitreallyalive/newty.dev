<script lang="ts">
  import { GITHUB_USERNAME } from "$lib/data";
  import type { CollectionEntry } from "astro:content";
  import { octokit } from "$lib";
  import Accent from "$components/Accent.svelte";
  import accentStore from "$lib/stores/accent";
  import { cn } from "$lib/utils";

  type Props = CollectionEntry<"projects">;
  const { id, data } = $props() as Props;
  const { title, tagline, repo } = data;

  const accent = accentStore();

  interface RepoData {
    stargazerCount: number;
    languages: {
      nodes: { name: string }[];
    };
  }

  let stars = $state(0);
  let language = $state("Unknown");

  if (import.meta.env.PROD) {
    (async () => {
      const { repository } = (await octokit.graphql(
        `
  query ($repo: String!, $owner: String!) {
    repository(name: $repo, owner: $owner) {
      stargazerCount,
      languages(first: 1) {
        nodes {
          name
        }
      }
    }
  }
`,
        {
          repo: repo ? repo.split("/")[1] : id,
          owner: repo ? repo.split("/")[0] : GITHUB_USERNAME,
        },
      )) as any;
      const {
        stargazerCount,
        languages: { nodes },
      } = repository as RepoData;
      stars = stargazerCount;
      language = nodes.map((lang) => lang.name)[0];
    })();
  }

  accent.subscribe(console.log);
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
