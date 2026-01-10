import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Is the current environment a browser?
 */
export const isBrowser = typeof window !== "undefined";

/**
 * Deduplicates and merges Tailwind CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
