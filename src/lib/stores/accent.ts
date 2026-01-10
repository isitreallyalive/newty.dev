import type { AccentName } from "@catppuccin/palette";
import { writable } from "svelte/store";

export const ACCENTS: AccentName[] = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
];

const randomAccent = (exclude?: AccentName) => {
  const choices = exclude
    ? ACCENTS.filter((accent) => accent !== exclude)
    : ACCENTS;
  return choices[Math.floor(Math.random() * choices.length)];
};

export default function accentStore(initial?: AccentName) {
  const { subscribe, set, update } = writable<AccentName | null>(
    initial ?? null,
  );

  return {
    subscribe,
    next: () => update((current) => randomAccent(current ?? undefined)),
    clear: () => set(null),
  };
}
