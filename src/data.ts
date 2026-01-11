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

export enum CapeSource {
  Minecraft = "minecraft",
  Optifine = "optifine",
  McCapes = "minecraftcapes",
  LabyMod = "labymod",
  Zig = "5zig",
  TLauncher = "tlauncher",
}

/**
 * Minecraft players for use in the skin viewer
 */
export const PLAYERS: Record<string, Player> = {
  newt: {
    uuid: "7e3661236beb48ecb6e147dbd319f41d",
    cape: CapeSource.Optifine,
  },
};
