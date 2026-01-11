export const GITHUB_USERNAME = "isitreallyalive";
export const GITHUB_PROFILE = `https://github.com/${GITHUB_USERNAME}`;
export const GITHUB_REPO = `${GITHUB_PROFILE}/newty.dev`;

/**
 * Cache for 10 minutes, revalidate for 30 seconds
 */
export const CACHE_HEADERS = {
  "Cache-Control": "s-maxage=600, stale-while-revalidate=30",
  "Content-Type": "application/json",
};
