import { assertEquals, Table, unimplemented } from "trailmix/deps.ts";
import {
  ansiColor,
  cell,
  EnumANSIPrefix,
  EnumANSISuffix,
  resetTable,
  row,
  stringifyAny,
  TestEmojiEnum,
} from "trailmix/common/mod.ts";
import type {
  FailureResult,
  Result,
  SuccessResult,
  TestActualFunction,
  TestExpectedFunction,
  TestType,
  UnimplementedResult,
} from "trailmix/common/mod.ts";
/** 
 * 
 * @param type type of test
 * @param testName name of test string
 * @returns formatted test title string with emojis
 */
function testTitle(type: TestType, testName?: string) {
  const e: "br" | "by" | "bg" = type === "success"
    ? "bg"
    : type === "failure"
    ? "br"
    : "by";
  const ret = TestEmojiEnum[e] + "\t" + EnumANSIPrefix.B + EnumANSIPrefix.U +
    EnumANSIPrefix[e] + (testName ?? type).trim() + EnumANSISuffix[e] +
    EnumANSISuffix.U + EnumANSISuffix.B + " " + type;
  return ret;
}
function buildTestResult(
  type: TestType,
  { testName, actual, expected, e }: Omit<Result, "table">,
  color = true,
): Table {
  const eq = type === "failure" ? "!==" : "===";
  const eqCell = cell(eq, 3);
  const ret = [
    row([cell("\n" + testTitle(type, testName), 5)], false),
  ] as Table;
  if (type === "unimplemented") return ret;
  if (type === "failure" && e !== undefined) ret.push(row([cell(e, 5)], false));
  const a = color ? ansiColor(actual) : stringifyAny(actual);
  const ex = color ? ansiColor(expected) : stringifyAny(expected);
  ret.push(
    row([cell(a), eqCell, cell(ex)]),
  );
  if (
    typeof actual === "string" && typeof expected === "string" &&
    actual.toString() !== p(actual).toString() &&
    expected.toString() !== p(expected).toString()
  ) {
    ret.push(
      row([cell(p(a)), eqCell, cell(p(ex))]),
    );
  }
  return ret;
}
function p(s: string) {
  return JSON.parse(JSON.stringify(s));
}

export function testFunction(
  testName: string,
  table: Table,
  actual: TestActualFunction,
  expected: TestExpectedFunction,
  implemented = true,
  color = true,
) {
  const result: Result = {
    table: table,
    testName: testName,
  };
  if (!implemented) {
    unimplemented(`Function type ${testName} not implemented`);
  }
  try {
    if (typeof actual === "function") result.actual = actual();
    else result.actual = actual;
  } catch (e) {
    if (typeof e === "object") {
      result.e = String(e.stack);
      defaultErrorTestCase(result as FailureResult);
    }
  } finally {
    if (typeof expected === "function") {
      result.expected = expected(result.actual);
    } else result.expected = expected;
    try {
      defaultTestCase(result);
    } catch (e) {
      table.render();
      throw e;
    }
  }
  table.push(
    ...buildTestResult("success", result as SuccessResult, color),
  );
}

// eslint-disable-next-line max-params
export async function testFunctionAsync(
  testName: string,
  table: Table,
  actual: TestActualFunction,
  expected: TestExpectedFunction,
  implemented = true,
) {
  const result: Result = {
    table: table,
    testName: testName,
  };
  if (!implemented) {
    unimplemented(`Function type ${testName} not implemented`);
  }
  try {
    if (typeof actual === "function") result.actual = await actual();
    else result.actual = actual;
  } catch (e) {
    if (typeof e === "object") {
      result.e = String(e.stack);
      defaultErrorTestCase(result as FailureResult);
    }
  } finally {
    if (typeof expected === "function") {
      result.expected = await expected(result.actual);
    } else result.expected = expected;
    try {
      defaultTestCase(result);
    } catch (e) {
      table.render();
      throw e;
    }
  }
  table.push(
    ...buildTestResult("success", result as SuccessResult),
  );
}
function defaultErrorTestCase(
  result: FailureResult,
) {
  if (result.e.includes("not implemented")) {
    result.table.push(
      ...buildTestResult("unimplemented", result as UnimplementedResult),
    );
  } else if (result.e.split(":")[0].includes("AssertionError")) {
    result.table.push(...buildTestResult("failure", result as FailureResult));
    resetTable({ table: result.table, maxColWidth: 300, minColWidth: 50 })
      .render();
    throw result.e;
  } else if (result.e.split(":")[0].includes("Error")) {
    result.actual = result.e.split(":")[0];
  } else {
    result.table.push(...buildTestResult("failure", result as FailureResult));
  }
}
// function defaultErrorTestCase
function defaultTestCase({ actual, expected, testName }: Result) {
  assertEquals(
    stringifyAny(actual),
    stringifyAny(expected),
    `${testName} failure: (actual !== expected)\n${stringifyAny(actual)}\n${
      stringifyAny(expected)
    }`,
  );
  if (
    typeof actual === "string" && actual !== p(actual) &&
    expected !== p(expected)
  ) {
    assertEquals(
      p(actual),
      p(expected),
      `${testName} JSON.parse() messages failure: (actual !== expected)\n${
        p(actual)
      }\n${p(expected)}`,
    );
  }
}
