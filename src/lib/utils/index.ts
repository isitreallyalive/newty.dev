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

/**
 * Is WebGL supported in the current browser?
 */
export function isWebGL(): boolean {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  return gl instanceof WebGLRenderingContext;
}
