import {
  EnumANSIPrefix,
  EnumANSISuffix,
  resetTable,
  testFunction,
} from "trailmix/common/mod.ts";
import {
  Color,
  messageByFn,
  messageByFnSpread,
  messageByString,
  messageByStringSpread,
  random,
  randomOpts,
  randomStyleFn,
  randomStyleString,
  stylesMap,
  StyleType,
} from "trailmix/color/mod.ts";
import type { Style, StyleFn } from "trailmix/color/mod.ts";
import { assertEquals, assertMatch } from "trailmix/deps.ts";

let table = resetTable();

// pass in fn name, optional: (class bool, spread bool)
// return function to testType
function getTarget(
  fn: string,
  c = false,
  s = false,
): (...args: unknown[]) => unknown {
  const fns: Record<string, unknown> = {
    messageByFn: s
      ? (c ? Color.messageByFnSpread : messageByFnSpread)
      : c
      ? Color.messageByFn
      : messageByFn,
    messageByString: s
      ? c ? Color.messageByStringSpread : messageByStringSpread
      : c
      ? Color.messageByString
      : messageByString,
    randomOpts: c ? Color.randomOpts : randomOpts,
    randomStyleFn: c ? Color.randomStyleFn : randomStyleFn,
    randomStyleString: c ? Color.randomStyleString : randomStyleString,
    random: c ? Color.random : random,
  };
  return fns[fn] as (...args: unknown[]) => unknown;
}
function testString(
  str: string,
  opts: (keyof typeof EnumANSISuffix | keyof typeof EnumANSIPrefix)[] = [],
) {
  let ret = str;
  for (const opt in opts) {
    ret = EnumANSIPrefix[opts[opt]] + ret + EnumANSISuffix[opts[opt]];
  }
  return ret;
}

