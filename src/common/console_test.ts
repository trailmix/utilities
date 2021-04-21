import {
  ansiColor,
  consoleColor,
  resetTable,
  testFunction,
} from "trailmix/common/mod.ts";
import { Log } from "trailmix/log/mod.ts";
import { join, resolve, toFileUrl } from "trailmix/deps.ts";

let table = resetTable();
const consoleColorTests: Record<
  string,
  Record<
    "i" | "o",
    | string
    | unknown
    | Record<string, string | unknown>
  >
> = {
  string: {
    i: "test",
    o: '%c"test"%c',
  },
  number: {
    i: 1234,
    o: "%c1234%c",
  },
  bigint: {
    i: 9007199254740999007199254740990n,
    o: "%c9007199254740999007199254740990%c",
  },
  boolean: {
    i: true,
    o: "%ctrue%c",
  },
  null: {
    i: null,
    o: "%cnull%c",
  },
  undefined: {
    i: undefined,
    o: "%cundefined%c",
  },
  symbol: {
    i: Symbol("key"),
    o: "%cSymbol(%c%ckey%c%c)%c",
  },
  error: {
    i: new Error("test"),
    o: `%cError: test%c\n%c    at ${
      toFileUrl(resolve(join(Deno.cwd(), "src", "common", "console_test.ts")))
    }%c%c:49%c%c:8%c`,
  },
  object: {
    i: { "test": "test" },
    o: '{\n  %c"test":%c %c"test"%c\n}',
  },
  log: {
    i: Log.error("test"),
    o: "[\u001b[31mdefault\u001b[39m] \u001b[31mtest\u001b[39m",
  },
  logArguments: {
    i: Log.success("test", { test: "test" }),
    o: '[\u001b[1m\u001b[32mdefault\u001b[39m\u001b[22m] \u001b[1m\u001b[32mtest\u001b[39m\u001b[22m \u001b[38;2;46;139;87m\u001b[39m\nArguments:[\n  {\n    \u001b[38;2;255;255;0m"test":\u001b[39m \u001b[38;2;46;139;87m"test"\u001b[39m\n  }\n]',
  },
};
const ansiColorTests: Record<
  string,
  Record<
    "i" | "o",
    | string
    | unknown
    | Record<string, string | unknown>
  >
> = {
  string: {
    i: "test",
    o: "\u001b[38;2;46;139;87mtest\u001b[39m",
  },
  number: {
    i: 1234,
    o: "\u001b[38;2;255;215;0m1234\u001b[39m",
  },
  bigint: {
    i: 9007199254740999007199254740990n,
    o: "\u001b[38;2;255;140;0m9007199254740999007199254740990\u001b[39m",
  },
  boolean: {
    i: true,
    o: "\u001b[38;2;0;191;255mtrue\u001b[39m",
  },
  null: {
    i: null,
    o: "\u001b[38;2;255;0;255mnull\u001b[39m",
  },
  undefined: {
    i: undefined,
    o: "\u001b[38;2;139;0;139mundefined\u001b[39m",
  },
  symbol: {
    i: Symbol("key"),
    o: "\u001b[38;2;139;0;0mSymbol(\u001b[39m\u001b[38;2;255;255;0mkey\u001b[39m\u001b[38;2;139;0;0m)\u001b[39m",
  },
  error: {
    i: new Error("test"),
    o: `\u001b[38;2;255;0;0mError: test\u001b[39m\n\u001b[38;2;46;139;87m    at ${
      toFileUrl(resolve(join(Deno.cwd(), "src", "common", "console_test.ts")))
    }\u001b[39m\u001b[38;2;255;215;0m:105\u001b[39m\u001b[38;2;255;0;0m:8\u001b[39m`,
  },
  object: {
    i: { test: "test" },
    o: '{\n  \u001b[38;2;255;255;0m"test":\u001b[39m \u001b[38;2;46;139;87m"test"\u001b[39m\n}',
  },
  log: {
    i: Log.error("test"),
    o: "[\u001b[31mdefault\u001b[39m] \u001b[31mtest\u001b[39m",
  },
  logArguments: {
    i: Log.success("test", { test: "test" }),
    o: '[\u001b[1m\u001b[32mdefault\u001b[39m\u001b[22m] \u001b[1m\u001b[32mtest\u001b[39m\u001b[22m \nArguments:[\n  {\n    \u001b[38;2;255;255;0m"test":\u001b[39m \u001b[38;2;46;139;87m"test"\u001b[39m\n  }\n]',
  },
};

