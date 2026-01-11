import { GITHUB_USERNAME } from "$data";
import { fetchRepo, projectExists } from "$lib/projects";
import type { APIRoute } from "astro";

export const prerender = false;

// config
export const LANGUAGE_COUNT = 3;
export const COMMIT_COUNT = 5;

export const GET: APIRoute = async ({ params: { id } }) => {
  // make sure project exists
  if (id && !projectExists(id)) {
    return new Response(null, {
      status: 404,
      statusText: "Project not found",
    });
  }

  // if in development, return mock data
  // otherwise, fetch from the relevant source
  const data = import.meta.env.PROD
    ? await fetchRepo(id!)
    : {
        url: `https://github.com/${GITHUB_USERNAME}/mock-repo`,
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
          sample: Array.from({ length: COMMIT_COUNT }).map((_, i) => {
            const hash = Math.random().toString(16).substring(2, 10);

            return {
              message: `commit #${i + 1}`,
              url: `https://github.com/${GITHUB_USERNAME}/mock-repo/commit/${hash}`,
              hash,
              date: new Date(
                Date.now() -
                  Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7),
              ), // random date within the past week
              author: {
                name: "newt",
                avatar: `https://github.com/${GITHUB_USERNAME}.png`,
                url: `https://github.com/${GITHUB_USERNAME}`,
              },
            };
          }),
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
