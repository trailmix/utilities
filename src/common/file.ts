import { exists, extname, resolve } from "trailmix/deps.ts";

import type { FileExtension, ImportOptions } from "trailmix/common/mod.ts";

const files: Record<FileExtension, string[]> = {
  ts: ["ts", "tsx"],
  yaml: ["yaml", "yml"],
  json: ["json"],
  js: ["js", "jsx"],
};

export async function validPath(
  file: string,
  ext: FileExtension,
  dir = ".",
) {
  let found = false;
  let path = "";
  for (const _ext of files[ext]) {
    path = resolve(dir, `${file}.${_ext}`);
    if ((await exists(path))) {
      found = true;
      break;
    }
  }
  if (found) return path;
  else {
    throw new Error(`${file}.${files[ext].join("/")} does not exist`);
  }
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
