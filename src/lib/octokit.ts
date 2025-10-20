import { Octokit } from "@octokit/core";
import { GITHUB_USERNAME } from "./data";

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN,
});

interface Repo {
  name: string;
  owner: string;
}

export async function getRepoData<T>(
  { name: name, owner }: Repo,
  inner: string,
  defaultValues: Partial<T> = {},
): Promise<T> {
  // if (!import.meta.env.PROD) return defaultValues as T;
  const data = (await octokit.graphql(
    `
query ($name: String!, $owner: String!) {
  repository(name: $name, owner: $owner) {
    ${inner}
  }
}
`,
    { name, owner },
  )) as any;
  return { ...data.repository } as T;
}
