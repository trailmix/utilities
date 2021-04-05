import {
  ansiColor,
  consoleColor,
  resetTable,
  testFunction,
} from "trailmix/common/mod.ts";

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
    o: "test",
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
    o: "%cSymbol%c(key)",
  },
  error: {
    i: new Error("test"),
    o: "%cError: test%c\n    at file:///Users/bkillian/trailmix/utilities/src/common/console_test.ts:%c47%c:%c8%c",
  },
  object: {
    i: { test: "test" },
    o: '{\n  %c"test":%c %c"test"%c\n}',
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
    i: '"test"',
    o: '\u001b[38;2;46;139;87m"test"\u001b[39m',
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
    o: "\u001b[38;2;139;0;0mSymbol\u001b[39m(key)",
  },
  error: {
    i: new Error("test"),
    o: "\u001b[38;2;255;0;0mError: test\u001b[39m\n    at file:///Users/bkillian/trailmix/utilities/src/common/console_test.ts:\u001b[38;2;255;215;0m93\u001b[39m:\u001b[38;2;255;215;0m8\u001b[39m",
  },
  object: {
    i: { test: "test" },
    o: '{\n  \u001b[38;2;255;255;0m"test":\u001b[39m \u001b[38;2;46;139;87m"test"\u001b[39m\n}',
  },
};
const ogConsole = console;
Deno.test({
  name: "console.ts",
  fn: () => {
    for (const primitive in consoleColorTests) {
      const mockConsole = {
        ...ogConsole,
        ...{
          log: (str: string): string => {
            // this demonstrates actual console usage
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
        "consoleColor " + primitive,
        table,
        ansiColor(ansiColorTests[primitive].i),
        ansiColorTests[primitive].o,
      );
      table.render();
      table = resetTable();
    }
  },
});
