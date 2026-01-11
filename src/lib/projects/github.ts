import { Octokit } from "@octokit/core";
import type {
  PartialRepoData,
  RepoData,
  PartialGithubRepoResponse,
  GithubRepoResponse,
} from "./types";

// configurable values
const LANGUAGE_COUNT = 3;
const COMMIT_COUNT = 5;

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN,
});

function parseRepoSlug(repo: string): { owner: string; name: string } {
  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    throw new Error(`Invalid repository slug: ${repo}`);
  }
  return { owner, name };
}

function buildPartialRepoQuery(
  id: string,
  owner: string,
  name: string,
): string {
  return `
    ${id}: repository(owner: "${owner}", name: "${name}") {
      stargazerCount
      languages(first: 1) {
        edges {
          node {
            name
            color
          }
        }
      }
    }
  `;
}

export async function batchPartialGithub(
  repos: Map<string, string>,
): Promise<Map<string, PartialRepoData | null>> {
  if (repos.size === 0) {
    return new Map();
  }

  const queries: string[] = [];

  repos.forEach((repoSlug, id) => {
    try {
      const { owner, name } = parseRepoSlug(repoSlug);
      queries.push(buildPartialRepoQuery(id, owner, name));
    } catch (error) {
      console.error(`Error parsing repo slug for ${id}:`, error);
    }
  });

  if (queries.length === 0) {
    return new Map();
  }

  try {
    const response = await octokit.graphql<{
      [key: string]: PartialGithubRepoResponse | null;
    }>(`{ ${queries.join("\n")} }`);

    const result = new Map<string, PartialRepoData | null>();

    repos.forEach((_, id) => {
      const data = response[id];
      if (!data) {
        result.set(id, null);
        return;
      }

      try {
        const primaryLanguageEdge = data.languages.edges[0];
        result.set(id, {
          stars: data.stargazerCount,
          primaryLanguage: {
            name: primaryLanguageEdge.node.name,
            colour: primaryLanguageEdge.node.color,
          },
        });
      } catch (error) {
        console.error(`Error transforming data for ${id}:`, error);
        result.set(id, null);
      }
    });

    return result;
  } catch (error) {
    console.error("Error fetching batch partial GitHub data:", error);
    return new Map(Array.from(repos.keys()).map((id) => [id, null]));
  }
}

export async function getFullGithub(repoSlug: string): Promise<RepoData> {
  const { owner, name } = parseRepoSlug(repoSlug);

  try {
    const data = await octokit.graphql<GithubRepoResponse>(`
      {
        repository(owner: "${owner}", name: "${name}") {
          stargazerCount
          forkCount
          languages(first: ${LANGUAGE_COUNT}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
          defaultBranchRef {
            name
            target {
              ... on Commit {
                history(first: ${COMMIT_COUNT}) {
                  totalCount
                  edges {
                    node {
                      oid
                      url
                      messageHeadline
                      committedDate
                      author {
                        name
                        avatarUrl
                        user {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `);

    const { stargazerCount, forkCount, languages, defaultBranchRef } =
      data.repository;

    return {
      url: `https://github.com/${repoSlug}`,
      stars: stargazerCount,
      forks: forkCount,
      languages: languages.edges
        .map(({ size, node }) => ({
          name: node.name,
          size,
          colour: node.color,
        }))
        .sort((a, b) => b.size - a.size),
      mainBranch: defaultBranchRef.name,
      commits: {
        count: defaultBranchRef.target.history.totalCount,
        sample: defaultBranchRef.target.history.edges.map(({ node }) => ({
          message: node.messageHeadline,
          url: node.url,
          hash: node.oid.slice(0, 7),
          date: new Date(node.committedDate),
          author: {
            name: node.author.name,
            avatar: node.author.avatarUrl,
            url: node.author.user.url,
          },
        })),
      },
    };
  } catch (error) {
    console.error(`Error fetching full GitHub data for ${repoSlug}:`, error);
    throw new Error(`Failed to fetch repository data for ${repoSlug}`);
  }
}
