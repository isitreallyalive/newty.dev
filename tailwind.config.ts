import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: false, // don't override link colour
              "text-decoration-line": "none", // never automatically underline
            },
          },
        },
      },
    },
  },
} satisfies Config;
