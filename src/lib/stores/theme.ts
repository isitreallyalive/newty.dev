import { derived, writable } from "svelte/store";

// dark mode themes - latte included in all
import frappeUrl from "@catppuccin/tailwindcss/frappe.css?url";
import macchiatoUrl from "@catppuccin/tailwindcss/macchiato.css?url";
import mochaUrl from "@catppuccin/tailwindcss/mocha.css?url";
import { flavors, type FlavorName } from "@catppuccin/palette";

export const frappe = frappeUrl;
export const macchiato = macchiatoUrl;
export const mocha = mochaUrl;
export const themes: FlavorName[] = ["latte", "frappe", "macchiato", "mocha"];

const urls: Record<Exclude<FlavorName, "latte">, string> = {
  frappe,
  macchiato,
  mocha,
};

// load the stylesheet and then swap into the svelte managed <link> element
// prevents a flash of unstyled content
function loadStylesheet(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tmp = document.createElement("link");
    tmp.rel = "stylesheet";
    tmp.href = url;
    tmp.onload = () => {
      tmp.remove();
      resolve();
    };
    tmp.onerror = (e) => {
      tmp.remove();
      reject(e);
    };
    document.head.appendChild(tmp);
  });
}

export function detectTheme(): FlavorName {
  // saved preference wins
  const saved = localStorage.getItem("theme");
  if (saved) return saved as FlavorName;

  // prefers light or forced colours/high contrast -> light theme
  const forcedColours = window.matchMedia("(forced-colors: active)").matches;
  const highContrast = window.matchMedia("(prefers-contrast: more)").matches;
  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)",
  ).matches;

  if (prefersLight || forcedColours || highContrast) return "latte";
  else return "mocha"; // default to dark
}

export async function applyTheme(
  theme: FlavorName,
  linkElement: HTMLLinkElement,
) {
  const dark = theme !== "latte";

  // update stylesheet
  const url = dark ? urls[theme] : mocha;
  if (linkElement.href !== url) {
    await loadStylesheet(url);
    linkElement.href = url;
  }

  // update class
  const oldTheme = localStorage.getItem("theme");
  if (oldTheme) document.documentElement.classList.remove(oldTheme);
  document.documentElement.classList.add(theme);

  // store preference
  localStorage.setItem("theme", theme);
}

export const theme = writable<FlavorName>(
  typeof window !== "undefined" ? detectTheme() : "mocha",
);

export const colours = derived(theme, (theme) =>
  Object.fromEntries(
    flavors[theme].colorEntries.map(([name, { hex }]) => [name, hex]),
  ),
);

export default theme;
