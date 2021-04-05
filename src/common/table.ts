import {
  EnumANSIPrefix,
  EnumANSISuffix,
  TestEmojiEnum,
} from "trailmix/common/enum.ts";
import {
  assertEquals,
  Cell,
  Row,
  Table,
  unimplemented,
} from "trailmix/deps.ts";
import { stringifyAny } from "trailmix/common/string.ts";
import { ansiColor } from "trailmix/common/mod.ts";
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
/**
 * pass in string and options, get cell
 * @param s string for cell
 * @param colSpan size of column
 * @returns cell
 */
function cell(s: string, colSpan?: number) {
  let cell = Cell.from(String(s));
  cell = colSpan !== undefined ? cell.colSpan(colSpan) : cell;
  return cell;
}
/**
 * pass in cell and options, get row
 * @param c cell array
 * @param border apply boarder
 * @returns row
 */
function row(c: Cell[], border?: boolean) {
  let row = Row.from(c);
  row = border !== undefined ? row.border(border) : row;
  return row;
}
/**
 * pass in table and return a new table back if ready to render after rendering
 * @param table table to render
 * @param len length to render at
 * @returns table rendered, and reset or table
 */
export function renderTable(
  table: Table,
  force = true,
  len = 500,
  reset = true,
): Table {
  if (force) table.render();
  if (table.length >= len) {
    if (!force) table.render();
    return reset ? resetTable() : table;
  } else return table;
}
/**
 * pass in config, get a table (optionally from another table)
 * @param config Table configuration
 * @returns Table with config
 */
export function resetTable(
  config?: TableConfig,
): Table {
  const t: Table = (config !== undefined)
    ? Table.from((config.table as Table ?? []))
    : Table.from(([]));
  t.maxColWidth(config?.maxColWidth ?? 50);
  if (config?.minColWidth !== undefined) t.minColWidth(config?.minColWidth);
  return t.border(true).padding(1).indent(2);
}
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
/**
 * add a record to table for unimplemented test
* @param param0 result with unimplemented interface
 */
function testUnimplemented({ table, testName }: UnimplementedResult) {
  table.push(...buildTestResult("unimplemented", { testName: testName }));
}
/**
 * add a record to table for succesful test
 * @param param0 result with success interface
 */
function testSuccess({ table, testName, actual, expected }: SuccessResult) {
  table.push(
    ...buildTestResult("success", {
      testName: testName,
      actual: actual,
      expected: expected,
    }),
  );
}
/**
 * add a record to table for failed test
 * @param param0 result with failure interface
 */
function testFailure(result: Result) {
  result.table.push(
    ...buildTestResult("failure", result),
  );
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
    row([cell(ansiColor(actual)), eqCell, cell(ansiColor(expected))]),
  );
  if (
    typeof actual === "string" && typeof expected === "string" &&
    actual.toString() !== p(actual).toString() &&
    expected.toString() !== p(expected).toString()
  ) {
    ret.push(
      row([cell(p(ansiColor(actual))), eqCell, cell(p(ansiColor(expected)))]),
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
    ...buildTestResult("success", result as SuccessResult),
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
