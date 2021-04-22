import {
  mergeDeep,
  renderTable,
  resetTable,
  testFunction,
} from "trailmix/common/mod.ts";
import { join, resolve, toFileUrl } from "trailmix/deps.ts";
let table = resetTable();
const messages: Record<string, any> = {
  string: ["string", `${Deno.env.get("HOME")}`, Object.keys(Deno)[0]],
  numbers: [
    1,
    Number.MAX_SAFE_INTEGER, // max number
    9007199254740999007199254740990n, // bigint
  ],
  boolean: [true, false],
  undefined: [undefined],
  null: [null],
  object: [
    new RangeError("Uh-oh!").stack!,
    { test1: "test" },
    { test2: ["a", true, 3] },
    { test3: { testInner: "test" } },
    Deno.version,
    { deno: { ...Deno.version, ...Deno.build } },
    { deno: [Deno.version, Deno.build] },
    { deno: { version: Deno.version, build: Deno.build } },
  ],
};

const tests: Record<
  string,
  Record<
    "i" | "o",
    Record<string, any>
  > | any
> = {
  ...{
    string: {
      i: { message: new RangeError("Uh-oh!") },
      o: {
        message: `RangeError: Uh-oh!\n    at ${
          toFileUrl(
            resolve(join(Deno.cwd(), "src", "common", "object_test.ts")),
          )
        }:40:21`,
      },
    },
    number: {
      i: { message: 1 },
      o: { message: 1 },
    },
    boolean: {
      i: { message: true },
      o: { message: true },
    },
    array: {
      i: { message: ["1", 1, true] },
      o: { message: ["1", 1, true] },
    },
    object: {
      i: { message: { obj1: "one" } },
      o: { message: { obj1: "one" } },
    },
    undefined: {
      i: { message: undefined },
      o: { message: undefined },
    },
  },
};

Deno.test({
  name: "object.ts",
  fn: () => {
    for (const test in tests) {
      for (const messageType in messages) {
        for (const message in messages[messageType]) {
          testFunction(
            test + " " + messageType + " " + message,
            table,
            mergeDeep({
              [test]: messages[messageType][message],
            }, { ...tests[test].i }),
            {
              ...{ [test]: messages[messageType][message] },
              ...{ ...tests[test].o },
            },
          );
          if (messageType === "object") {
            testFunction(
              test + " " + messageType + " " + message,
              table,
              mergeDeep({
                [test]: messages[messageType][message],
              }, {
                ...tests[test].i,
                [test]: messages[messageType][message],
              }),
              {
                ...{ [test]: messages[messageType][message] },
                ...{
                  ...tests[test].o,
                  [test]: messages[messageType][message],
                },
              },
            );
          }
          table = renderTable(table, false);
        }
      }
    }
    table = renderTable(table, true);
  },
});
