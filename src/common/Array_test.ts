import { unique } from "trailmix/common/Array.ts";
import { resetTable, testFunction } from "test/common/table.ts";

let table = resetTable();
// let testCases: string[] = [];
const tests: Record<
  string,
  Record<
    "i" | "o",
    (
      | string
      | number
      | boolean
      | undefined
      | Record<string, string>
      | (string | number | boolean)[]
    )[]
  >
> = {
  string: {
    i: ["1", "1", "2"],
    o: ["1", "2"],
  },
  number: {
    i: [1, 1, 2],
    o: [1, 2],
  },
  boolean: {
    i: [true, true, false],
    o: [true, false],
  },
  array: {
    i: [
      ["1", 1, true],
      ["1", 1, true],
      ["2", 2, false],
    ],
    o: [
      ["1", 1, true],
      ["2", 2, false],
    ],
  },
  object: {
    i: [{ test: "test1" }, { test: "test1" }, { test: "test2" }],
    o: [{ test: "test1" }, { test: "test2" }],
  },
  undefined: {
    i: [undefined, undefined, 1],
    o: [undefined, 1],
  },
};
for (const test of Object.keys(tests)) {
  Deno.test({
    name: "Array.ts",
    fn: () => {
      let fn = unique;
      try {
        testFunction(
          test,
          table,
          (i = tests[test].i) => fn(i),
          tests[test].o,
          ["string", "number", "boolean", "object", "undefined", "array"]
            .includes(test),
        );
      } finally {
        if (
          Object.keys(tests).length - 1 === Object.keys(tests).indexOf(test)
        ) {
          table.render();
          table = resetTable();
        }
      }
    },
  });
}
