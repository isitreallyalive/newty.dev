import type { Language } from "$components/project/RepoStats.svelte";
import { getCollection } from "astro:content";
import getFullGithub, { batchPartialGithub } from "./github";

enum RepoSource {
  GitHub,
}

// determine the repo source for each project
const sources = new Map<string, RepoSource>();
export const projects = await getCollection("projects");

for (const {
  id,
  data: { links },
} of projects) {
  // order of preference:
  // - github
  if (links.github) {
    sources.set(id, RepoSource.GitHub);
  }
}

/**
 * Does the project with the given ID exist?
 */
export function projectExists(id: string): boolean {
  return projects.some((p) => p.id === id);
}

/**
 * Fetch full repository data for the given project ID.
 */
export function fetchRepo(id: string): Promise<RepoData> {
  const source = sources.get(id);
  if (!projectExists(id)) return Promise.reject("Project does not exist");
  const project = projects.find((p) => p.id === id)!;

  switch (source) {
    case RepoSource.GitHub:
      return getFullGithub(project.data.links.github!);
    default:
      return Promise.reject("Unsupported repository source");
  }
}

export function fetchPartialRepos(): Promise<
  Map<string, PartialRepoData | null>
> {
  const githubRepos: Map<string, string> = new Map();

  for (const {
    id,
    data: {
      links: { github },
    },
  } of projects) {
    const source = sources.get(id);
    switch (source) {
      case RepoSource.GitHub:
        githubRepos.set(id, github!);
        break;
    }
  }

  return batchPartialGithub(githubRepos);
}

interface Commit {
  message: string;
  url: string;
  hash: string;
  date: Date;
  author: {
    name: string;
    avatar: string;
    url: string;
  };
}

export interface PartialRepoData {
  stars: number;
  primaryLanguage: Omit<Language, "size">;
}

export interface RepoData {
  url: string;
  stars: number;
  forks: number;
  languages: Language[];
  mainBranch: string;
  commits: {
    count: number;
    sample: Commit[];
  };
}
