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

export type Value = AccentName | "text";

const randomAccent = (exclude?: AccentName) => {
  const choices = exclude ? ACCENTS.filter((a) => a !== exclude) : ACCENTS;
  return choices[Math.floor(Math.random() * choices.length)];
};

export function accentStore(initial: Value = "text") {
  const { subscribe, set, update } = writable<Value>(initial);

  return {
    subscribe,
    next: () =>
      update((current) =>
        current === "text" ? randomAccent() : randomAccent(current)
      ),
    clear: () => set("text")
  };
}