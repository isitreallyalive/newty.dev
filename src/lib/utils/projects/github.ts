import { Octokit } from "@octokit/core";
import {
  COMMIT_COUNT,
  LANGUAGE_COUNT,
  type RepoData,
} from "src/pages/api/projects/[id]";

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN,
});

/**
 * Response type for the GraphQL query to GitHub's API
 */
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

async function fetchGithub(repo: string): Promise<RepoData> {
  const [owner, name] = repo.split("/");
  const {
    repository: {
      stargazerCount,
      forkCount,
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
    stars: stargazerCount,
    forks: forkCount,
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

export default fetchGithub;