const ogConsole = console;
Deno.test({
  name: "console.ts",
  // only: true,
  fn: () => {
    for (const primitive in consoleColorTests) {
      const mockConsole = {
        ...ogConsole,
        ...{
          log: (str: string): string => {
            // this demonstrates actual console usage
            ogConsole.log("real usage:");
            consoleColor(consoleColorTests[primitive].i, ogConsole);
            return str;
          },
        },
      };
      testFunction(
        "consoleColor " + primitive,
        table,
        consoleColor(consoleColorTests[primitive].i, mockConsole),
        consoleColorTests[primitive].o,
        true,
        false,
      );
      table.render();
      table = resetTable();
    }
  },
});
Deno.test({
  name: "console.ts",
  fn: () => {
    for (const primitive in ansiColorTests) {
      testFunction(
        "ansiColor " + primitive,
        table,
        ansiColor(ansiColorTests[primitive].i),
        ansiColorTests[primitive].o,
        true,
        false,
      );
      table.render();
      table = resetTable();
    }
  },
});
Deno.test({
  name: "console.ts",
  fn: () => {
    testFunction(
      "ansiColor full test",
      table,
      ansiColor(
        {
          string: ansiColorTests.string.i,
          number: ansiColorTests.number.i,
          bigint: ansiColorTests.bigint.i,
          boolean: ansiColorTests.boolean.i,
          null: ansiColorTests.null.i,
          undefined: ansiColorTests.undefined.i,
          symbol: ansiColorTests.symbol.i,
          error: ansiColorTests.error.i,
          object: ansiColorTests.object.i,
          log: ansiColorTests.log.i,
          logArguments: ansiColorTests.logArguments.i,
        },
      ),
      `{\n  \u001b[38;2;255;255;0m"string":\u001b[39m \u001b[38;2;46;139;87m"test"\u001b[39m\u001b[38;2;46;139;87m,\u001b[39m\n  \u001b[38;2;255;255;0m"number":\u001b[39m \u001b[38;2;255;215;0m1234,\u001b[39m\n  \u001b[38;2;255;255;0m"bigint":\u001b[39m \u001b[38;2;255;140;0m9007199254740999007199254740990\u001b[39m\u001b[38;2;46;139;87m,\u001b[39m\n  \u001b[38;2;255;255;0m"boolean":\u001b[39m \u001b[38;2;0;191;255mtrue\u001b[39m\u001b[38;2;46;139;87m,\u001b[39m\n  \u001b[38;2;255;255;0m"null":\u001b[39m \u001b[38;2;255;0;255mnull\u001b[39m\u001b[38;2;46;139;87m,\u001b[39m\n  \u001b[38;2;255;255;0m"undefined":\u001b[39m \u001b[38;2;139;0;139mundefined\u001b[39m\u001b[38;2;46;139;87m,\u001b[39m\n  \u001b[38;2;255;255;0m"symbol":\u001b[39m \u001b[38;2;139;0;0mSymbol(\u001b[39m\u001b[38;2;255;255;0mkey\u001b[39m\u001b[38;2;139;0;0m)\u001b[39m\u001b[38;2;46;139;87m,\u001b[39m\n  \u001b[38;2;255;255;0m"error":\u001b[39m \u001b[38;2;255;0;0m"Error: test\u001b[39m\n\u001b[38;2;46;139;87m    at ${
        toFileUrl(resolve(join(Deno.cwd(), "src", "common", "console_test.ts")))
      }\u001b[39m\u001b[38;2;255;215;0m:105\u001b[39m\u001b[38;2;255;0;0m:8"\u001b[39m\u001b[38;2;46;139;87m,\u001b[39m\n  \u001b[38;2;255;255;0m"object":\u001b[39m {\n    \u001b[38;2;255;255;0m"test":\u001b[39m \u001b[38;2;46;139;87m"test"\u001b[39m\n  }\u001b[38;2;46;139;87m,\u001b[39m\n  \u001b[38;2;255;255;0m"log":\u001b[39m \u001b[38;2;255;255;255m[\u001b[31mdefault\u001b[39m] \u001b[31mtest\u001b[39m\u001b[39m\u001b[38;2;46;139;87m,\u001b[39m\n  \u001b[38;2;255;255;0m"logArguments":\u001b[39m \u001b[38;2;255;255;255m[\u001b[1m\u001b[32mdefault\u001b[39m\u001b[22m] \u001b[1m\u001b[32mtest\u001b[39m\u001b[22m \u001b[38;2;46;139;87m\u001b[39m\nArguments:[\n  {\n    \u001b[38;2;255;255;0m"test":\u001b[39m \u001b[38;2;46;139;87m"test"\u001b[39m\n  }\n]\u001b[39m\n}`,
      true,
      false,
    );
    table.render();
    table = resetTable();
  },
});
