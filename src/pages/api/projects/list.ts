import type { APIRoute } from "astro";
import {
  fetchPartialRepos,
  projects,
  type PartialRepoData,
} from "$lib/projects";
import { generateMockPartialRepoData as generateMockPartial } from "$lib/projects/mock";
import { CACHE_HEADERS } from "$data";

export const prerender = false;

async function getPartialReposData(): Promise<
  Map<string, PartialRepoData | null>
> {
  if (import.meta.env.PROD) {
    return fetchPartialRepos();
  }

  const mockData = new Map<string, PartialRepoData | null>();
  projects.forEach(({ id }) => {
    mockData.set(id, generateMockPartial());
  });
  return mockData;
}

export const GET: APIRoute = async () => {
  try {
    const data = await getPartialReposData();
    const jsonData = Object.fromEntries(data);

    return new Response(JSON.stringify(jsonData), {
      headers: CACHE_HEADERS,
    });
  } catch (error) {
    console.error("Error fetching partial repos:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch project data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
