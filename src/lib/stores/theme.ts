import mocha from "@catppuccin/tailwindcss/mocha.css?url";
import frappe from "@catppuccin/tailwindcss/frappe.css?url";
import macchiato from "@catppuccin/tailwindcss/macchiato.css?url";

import { isBrowser } from "$lib/utils";
import type { FlavorName } from "@catppuccin/palette";
import { persistentAtom } from "@nanostores/persistent";

export const THEMES: FlavorName[] = ["latte", "frappe", "macchiato", "mocha"];

// latte and mocha share the same base stylesheet
export const URLS: Record<FlavorName, string> = {
  latte: mocha,
  mocha,
  frappe,
  macchiato,
};

export const THEME_KEY = "theme";
export const theme = persistentAtom<FlavorName>(THEME_KEY);

if (isBrowser) {
  theme.subscribe((new_, old) => {
    const url = URLS[new_];

    // avoid re-adding existing theme
    const existing: HTMLLinkElement | null =
      document.querySelector("link#theme");
    if (existing && existing.href === url) return;

    // add new theme stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = () => {
      // remove old theme stylesheet
      existing?.remove();
      link.id = "theme";
    };

    document.head.appendChild(link);

    // update theme in use
    if (old) document.documentElement.classList.remove(old);
    document.documentElement.classList.add(new_);
  });
}
