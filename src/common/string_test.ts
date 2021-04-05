import {
  consoleColor,
  resetTable,
  stringifyAny,
  stringifyBigInt,
  testFunction,
} from "trailmix/common/mod.ts";

let table = resetTable();

const stringifyBigIntTests: Record<
  string,
  Record<
    "i" | "o",
    | string
    | unknown
    | Record<string, string | unknown>
  >
> = {
  bigint: {
    i: 9007199254740999007199254740990n,
    o: 9007199254740999007199254740990n,
  },
  not: {
    i: 1234,
    o: 1234,
  },
};
const stringifyAnyTests: Record<
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
    o: 1234,
  },
  bigint: {
    i: 9007199254740999007199254740990n,
    o: 9007199254740999007199254740990n,
  },
  boolean: {
    i: true,
    o: true,
  },
  null: {
    i: null,
    o: null,
  },
  undefined: {
    i: undefined,
    o: undefined,
  },
  symbol: {
    i: Symbol("key"),
    o: Symbol("key"),
  },
  error: {
    i: new Error("test"),
    o: "Error: test\n    at file:///Users/bkillian/trailmix/utilities/src/common/string_test.ts:67:8",
  },
  object: {
    i: { test: "test" },
    o: { test: "test" },
  },
};

Deno.test({
  name: "string.ts",
  fn: () => {
    testFunction(
      "stringifyBigInt - bigint",
      table,
      stringifyBigInt("bigint", stringifyBigIntTests.bigint.i),
      stringifyBigIntTests.bigint.o,
    );
    table.render();
    table = resetTable();
  },
});
Deno.test({
  name: "string.ts",
  fn: () => {
    testFunction(
      "stringifyBigInt - not",
      table,
      stringifyBigInt("not", stringifyBigIntTests.not.i),
      stringifyBigIntTests.not.o,
    );
    table.render();
    table = resetTable();
  },
});
Deno.test({
  name: "string.ts",
  fn: () => {
    testFunction(
      "stringifyAny - string",
      table,
      stringifyAny(stringifyAnyTests.string.i),
      stringifyAnyTests.string.o,
    );
    table.render();
    table = resetTable();
  },
});
Deno.test({
  name: "string.ts",
  fn: () => {
    testFunction(
      "stringifyAny - number",
      table,
      stringifyAny(stringifyAnyTests.number.i),
      stringifyAnyTests.number.o,
    );
    table.render();
    table = resetTable();
  },
});
Deno.test({
  name: "string.ts",
  fn: () => {
    testFunction(
      "stringifyAny - bigint",
      table,
      stringifyAny(stringifyAnyTests.bigint.i),
      stringifyAnyTests.bigint.o,
    );
    table.render();
    table = resetTable();
  },
});
Deno.test({
  name: "string.ts",
  fn: () => {
    testFunction(
      "stringifyAny - boolean",
      table,
      stringifyAny(stringifyAnyTests.boolean.i),
      stringifyAnyTests.boolean.o,
    );
    table.render();
    table = resetTable();
  },
});
Deno.test({
  name: "string.ts",
  fn: () => {
    testFunction(
      "stringifyAny - undefined",
      table,
      stringifyAny(stringifyAnyTests.undefined.i),
      stringifyAnyTests.undefined.o,
    );
    table.render();
    table = resetTable();
  },
});
Deno.test({
  name: "string.ts",
  fn: () => {
    testFunction(
      "stringifyAny - symbol",
      table,
      stringifyAny(stringifyAnyTests.symbol.i),
      stringifyAnyTests.symbol.o,
    );
    table.render();
    table = resetTable();
  },
});
Deno.test({
  name: "string.ts",
  fn: () => {
    testFunction(
      "stringifyAny - error",
      table,
      stringifyAny(stringifyAnyTests.error.i),
      stringifyAnyTests.error.o,
    );
    table.render();
    table = resetTable();
  },
});
Deno.test({
  name: "string.ts",
  fn: () => {
    testFunction(
      "stringifyAny - object",
      table,
      stringifyAny(stringifyAnyTests.object.i),
      stringifyAnyTests.object.o,
    );
    table.render();
    table = resetTable();
  },
});
Deno.test({
  name: "string.ts",
  fn: () => {
    testFunction(
      "stringifyAny - null",
      table,
      stringifyAny(stringifyAnyTests.null.i),
      stringifyAnyTests.null.o,
    );
    table.render();
    table = resetTable();
  },
});
