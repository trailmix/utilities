import {
  importDefault,
  resetTable,
  testFunctionAsync,
  validPath,
} from "trailmix/common/mod.ts";
import type { FileExtension, ImportOptions } from "trailmix/common/mod.ts";
import { resolve } from "trailmix/deps.ts";

let table = resetTable();

const validPathTests: Record<
  string,
  Record<
    "i" | "o",
    | string
    | unknown
    | Record<string, string | FileExtension | unknown>
  >
> = {
  file: {
    i: {
      file: "testConfig",
      ext: "ts",
      dir: ".",
    },
    o: resolve(Deno.cwd(), "testConfig.ts"),
  },
  nofile: {
    i: {
      file: "Error",
      ext: "ts",
      dir: ".",
    },
    o: Error.name,
  },
};

const importTests: Record<
  string,
  Record<
    "i" | "o",
    | string
    | unknown
    | Record<string, string | FileExtension | unknown>
  >
> = {
  file: {
    i: {
      importPath: resolve(Deno.cwd(), "testConfig.ts"),
      options: {},
      cache: {},
    },
    o: { consoleFormat: "json" },
  },
  reload: {
    i: {
      importPath: resolve(Deno.cwd(), "testConfig.ts"),
      options: { reload: true },
      cache: {},
    },
    o: { consoleFormat: "json" },
  },
  cache: {
    i: {
      importPath: resolve(Deno.cwd(), "testConfig.ts"),
      options: {},
      cache: {
        ["file://" + resolve(Deno.cwd(), "testConfig.ts")]: await import(
          "file://" + resolve(Deno.cwd(), "testConfig.ts")
        ),
      },
    },
    o: { consoleFormat: "json" },
  },
  colon: {
    i: {
      importPath: "D:" + resolve(Deno.cwd(), "testConfig.ts"),
      options: {},
      cache: {},
    },
    // this test might work unexpectedly on winders, /shrug
    o: TypeError.name,
  },
  nofile: {
    i: {
      importPath: resolve(Deno.cwd(), "Error.ts"),
      options: {},
      cache: {},
    },
    o: TypeError.name,
  },
};

async function writeFile() {
  return await Deno.writeFile(
    Deno.cwd() + "/testConfig.ts",
    new TextEncoder().encode('export default {consoleFormat: "json"};'),
  );
}
Deno.test({
  name: "file.ts",
  fn: async () => {
    await writeFile().then(async (v) => {
      await testFunctionAsync(
        "validPath",
        table,
        async (
          i = validPathTests.file.i as Record<string, unknown>,
        ) => {
          return await validPath(
            i.file as string,
            i.ext as FileExtension,
            i.dir as string,
          );
        },
        validPathTests.file.o,
      );
      table.render();
      table = resetTable();
    });
  },
});
Deno.test({
  name: "file.ts",
  fn: async () => {
    await writeFile().then(async (v) => {
      await testFunctionAsync(
        "validPath - noFile",
        table,
        (
          i = validPathTests.nofile.i as Record<string, unknown>,
        ) => {
          return validPath(
            i.file as string,
            i.ext as FileExtension,
            i.dir as string,
          );
        },
        validPathTests.nofile.o,
      );
      table.render();
      table = resetTable();
    });
  },
});
Deno.test({
  name: "file.ts",
  fn: async () => {
    await writeFile().then(async (v) => {
      await testFunctionAsync(
        "importDefault - file",
        table,
        async (
          i = importTests.file.i as Record<string, unknown>,
        ) => {
          return await importDefault(
            i.importPath as string,
            i.options as ImportOptions,
            i.cache as Record<string, unknown>,
          );
        },
        importTests.file.o,
      );
      table.render();
      table = resetTable();
    });
  },
});
Deno.test({
  name: "file.ts",
  fn: async () => {
    await writeFile().then(async (v) => {
      await testFunctionAsync(
        "importDefault - reload",
        table,
        async (
          i = importTests.reload.i as Record<string, unknown>,
        ) => {
          return await importDefault(
            i.importPath as string,
            i.options as ImportOptions,
            i.cache as Record<string, unknown>,
          );
        },
        importTests.reload.o,
      );
      table.render();
      table = resetTable();
    });
  },
});
Deno.test({
  name: "file.ts",
  fn: async () => {
    await writeFile().then(async (v) => {
      await testFunctionAsync(
        "importDefault - cache",
        table,
        async (
          i = importTests.cache.i as Record<string, unknown>,
        ) => {
          return await importDefault(
            i.importPath as string,
            i.options as ImportOptions,
            i.cache as Record<string, unknown>,
          );
        },
        importTests.cache.o,
      );
      table.render();
      table = resetTable();
    });
  },
});
Deno.test({
  name: "file.ts",
  fn: async () => {
    await writeFile().then(async (v) => {
      await testFunctionAsync(
        "importDefault - colon",
        table,
        async (
          i = importTests.colon.i as Record<string, unknown>,
        ) => {
          return await importDefault(
            i.importPath as string,
            i.options as ImportOptions,
            i.cache as Record<string, unknown>,
          );
        },
        importTests.colon.o,
      );
      table.render();
      table = resetTable();
    });
  },
});
Deno.test({
  name: "file.ts",
  fn: async () => {
    await testFunctionAsync(
      "importDefault - nofile",
      table,
      (
        i = importTests.nofile.i as Record<string, unknown>,
      ) => {
        return importDefault(
          i.importPath as string,
          i.options as ImportOptions,
          i.cache as Record<string, unknown>,
        );
      },
      importTests.nofile.o,
    );
    table.render();
    table = resetTable();
  },
});
