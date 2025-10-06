import path from "node:path";

export function getPaths(...paths: string[]): [string, string] {
  return [
    path.resolve(process.cwd(), "src", ...paths),
    path.resolve(process.cwd(), "dist", ...paths),
  ];
}
