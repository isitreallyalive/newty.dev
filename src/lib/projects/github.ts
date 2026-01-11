import { Octokit } from "@octokit/core";
import { COMMIT_COUNT, LANGUAGE_COUNT } from "src/pages/api/projects/[id]";
import type { PartialRepoData, RepoData } from "$lib/projects";

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN,
});

interface PartialGithubRepoResponse {
  stargazerCount: number;

  languages: {
    edges: {
      size: number;
      node: {
        color: string;
        name: string;
      };
    }[];
  };
}

interface GithubRepoResponse {
  repository: {
    stargazerCount: number;
    forkCount: number;

    languages: {
      edges: {
        size: number;
        node: {
          color: string;
          name: string;
        };
      }[];
    };

    defaultBranchRef: {
      name: string;
      target: {
        history: {
          totalCount: number;
          edges: {
            node: {
              oid: string;
              url: string;
              messageHeadline: string;
              committedDate: string;
              author: {
                name: string;
                avatarUrl: string;
                user: {
                  url: string;
                };
              };
            };
          }[];
        };
      };
    };
  };
}

export async function batchPartialGithub(
  repos: Map<string, string>, // id, repo
): Promise<Map<string, PartialRepoData | null>> {
  const queries: string[] = [];
  repos.forEach((repo, id) => {
    const [owner, name] = repo.split("/");
    queries.push(`
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
    `);
  });

  const response = await octokit.graphql<{
    [key: string]: PartialGithubRepoResponse | null;
  }>(`
    {
      ${queries.join("\n")}
    }
  `);

  const result = new Map<string, PartialRepoData | null>();
  repos.forEach((repo, id) => {
    const data = response[id];
    if (!data) {
      result.set(repo, null);
      return;
    }

    const {
      stargazerCount: stars,
      languages: {
        edges: [
          {
            node: { name, color },
          },
        ],
      },
    } = data;
    result.set(id, { stars, primaryLanguage: { name, colour: color } });
  });

  return result;
}

async function getFullGithub(repo: string): Promise<RepoData> {
  const [owner, name] = repo.split("/");
  const {
    repository: {
      stargazerCount: stars,
      forkCount: forks,
      languages: { edges: languages },
      defaultBranchRef: {
        name: mainBranch,
        target: {
          history: { totalCount: commitCount, edges: commits },
        },
      },
    },
  } = await octokit.graphql<GithubRepoResponse>(`
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

  return {
    url: `https://github.com/${repo}`,
    stars,
    forks,
    languages: languages
      .map(({ size, node: { name, color: colour } }) => ({
        name,
        size,
        colour,
      }))
      .sort((a, b) => b.size - a.size),
    mainBranch,
    commits: {
      count: commitCount,
      sample: commits.map(
        ({
          node: {
            messageHeadline: message,
            url,
            oid,
            committedDate,
            author: {
              name,
              avatarUrl: avatar,
              user: { url: authorUrl },
            },
          },
        }) => ({
          message,
          url,
          hash: oid.slice(0, 7),
          date: new Date(committedDate),
          author: {
            name,
            avatar,
            url: authorUrl,
          },
        }),
      ),
    },
  };
}

export default getFullGithub;
