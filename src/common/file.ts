import { existsSync, extname, resolve } from "trailmix/deps.ts";

import type { ImportOptions, ModuleExtension } from "trailmix/common/mod.ts";
const modules: Record<ModuleExtension, string[]> = {
  ts: ["ts", "tsx"],
  tsx: ["ts", "tsx"],
  js: ["js", "jsx"],
  jsx: ["js", "jsx"],
};
export function isModule(file: string): boolean {
  return Object.keys(modules).includes(extname(file).slice(1));
}

export function validPath(
  file: string,
): string | false {
  const path = resolve(file);
  const found = existsSync(path);
  return found ? path : found;
}
/** Replacement of dynamic import default */
export async function importDefault<T = unknown>(
  importPath: string,
  options: ImportOptions = {},
  cache: Record<string, unknown> = {},
): Promise<T> {
  const mod = await import_<{ default: T }>(importPath, options, cache);
  return mod.default;
}
/** Replacement of dynamic import, enable cache by default, support reload options */
export async function import_<T = unknown>(
  importPath: string,
  options: ImportOptions = {},
  cache: Record<string, unknown> = {},
): Promise<T> {
  let finalImportPath = importPath;
  if (finalImportPath.startsWith("/") || finalImportPath.substr(1, 1) === ":") {
    finalImportPath = `file://${finalImportPath}`;
  }
  if (!options.reload) {
    if (cache[finalImportPath]) {
      return cache[finalImportPath] as T;
    }
  }
  let versionQuery = "";
  if (options.reload) {
    versionQuery = `?version=${Math.random().toString().slice(2)}${
      extname(importPath)
    }`;
  }

  const mod = await import(`${finalImportPath}${versionQuery}`);

  cache[finalImportPath] = mod;
  return mod;
}