function testRegExp(prefix?: string, suffix?: string) {
  let ret = new RegExp(
    /(\\u001b\[[0-9]{1,3}m)*(color|bgColor|emphasis)+(\\u001b\[[0-9]{1,3}m)*/,
  );
  if (prefix !== undefined && suffix !== undefined) {
    ret = new RegExp(
      "\\S*(\\u001b\\[" + prefix +
        "m){0,1}\\S*(color|emphasis|bgColor){1}\\S*(\\u001b\\[" + suffix +
        "m){0,1}\\S*",
    );
  }
  return ret;
}
const randomTests: Record<
  string,
  Record<
    string,
    Record<
      string,
      Record<
        "i" | "o",
        Record<string, boolean | Style> | string | boolean | RegExp
      >
    >
  >
> = {
  random: {
    string: {
      color: {
        i: { color: "green", bgColor: false, emphasis: false },
        o: testRegExp("32", "39"),
      },
      bgColor: {
        i: { color: false, bgColor: "bgRed", emphasis: false },
        o: testRegExp("41", "49"),
      },
      emphasis: {
        i: { color: false, bgColor: false, emphasis: "bold" },
        o: testRegExp("1", "22"),
      },
    },
    boolean: {
      color: {
        i: { color: true, bgColor: false, emphasis: false },
        o: testRegExp(),
      },
      bgColor: {
        i: { color: false, bgColor: true, emphasis: false },
        o: testRegExp(),
      },
      emphasis: {
        i: { color: false, bgColor: false, emphasis: true },
        o: testRegExp(),
      },
    },
  },
  randomOpts: {
    string: {
      color: { i: { color: "green" }, o: "green" },
      bgColor: { i: { bgColor: "bgRed" }, o: "bgRed" },
      emphasis: { i: { emphasis: "bold" }, o: "bold" },
    },
    false: {
      color: { i: { color: false }, o: false },
      bgColor: { i: { bgColor: false }, o: false },
      emphasis: { i: { emphasis: false }, o: false },
    },
    true: {
      color: { i: { color: true }, o: true },
      bgColor: { i: { bgColor: true }, o: true },
      emphasis: { i: { emphasis: true }, o: true },
    },
  },
};
const newTests: Record<
  string,
  Record<
    string,
    Record<
      "i" | "o",
      (string | StyleFn | undefined)[] | undefined[] | string | undefined
    >
  >
> = {
  messageByFn: {
    stringEmpty: {
      i: "",
      o: "",
    },
    stringUndefined: {
      i: undefined,
      o: "undefined",
    },
    stringUndefinedSet: {
      i: [stylesMap.color.red, undefined],
      o: testString("stringUndefinedSet", ["r"]),
    },
    stringColor: {
      i: [stylesMap.color.green],
      o: testString("stringColor", ["g"]),
    },
    stringBgColor: {
      i: [stylesMap.bgColor.bgRed],
      o: testString("stringBgColor", ["bg_r"]),
    },
    stringEmphasis: {
      i: [stylesMap.emphasis.bold],
      o: testString("stringEmphasis", ["B"]),
    },
    stringColorBgColor: {
      i: [stylesMap.color.yellow, stylesMap.bgColor.bgGreen],
      o: testString("stringColorBgColor", ["y", "bg_g"]),
    },
    stringBgColorEmphasis: {
      i: [stylesMap.bgColor.bgRed, stylesMap.emphasis.bold],
      o: testString("stringBgColorEmphasis", ["bg_r", "B"]),
    },
    stringColorEmphasis: {
      i: [stylesMap.color.red, stylesMap.emphasis.underline],
      o: testString("stringColorEmphasis", ["r", "U"]),
    },
    stringColorBgColorEmphasis: {
      i: [
        stylesMap.color.red,
        stylesMap.bgColor.bgYellow,
        stylesMap.emphasis.underline,
      ],
      o: testString("stringColorBgColorEmphasis", ["r", "bg_y", "U"]),
    },
  },
  messageByString: {
    stringEmpty: { i: [], o: "" },
    stringUndefined: { i: [undefined], o: "" },
    stringUndefinedSet: {
      i: ["red", undefined],
      o: testString("stringUndefinedSet", ["r"]),
    },
    stringColor: { i: ["green"], o: testString("stringColor", ["g"]) },
    stringBgColor: { i: ["bgRed"], o: testString("stringBgColor", ["bg_r"]) },
    stringEmphasis: { i: ["bold"], o: testString("stringEmphasis", ["B"]) },
    stringColorBgColor: {
      i: ["yellow", "bgGreen"],
      o: testString("stringColorBgColor", ["y", "bg_g"]),
    },
    stringBgColorEmphasis: {
      i: ["bgRed", "bold"],
      o: testString("stringBgColorEmphasis", ["bg_r", "B"]),
    },
    stringColorEmphasis: {
      i: ["red", "underline"],
      o: testString("stringColorEmphasis", ["r", "U"]),
    },
    stringColorBgColorEmphasis: {
      i: ["red", "bgYellow", "underline"],
      o: testString("stringColorBgColorEmphasis", ["r", "bg_y", "U"]),
    },
  },
};
for (const style of Object.keys(stylesMap) as StyleType[]) {
  for (const testfn of Object.keys(stylesMap[style]) as Style[]) {
    Deno.test({
      name: `Color.ts - styleMap tests...`,
      fn: () => {
        let fn = stylesMap[style][testfn];
        testFunction(
          `style:${style}, testType:${testfn}`,
          table,
          (i = style) => fn(i),
          stylesMap[style][testfn](style),
          true,
          false,
        );
        table.render();
        table = resetTable();
      },
    });
  }
}
for (const testFn of Object.keys(randomTests)) {
  for (const testType of Object.keys(randomTests[testFn])) {
    for (const testArg of Object.keys(randomTests[testFn][testType])) {
      for (const c of [true, false]) {
        Deno.test({
          name: "testType",
          // only: true,
          fn: () => {
            const fn = getTarget(testFn, c); // get function to test
            const args = randomTests[testFn][testType][testArg].i; // get input argument
            testFunction(
              `testFn:${testFn}, testType:${testType}, testArg:${testArg}, fromClass:${c}\n`,
              table,
              (
                _fn = fn,
                _args = args,
                _testFn = testFn,
                _testArg = testArg,
              ) => {
                if (_testFn === "random") return _fn(_testArg, _args);
                else return _fn(_args);
              },
              (
                _actual: any,
                _expected = randomTests[testFn][testType][testArg].o,
                _testArg = testArg,
                _testFn = testFn,
              ) => {
                let expected = _expected;
                if (_testFn === "randomOpts") {
                  expected = { ..._actual, ...{ [_testArg]: _expected } };
                  assertEquals(_actual, expected);
                  return expected;
                } else {
                  assertMatch(_actual, expected as RegExp);
                  return _actual;
                }
              },
              true,
              false,
            );
            table.render();
            table = resetTable();
          },
        });
      }
    }
  }
}
for (const testfn of Object.keys(newTests)) {
  for (const testType of Object.keys(newTests[testfn])) {
    for (const c of [true, false]) {
      for (const s of [true, false]) {
        if (["stringEmpty", "stringUndefined"].includes(testType) && s) break;
        Deno.test({
          // only: true,
          name: `Color.ts - ${testfn} tests...`,
          fn: () => {
            const fn = getTarget(testfn, c, s);
            const args = newTests[testfn][testType].i;
            const e = newTests[testfn][testType].o;
            testFunction(
              `testFn:${testfn}, testType:${testType}, spread:${s}, fromClass:${c}\n`,
              table,
              (_fn = fn, _args = args, _s = s, _testType = testType) => {
                if (typeof args === "string") return _fn(_args);
                if (_s && _args !== undefined) {
                  return _fn(_testType, ..._args);
                } else return _fn(_testType, _args);
              },
              e,
              true,
              false,
            );
            table.render();
            table = resetTable();
          },
        });
      }
    }
  }
}
