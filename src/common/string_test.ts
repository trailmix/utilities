import {
  renderTable,
  resetTable,
  stringifyAny,
  stringifyBigInt,
  testFunction,
} from "trailmix/common/mod.ts";
import { join, resolve, toFileUrl } from "trailmix/deps.ts";

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
    o: "9007199254740999007199254740990",
  },
  not: { i: 1234, o: "1234" },
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
  string: { i: "test", o: "test" },
  number: { i: 1234, o: "1234" },
  bigint: {
    i: 9007199254740999007199254740990n,
    o: 9007199254740999007199254740990n,
  },
  boolean: { i: true, o: true },
  null: { i: null, o: null },
  undefined: { i: undefined, o: undefined },
  symbol: { i: Symbol("key"), o: Symbol("key") },
  error: {
    i: new Error("test"),
    o: `\"Error: test\\n    at ${
      toFileUrl(resolve(join(Deno.cwd(), "src", "common", "string_test.ts")))
    }:47:8\"`,
  },
  object: { i: { test: "test" }, o: { test: "test" } },
};

Deno.test({
  name: "string.ts",
  fn: () => {
    const f = testFunction;
    const fn = stringifyBigInt;
    const t = stringifyBigIntTests;
    f("stringifyBigInt - bigint", table, fn("bigint", t.bigint.i), t.bigint.o);
    f("stringifyBigInt - not", table, fn("not", t.not.i), t.not.o);
    table = renderTable(table, false);
  },
});
Deno.test({
  name: "string.ts",
  fn: () => {
    const f = testFunction;
    const fn = stringifyAny;
    const t = stringifyAnyTests;
    f("stringifyAny - string", table, fn(t.string.i), t.string.o);
    f("stringifyAny - number", table, fn(t.number.i), t.number.o);
    f("stringifyAny - bigint", table, fn(t.bigint.i), t.bigint.o);
    f("stringifyAny - boolean", table, fn(t.boolean.i), t.boolean.o);
    f("stringifyAny - undefined", table, fn(t.undefined.i), t.undefined.o);
    f("stringifyAny - symbol", table, fn(t.symbol.i), t.symbol.o);
    f("stringifyAny - error", table, fn(t.error.i), t.error.o);
    f("stringifyAny - object", table, fn(t.object.i), t.object.o);
    f("stringifyAny - null", table, fn(t.null.i), t.null.o);
    table = renderTable(table, true);
  },
});
