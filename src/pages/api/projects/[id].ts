import type { Language } from "$components/project/RepoStats.svelte";
import { GITHUB_USERNAME } from "$data";
import fetchGithub from "$lib/utils/projects/github";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = false;

// config
export const LANGUAGE_COUNT = 3;
export const COMMIT_COUNT = 5;

export interface RepoData {
  url: string;
  stars: number;
  forks: number;
  languages: Language[];
  mainBranch: string;
  commits: {
    count: number;
    sample: {
      message: string;
      url: string;
      hash: string;
      date: Date;
      author: {
        name: string;
        avatar: string;
        url: string;
      };
    }[];
  };
}

const projects = await getCollection("projects");

export const GET: APIRoute = async ({ params }) => {
  // find the project
  const { id } = params;
  const project = projects.find((p) => p.id === id);
  if (!project) {
    return new Response(null, {
      status: 404,
      statusText: "Project not found",
    });
  }

  // determine where to fetch data from
  // for now, only github is supported so we'll just get that
  const url = project.data.links.github!;

  // if in development, return mock data
  // otherwise, fetch from github
  const data = import.meta.env.PROD
    ? await fetchGithub(url)
    : {
        url,
        stars: Math.floor(Math.random() * 1000),
        forks: Math.floor(Math.random() * 100),
        languages: [
          { name: "JavaScript", colour: "#f1e05a", size: 50000 },
          { name: "TypeScript", colour: "#2b7489", size: 30000 },
          { name: "HTML", colour: "#e34c26", size: 20000 },
        ],
        mainBranch: "main",
        commits: {
          count: Math.floor(Math.random() * 100),
          sample: Array.from({ length: COMMIT_COUNT }).map((_, i) => ({
            message: `commit #${i + 1}`,
            url,
            hash: Math.random().toString(16).substring(2, 10),
            date: new Date(
              Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7),
            ), // random date within the past week
            author: {
              name: "newt",
              avatar: `https://github.com/${GITHUB_USERNAME}.png`,
              url: `https://github.com/${GITHUB_USERNAME}`,
            },
          })),
        },
      };

  data.commits.sample.sort((a, b) => b.date.getTime() - a.date.getTime());

  return new Response(JSON.stringify(data), {
    headers: {
      "Cache-Control": "s-maxage=600, stale-while-revalidate=30", // cache for 10 minutes, revalidate for 30 seconds
      "Content-Type": "application/json",
    },
  });
};
