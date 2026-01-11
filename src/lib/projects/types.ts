export interface Language {
  name: string;
  colour: string;
  size: number;
}

export interface Author {
  name: string;
  avatar: string;
  url: string;
}

export interface Commit {
  message: string;
  url: string;
  hash: string;
  date: Date;
  author: Author;
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

export enum RepoSource {
  GitHub = "github",
}

export interface GithubRepoLanguageNode {
  name: string;
  color: string;
}

export interface GithubRepoAuthor {
  name: string;
  avatarUrl: string;
  user: {
    url: string;
  };
}

export interface GithubRepoCommit {
  oid: string;
  url: string;
  messageHeadline: string;
  committedDate: string;
  author: GithubRepoAuthor;
}

export interface PartialGithubRepoResponse {
  stargazerCount: number;
  languages: {
    edges: {
      size: number;
      node: GithubRepoLanguageNode;
    }[];
  };
}

export interface GithubRepoResponse {
  repository: {
    stargazerCount: number;
    forkCount: number;
    languages: {
      edges: {
        size: number;
        node: GithubRepoLanguageNode;
      }[];
    };
    defaultBranchRef: {
      name: string;
      target: {
        history: {
          totalCount: number;
          edges: {
            node: GithubRepoCommit;
          }[];
        };
      };
    };
  };
}
