const yearInMs = 3.15576e10; // using a year of 365.25 days (because leap years)
const birthday = new Date("2006-06-06");
export const AGE = Math.floor(
  (new Date().getTime() - birthday.getTime()) / yearInMs,
);

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
  "mdi--github": {
    href: `https://github.com/${GITHUB_USERNAME}`,
    class: "dark:hover:text-white hover:text-black",
  },
  "simple-icons--kofi": {
    href: `https://ko-fi.com/isitreallyalive`,
    class: "hover:text-peach",
  },
};

export const DISCORD_ID = "1269669249056510026";
