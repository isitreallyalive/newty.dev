import { GITHUB_USERNAME } from "$data";
import type { PartialRepoData, RepoData } from "./types";

const MOCK_LANGUAGES = [
  { name: "Rust", colour: "#dea584" },
  { name: "TypeScript", colour: "#2b7489" },
  { name: "JavaScript", colour: "#f1e05a" },
  { name: "Python", colour: "#3572A5" },
  { name: "Svelte", colour: "#ff3e00" },
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

export function generateMockPartialRepoData(): PartialRepoData {
  return {
    stars: randomInt(10, 1000),
    primaryLanguage: randomElement(MOCK_LANGUAGES),
  };
}

export function generateMockRepoData(): RepoData {
  const languageCount = randomInt(1, 3);
  const commitCount = randomInt(20, 500);
  const sampleCommitCount = Math.min(5, commitCount);

  const languages = Array.from({ length: languageCount }, (_, i) => {
    const lang = MOCK_LANGUAGES[i % MOCK_LANGUAGES.length];
    return {
      ...lang,
      size: randomInt(10000, 100000),
    };
  }).sort((a, b) => b.size - a.size);

  const commits = Array.from({ length: sampleCommitCount }, (_, i) => {
    const hash = Math.random().toString(16).substring(2, 10);
    const daysAgo = randomInt(0, 30);

    return {
      message: `feat: implement feature #${i + 1}`,
      url: `https://github.com/${GITHUB_USERNAME}/mock-repo/commit/${hash}`,
      hash,
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      author: {
        name: GITHUB_USERNAME,
        avatar: `https://github.com/${GITHUB_USERNAME}.png`,
        url: `https://github.com/${GITHUB_USERNAME}`,
      },
    };
  });

  commits.sort((a, b) => b.date.getTime() - a.date.getTime());

  return {
    url: `https://github.com/${GITHUB_USERNAME}/mock-repo`,
    stars: randomInt(10, 1000),
    forks: randomInt(1, 100),
    languages,
    mainBranch: "main",
    commits: {
      count: commitCount,
      sample: commits,
    },
  };
}
