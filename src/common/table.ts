import {
  assertEquals,
  Cell,
  Row,
  Table,
  unimplemented,
} from "trailmix/deps.ts";
import { stringifyAny } from "trailmix/common/string.ts";
import {
  EnumANSIPrefix,
  EnumANSISuffix,
  TestEmojiEnum,
} from "trailmix/common/enum.ts";
import type {
  FailureResult,
  Result,
  SuccessResult,
  TableConfig,
  TestActualFunction,
  TestExpectedFunction,
  TestType,
  UnimplementedResult,
} from "trailmix/common/table.d.ts";

function cell(s: string, colSpan?: number) {
  let cell = Cell.from(String(s));
  cell = colSpan !== undefined ? cell.colSpan(colSpan) : cell;
  return cell;
}
function row(c: Cell[], border?: boolean) {
  let row = Row.from(c);
  row = border !== undefined ? row.border(border) : row;
  return row;
}
export function resetTable(
  config?: TableConfig,
): Table {
  const t: Table = Table.from(config?.table ?? []);
  if (config?.maxColWidth !== undefined) t.maxColWidth(config?.maxColWidth);
  if (config?.minColWidth !== undefined) t.minColWidth(config?.minColWidth);
  return t.border(true).padding(1).indent(2);
}
function testTitle(type: TestType, testName: string) {
  const e: "br" | "by" | "bg" = type === "success"
    ? "bg"
    : type === "failure"
    ? "br"
    : "by";
  return TestEmojiEnum[e] + "\t" + EnumANSIPrefix.B + EnumANSIPrefix.U +
    EnumANSIPrefix[e] + testName.trim() + EnumANSISuffix[e] +
    EnumANSISuffix.U + EnumANSISuffix.B + " " + type;
}
function testUnimplemented({ table, testName }: UnimplementedResult) {
  table.push(...buildTestResult("unimplemented", { testName: testName }));
}
function testSuccess({ table, testName, actual, expected }: SuccessResult) {
  table.push(
    ...buildTestResult("success", {
      testName: testName,
      actual: actual,
      expected: expected,
    }),
  );
}
function testFailure({ table, testName, actual, expected, e }: FailureResult) {
  table.push(
    ...buildTestResult("failure", {
      testName: testName,
      actual: actual,
      expected: expected,
      e: e,
    }),
  );
  // throw new AssertionError(`Test failure: ${testName}\n${e}`);
}
function buildTestResult(
  type: TestType,
  { testName, actual, expected, e }: Omit<Result, "table">,
): Table {
  const eq = type === "failure" ? "!==" : "===";
  const eqCell = cell(eq, 3);
  const ret = [row([cell(testTitle(type, testName), 5)], false)] as Table;
  if (type === "unimplemented") return ret;
  if (type === "failure" && e !== undefined) ret.push(row([cell(e, 5)], false));
  ret.push(
    row([cell(stringifyAny(actual)), eqCell, cell(stringifyAny(expected))]),
  );
  // console.log(actual.split(""));
  // console.log(actual);
  // console.log(p(actual));
  if (
    typeof actual === "string" && typeof expected === "string" &&
    ['"', actual.split(""), '"'] !== p(actual) &&
    ['"', expected.split(""), '"'] !== p(expected)
  ) {
    ret.push(row([cell(p(actual)), eqCell, cell(p(expected))]));
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
    defaultTestCase(result);
  }
  testSuccess(result as SuccessResult);
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
    defaultTestCase(result);
  }
  testSuccess(result as SuccessResult);
}
function defaultErrorTestCase(
  result: FailureResult,
) {
  if (result.e.includes("not implemented")) {
    testUnimplemented(result as UnimplementedResult);
  } else if (result.e.split(":")[0].includes("AssertionError")) {
    testFailure(result as FailureResult);
    resetTable({ table: result.table, maxColWidth: 300, minColWidth: 50 })
      .render();
    throw result.e;
  } else if (result.e.split(":")[0].includes("Error")) {
    result.actual = result.e.split(":")[0];
  } else testFailure(result as FailureResult);
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
