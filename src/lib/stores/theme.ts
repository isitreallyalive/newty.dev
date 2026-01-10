import { flavors, type AccentName, type FlavorName } from "@catppuccin/palette";
import frappe from "@catppuccin/tailwindcss/frappe.css?url";
import mocha from "@catppuccin/tailwindcss/mocha.css?url";
import macchiato from "@catppuccin/tailwindcss/macchiato.css?url";
import { derived, writable } from "svelte/store";
import { isBrowser } from "$utils";
import { ACCENTS } from "$stores/accent";

/**
 * All available themes.
 */
export const THEMES: FlavorName[] = ["latte", "frappe", "macchiato", "mocha"];

function detectTheme(): FlavorName {
  // saved preference wins
  const saved = localStorage.getItem("theme") as FlavorName | null;
  if (saved) return saved;

  // prefers light or forced colours/high contrast -> light theme
  const forcedColours = window.matchMedia("(forced-colors: active)").matches;
  const highContrast = window.matchMedia("(prefers-contrast: more)").matches;
  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)",
  ).matches;

  if (prefersLight || forcedColours || highContrast) return "latte";
  else return "mocha"; // default to dark
}

/**
 * The user's preferred theme.
 */
export const theme = writable<FlavorName>(isBrowser ? detectTheme() : "mocha");
export default theme;

if (isBrowser) {
  theme.subscribe((theme) => {
    // save preference
    localStorage.setItem("theme", theme);

    // make sure the theme is in use
    document.body.classList.remove(...THEMES);
    document.body.classList.add(theme);
  });
}

/**
 * The stylesheet URL for the current theme.
 */
export const stylesheet = derived(theme, ($theme) => {
  switch ($theme) {
    case "latte":
    case "mocha":
      return mocha;
    case "macchiato":
      return macchiato;
    case "frappe":
      return frappe;
  }
});

if (isBrowser) {
  stylesheet.subscribe((url) => {
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
  });
}

/**
 * The colours for the current theme.
 */
export const colours = derived(theme, ($theme) =>
  Object.fromEntries(
    flavors[$theme].colorEntries
      .filter(([name]) => ACCENTS.includes(name as AccentName))
      .map(([name, { hex }]) => [name, hex]),
  ),
);
