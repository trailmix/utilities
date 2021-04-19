import {
  existsSync,
  extname,
  fromFileUrl,
  isAbsolute,
  join,
  resolve,
  toFileUrl,
} from "trailmix/deps.ts";

import type { ImportOptions, ModuleExtension } from "trailmix/common/mod.ts";
const modules: Record<ModuleExtension, string[]> = {
  ts: ["ts", "tsx"],
  tsx: ["ts", "tsx"],
  js: ["js", "jsx"],
  jsx: ["js", "jsx"],
};
function isURL(paths: string[] | string): boolean {
  const urls = ["file://", "https:/"];
  return Array.isArray(paths)
    ? urls.includes(paths[0].substr(0, 7))
    : urls.includes(paths.substr(0, 7));
}
function isPosix(paths: string[] | string): boolean {
  const prefixes = ["/", "."];
  return (Array.isArray(paths)
    ? prefixes.includes(paths[0].slice(0, 1))
    : prefixes.includes(paths.slice(0, 1))) &&
    ["linux", "darwin"].includes(Deno.build.os);
}
function isWin32(paths: string[] | string): boolean {
  return (Array.isArray(paths)
    ? paths[0].substr(1, 1) === ":"
    : paths.substr(1, 1) === ":") && Deno.build.os === "windows";
}
export function isModule(file: string): boolean {
  return Object.keys(modules).includes(extname(file).slice(1));
}
/**
 * 
 * @param {string[]|string} paths string[]|string [Deno.cwd(),'dir','file.ts'] or "file.ts"
 * @returns file:// normalized path
 */
export function toFileUrlDeep(paths: string[] | string): string {
  const isUrl = !((isPosix(paths) || isWin32(paths)) || !isURL(paths));
  return (Array.isArray(paths))
    ? !isUrl && isAbsolute(join(...paths))
      ? toFileUrl(join(...paths)).href
      : join(...paths)
    : !isUrl && isAbsolute(paths)
    ? toFileUrl(paths).href
    : paths;
}

export function validPath(
  file: string,
): string | false {
  const path = isURL(file) ? resolve(fromFileUrl(file)) : resolve(file);
  const found = existsSync(path);
  return found ? path : found;
}
/** Replacement of dynamic import default */
export async function importDefault<T = unknown>(
  importPath: string,
  options: ImportOptions = {},
  cache: Record<string, unknown> = {},
): Promise<T> {
  let mod: Record<"default", T>;
  try {
    const valid = validPath(importPath);
    if (valid !== false) {
      mod = await import_<{ default: T }>(valid, options, cache);
    } else throw new Error(`path:${importPath} is not valid`);
  } catch (e) {
    throw e;
  }
  return mod.default;
}
/** Replacement of dynamic import, enable cache by default, support reload options */
export async function import_<T = unknown>(
  importPath: string,
  options: ImportOptions = {},
  cache: Record<string, unknown> = {},
): Promise<T> {
  const finalImportPath = toFileUrlDeep(importPath);
  let versionQuery = "";
  if (!options.reload) {
    if (cache[finalImportPath]) {
      return cache[finalImportPath] as T;
    }
  } else {
    versionQuery = `?version=${Math.random().toString().slice(2)}${
      extname(importPath)
    }`;
  }
  const mod = await import(`${finalImportPath}${versionQuery}`);
  cache[finalImportPath] = mod;
  return mod;
}
