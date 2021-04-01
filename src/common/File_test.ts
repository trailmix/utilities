import { importDefault, validPath } from "trailmix/common/File.ts";
import type { FileExtension, ImportOptions } from "trailmix/common/File.d.ts";
import { resetTable, testFunction } from "trailmix/common/table.ts";

let table = resetTable();

const tests: Record<
  string,
  Record<
    "i" | "o",
    | string
    | unknown
    | Record<string, string | FileExtension | unknown>
  >
> = {
  validPath: {
    i: {
      file: "testConfig",
      ext: "ts",
      dir: ".",
    },
    o: Deno.cwd() + "/testConfig.ts",
  },
  file: {
    i: {
      importPath: Deno.cwd() + "/testConfig.ts",
      options: {},
      cache: {},
    },
    o: { consoleFormat: "json" },
  },
  cache: {
    i: {
      importPath: Deno.cwd() + "/testConfig.ts",
      options: { reload: false },
      cache: { [Deno.cwd() + "/testConfig.ts"]: Deno.cwd() + "/testConfig.ts" },
    },
    o: { consoleFormat: "json" },
  },
  nofile: {
    i: {
      importPath: Deno.cwd() + "/Error.ts",
      options: {},
      cache: {},
    },
    o: TypeError.name,
  },
  // number: {
  //   i: [1, 1, 2],
  //   o: [1, 2],
  // },
  // boolean: {
  //   i: [true, true, false],
  //   o: [true, false],
  // },
  // array: {
  //   i: [
  //     ["1", 1, true],
  //     ["1", 1, true],
  //     ["2", 2, false],
  //   ],
  //   o: [
  //     ["1", 1, true],
  //     ["2", 2, false],
  //   ],
  // },
  // object: {
  //   i: [{ test: "test1" }, { test: "test1" }, { test: "test2" }],
  //   o: [{ test: "test1" }, { test: "test2" }],
  // },
  // undefined: {
  //   i: [undefined, undefined, 1],
  //   o: [undefined, 1],
  // },
};
async function writeFile() {
  return await Deno.writeFile(
    Deno.cwd() + "/testConfig.ts",
    new TextEncoder().encode('export default {consoleFormat: "json"};'),
  );
}
Deno.test({
  name: "File.ts",
  fn: async () => {
    await writeFile().then(async (v) => {
      await testFunction(
        "validPath",
        table,
        async (
          i = tests.validPath.i as Record<string, unknown>,
        ) => {
          return await validPath(
            i.file as string,
            i.ext as FileExtension,
            i.dir as string,
          );
        },
        tests.validPath.o,
      );
      table.render();
      table = resetTable();
    });
  },
});
Deno.test({
  name: "File.ts",
  fn: async () => {
    await writeFile().then(async (v) => {
      await testFunction(
        "importDefault - file",
        table,
        async (
          i = tests.file.i as Record<string, unknown>,
        ) => {
          return await importDefault(
            i.importPath as string,
            i.options as ImportOptions,
            i.cache as Record<string, unknown>,
          );
        },
        tests.file.o,
      );
      table.render();
      table = resetTable();
    });
  },
});
Deno.test({
  name: "File.ts",
  fn: async () => {
    await writeFile().then(async (v) => {
      await testFunction(
        "importDefault - cache",
        table,
        async (
          i = tests.cache.i as Record<string, unknown>,
        ) => {
          return await importDefault(
            i.importPath as string,
            i.options as ImportOptions,
            i.cache as Record<string, unknown>,
          );
        },
        tests.cache.o,
      );
      table.render();
      table = resetTable();
    });
  },
});
Deno.test({
  name: "File.ts",
  fn: async () => {
    await testFunction(
      "importDefault - nofile",
      table,
      (
        i = tests.nofile.i as Record<string, unknown>,
      ) => {
        return importDefault(
          i.importPath as string,
          i.options as ImportOptions,
          i.cache as Record<string, unknown>,
        );
      },
      tests.nofile.o,
    );
    table.render();
    table = resetTable();
  },
});
