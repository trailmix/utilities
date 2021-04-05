import { mergeDeep, resetTable, testFunction } from "trailmix/common/mod.ts";

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
    new RangeError("Uh-oh!"),
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
  // ...(() => {
  //   let ret = {};
  //   for (const m in messages) {
  //     ret = {
  //       ...ret,
  //       ...{
  //         ["merge" + m]: {
  //           i: {
  //             ...{ message: messages[m], test: { message: messages[m] } },
  //           },
  //           o: {
  //             ...{ message: messages[m], test: { message: messages[m] } },
  //           },
  //         },
  //       },
  //     };
  //   }
  //   return ret;
  // })(),
  ...{
    string: {
      i: { message: new RangeError("Uh-oh!").message },
      o: { message: "Uh-oh!" },
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

for (const test in tests) {
  for (const messageType in messages) {
    for (const message in messages[messageType]) {
      Deno.test({
        name: "Array.ts",
        fn: () => {
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
        },
      });
      if (messageType === "object") {
        Deno.test({
          name: "Array.ts - recursive",
          fn: () => {
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
            if (
              Object.keys(tests).length - 1 === Object.keys(tests).indexOf(test)
            ) {
              table.render();
              table = resetTable();
            }
          },
        });
      }
    }
  }
}
