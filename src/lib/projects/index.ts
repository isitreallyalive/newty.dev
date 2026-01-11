import { getCollection } from "astro:content";
import { getFullGithub, batchPartialGithub } from "./github";
import type { PartialRepoData, RepoData, RepoSource } from "./types";

export * from "./types";

const projects = await getCollection("projects");

// map project ids to their source (github, etc) and repo slug
const projectSourceMap = new Map<
  string,
  { source: RepoSource; slug: string }
>();

for (const {
  id,
  data: { links },
} of projects) {
  if (links.github) {
    projectSourceMap.set(id, {
      source: "github" as RepoSource,
      slug: links.github,
    });
  }
}

export function projectExists(id: string): boolean {
  return projectSourceMap.has(id);
}

export async function fetchRepo(id: string): Promise<RepoData> {
  const projectInfo = projectSourceMap.get(id);

  if (!projectInfo) {
    throw new Error(`Project not found: ${id}`);
  }

  switch (projectInfo.source) {
    case "github":
      return getFullGithub(projectInfo.slug);
    default:
      throw new Error(`Unsupported repository source: ${projectInfo.source}`);
  }
}

export async function fetchPartialRepos(): Promise<
  Map<string, PartialRepoData | null>
> {
  const githubRepos = new Map<string, string>();

  for (const [id, info] of projectSourceMap.entries()) {
    if (info.source === "github") {
      githubRepos.set(id, info.slug);
    }
  }

  return batchPartialGithub(githubRepos);
}

export { projects };
