export const AGE = new Date().getFullYear() - 2006;

export const GITHUB_USERNAME = "isitreallyalive";
export const REPO = `${GITHUB_USERNAME}/newty.dev`;

export interface Links {
  [key: string]: {
    href: string;
    icon?: string;
  };
}

interface Social {
  href: string;
  class: string;
}

export const SOCIALS: Record<string, Social> = {
  "mdi:github": {
    href: `https://github.com/${GITHUB_USERNAME}`,
    class: "dark:hover:text-white hover:text-black",
  },
  "simple-icons:kofi": {
    href: `https://ko-fi.com/isitreallyalive`,
    class: "hover:text-peach",
  },
};

export const DISCORD_ID = "1269669249056510026";
