import {
  importDefault,
  isModule,
  resetTable,
  testFunction,
  testFunctionAsync,
  validPath,
} from "trailmix/common/mod.ts";
import type { ImportOptions } from "trailmix/common/mod.ts";
import { join, resolve, toFileUrl } from "trailmix/deps.ts";

let table = resetTable();

const isModuleTests: Record<
  string,
  & Record<"i", string>
  & Record<"o", boolean>
> = {
  ts: {
    i: "input_config.ts",
    o: true,
  },
  tsx: {
    i: "input_config.tsx",
    o: true,
  },
  js: {
    i: "input_config.js",
    o: true,
  },
  jsx: {
    i: "input_config.jsx",
    o: true,
  },
  false: {
    i: "input_config.no",
    o: false,
  },
};

const validPathTests: Record<
  string,
  Record<"i", string> & Record<"o", boolean | string>
> = {
  relative: {
    i: "./input_config.ts",
    o: resolve(join(Deno.cwd(), "input_config.ts")),
  },
  absolute: {
    i: Deno.cwd() + "/input_config.ts",
    o: resolve(join(Deno.cwd(), "input_config.ts")),
  },
  nofile: {
    i: "/Error.ts",
    o: false,
  },
};

const importTests: Record<
  string,
  & Record<
    "i",
    & Record<"importPath", string>
    & Record<"options", ImportOptions>
    & Record<
      "cache",
      Record<string, Record<string, Record<string, string>>>
    >
  >
  & Record<"o", Record<string, string> | string>
> = {
  file: {
    i: {
      importPath: resolve(join(Deno.cwd(), "input_config.ts")),
      options: {},
      cache: {},
    },
    o: { consoleFormat: "json" },
  },
  reload: {
    i: {
      importPath: resolve(join(Deno.cwd(), "input_config.ts")),
      options: { reload: true },
      cache: {},
    },
    o: { consoleFormat: "json" },
  },
  cache: {
    i: {
      importPath: resolve(join(Deno.cwd(), "input_config.ts")),
      options: {},
      cache: {
        [toFileUrl(resolve(join(Deno.cwd(), "input_config.ts"))).href]: {
          "default": { "consoleFormat": "json" },
        },
      },
    },
    o: { consoleFormat: "json" },
  },
  colon: {
    i: {
      importPath: "D:" + resolve(join(Deno.cwd(), "input_config.ts")),
      options: {},
      cache: {},
    },
    // this test might work unexpectedly on winders, /shrug
    o: TypeError.name,
  },
  nofile: {
    i: {
      importPath: resolve(join(Deno.cwd(), "Error.ts")),
      options: {},
      cache: {},
    },
    o: TypeError.name,
  },
};

async function writeFile(
  file = "input_config.ts",
  cwd = true,
  content = 'export default {consoleFormat: "json"};',
) {
  return await Deno.writeFile(
    (cwd ? (Deno.cwd() + "/") : "") + file,
    new TextEncoder().encode(content),
  );
}
const f = testFunction;
const fa = testFunctionAsync;
Deno.test({
  name: "file.ts " + isModule.name,
  fn: () => {
    const t = isModuleTests;
    const fn = isModule;
    f(fn.name + " " + t.ts.i, table, fn(t.ts.i), t.ts.o);
    f(fn.name + " " + t.tsx.i, table, fn(t.tsx.i), t.tsx.o);
    f(fn.name + " " + t.js.i, table, fn(t.js.i), t.js.o);
    f(fn.name + " " + t.jsx.i, table, fn(t.jsx.i), t.jsx.o);
    f(fn.name + " " + t.false.i, table, fn(t.false.i), t.false.o);
    table.render();
    table = resetTable();
  },
});
Deno.test({
  name: "file.ts " + validPath.name,
  fn: async () => {
    await writeFile().then((v) => {
      const t = validPathTests;
      const fn = validPath;
      f(fn.name + " " + t.relative.i, table, fn(t.relative.i), t.relative.o);
      f(fn.name + " " + t.absolute.i, table, fn(t.absolute.i), t.absolute.o);
      f(fn.name + " " + t.nofile.i, table, fn(t.nofile.i), t.nofile.o);
      table.render();
      table = resetTable();
    });
  },
});
Deno.test({
  name: "file.ts " + importDefault.name,
  fn: async () => {
    await writeFile().then(async (v) => {
      const t = importTests;
      const fn = importDefault;
      await fa(
        fn.name + " file",
        table,
        async () =>
          await fn(t.file.i.importPath, t.file.i.options, t.file.i.cache),
        t.file.o,
      );
      await fa(
        fn.name + " reload",
        table,
        async () =>
          await fn(t.reload.i.importPath, t.reload.i.options, t.reload.i.cache),
        t.reload.o,
      );
      await fa(
        fn.name + " cache",
        table,
        async () =>
          await fn(t.cache.i.importPath, t.cache.i.options, t.cache.i.cache),
        t.cache.o,
      );
      await fa(
        fn.name + " colon",
        table,
        async () =>
          await fn(t.colon.i.importPath, t.colon.i.options, t.colon.i.cache),
        t.colon.o,
      );
      await fa(
        fn.name + " nofile",
        table,
        async () =>
          await fn(t.nofile.i.importPath, t.nofile.i.options, t.nofile.i.cache),
        t.nofile.o,
      );
      await Deno.remove(resolve(Deno.cwd(), "input_config.ts"));
      table.render();
      table = resetTable();
    });
  },
});
