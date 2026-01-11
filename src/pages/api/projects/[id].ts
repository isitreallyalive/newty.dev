import type { APIRoute } from "astro";
import { fetchRepo, projectExists, type RepoData } from "$lib/projects";
import { generateMockRepoData as generateMock } from "$lib/projects/mock";
import { CACHE_HEADERS } from "$data";

export const prerender = false;

async function getRepoData(id: string): Promise<RepoData> {
  if (import.meta.env.PROD) {
    return fetchRepo(id);
  }
  return generateMock();
}

export const GET: APIRoute = async ({ params: { id } }) => {
  if (!id || !projectExists(id)) {
    return new Response(JSON.stringify({ error: "Project not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const data = await getRepoData(id);

    return new Response(JSON.stringify(data), {
      headers: CACHE_HEADERS,
    });
  } catch (error) {
    console.error(`Error fetching repo data for ${id}:`, error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch repository data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
