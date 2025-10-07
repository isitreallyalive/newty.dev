import type { AccentName } from "@catppuccin/palette";
import { writable } from "svelte/store";

const ACCENTS: AccentName[] = [
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

export type Value = AccentName | null;

const randomAccent = (exclude?: AccentName) => {
  const choices = exclude ? ACCENTS.filter((a) => a !== exclude) : ACCENTS;
  return choices[Math.floor(Math.random() * choices.length)];
};

export default function accentStore(initial: Value = null) {
  const { subscribe, set, update } = writable<Value>(initial);

  return {
    subscribe,
    next: () => update((current) => randomAccent(current ?? undefined)),
    clear: () => set(null),
  };
}
