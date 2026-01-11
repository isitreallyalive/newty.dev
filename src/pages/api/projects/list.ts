import {
  fetchPartialRepos,
  projects,
  type PartialRepoData,
} from "$lib/projects";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async (_) => {
  let data = new Map<string, PartialRepoData | null>();

  if (import.meta.env.PROD) {
    data = await fetchPartialRepos();
  } else {
    projects.forEach(({ id }) => {
      data.set(id, {
        stars: Math.floor(Math.random() * 1000),
        primaryLanguage: { name: "Rust", colour: "#dea584" },
      });
    });
  }

  return new Response(JSON.stringify(Object.fromEntries(data)), {
    headers: {
      "Cache-Control": "s-maxage=600, stale-while-revalidate=30", // cache for 10 minutes, revalidate for 30 seconds
      "Content-Type": "application/json",
    },
  });
};
