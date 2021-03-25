// import {} from '/config/mod.ts';
import {
  Table,
  Row,
  Cell,
  AssertionError,
  unimplemented,
  assertEquals,
  assertStrictEquals,
  assertThrows,
  assertNotEquals,
} from 'test/deps.ts';

export interface Result {
  testName: string;
  table: Table;
  actual?: any | any[];
  expected?: any | any[];
  e?: string;
}
export type TestType = 'unimplemented' | 'success' | 'failure';
export type FailureResult = Required<Result>;
export type UnimplementedResult = Required<Omit<Result, 'actual' | 'expected'>>;
export type SuccessResult = Required<Omit<Result, 'e'>>;

export type TestExpectedFunction = ((...any: Result | any[] | any) => any) | any[] | any;
export type TestActualFunction = ((...any: any[] | any) => any) | any[] | any;
export enum s_p {
  B = '\x1b[1m',
  U = '\x1b[4m',
  r = '\x1b[31m',
  br = '\x1b[91m',
  bg_r = '\x1b[41m',
  g = '\x1b[32m',
  bg = '\x1b[92m',
  bg_g = '\x1b[42m',
  y = '\x1b[33m',
  by = '\x1b[93m',
  bg_y = '\x1b[43m',
}
export enum s_s {
  B = '\x1b[22m',
  U = '\x1b[24m',
  r = '\x1b[39m',
  br = '\x1b[39m',
  bg_r = '\x1b[49m',
  g = '\x1b[39m',
  bg = '\x1b[39m',
  bg_g = '\x1b[49m',
  y = '\x1b[39m',
  by = '\x1b[39m',
  bg_y = '\x1b[49m',
}
enum t_e {
  br = '🚨🚨🚨🚨',
  by = '⚠️ ⚠️ ⚠️ ⚠️',
  bg = '🧪🧪🧪🧪',
}
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
export function resetTable(table?: []): Table {
  return new Table()
    .body(table ?? [])
    .maxColWidth(300)
    .border(true)
    .padding(1)
    .indent(2) as Table;
}
function testTitle(type: TestType, testName: string) {
  const e: 'br' | 'by' | 'bg' = type === 'success' ? 'bg' : type === 'failure' ? 'br' : 'by';
  return t_e[e] + '\t' + s_p.B + s_p.U + s_p[e] + testName.trim() + s_s[e] + s_s.U + s_s.B + ' ' + type;
}
function testUnimplemented({ table, testName }: UnimplementedResult) {
  table.push(...buildTestResult('unimplemented', { testName: testName }));
}
function testSuccess({ table, testName, actual, expected }: SuccessResult) {
  table.push(...buildTestResult('success', { testName: testName, actual: actual, expected: expected }));
}
function testFailure({ table, testName, actual, expected, e }: FailureResult) {
  table.push(...buildTestResult('failure', { testName: testName, actual: actual, expected: expected, e: e }));
  // throw new AssertionError(`Test failure: ${testName}\n${e}`);
}
function buildTestResult(type: TestType, { testName, actual, expected, e }: Omit<Result, 'table'>) {
  const eq = type === 'failure' ? '!==' : '===';
  const eqCell = cell(eq, 3);
  const ret = [row([cell(testTitle(type, testName), 5)], false)];
  if (type === 'unimplemented') return ret;
  if (type === 'failure' && e !== undefined) ret.push(row([cell(e, 5)], false));
  ret.push(row([cell(JSON.stringify(actual)), eqCell, cell(JSON.stringify(expected))]));
  if (typeof actual === 'string' && typeof expected === 'string') {
    ret.push(row([cell(p(actual)), eqCell, cell(p(expected))]));
  }
  return ret;
}
function p(s: string) {
  return JSON.parse(JSON.stringify(s));
}

// eslint-disable-next-line max-params
export function testFunction(
  testName: string,
  table: Table = resetTable(),
  actual: TestActualFunction,
  expected: TestExpectedFunction = defaultTestCase({} as Result),
  implemented = true,
) {
  let result: Result = {
    table: table,
    testName: testName,
  };
  try {
    if (!implemented) unimplemented(`Function type ${testName} not implemented`);
    if (typeof actual === 'function') result.actual = actual();
    else result.actual = actual;
    if (typeof expected === 'function') result.expected = expected(result.actual);
    else result.expected = expected;
    testSuccess(result as SuccessResult);
  } catch (e) {
    // console.log(e);
    if (typeof e === 'object') {
      result.e = String(e.stack);
      // console.log(result.e);
      if (result.e.includes('not implemented')) testUnimplemented(result as UnimplementedResult);
      else testFailure(result as FailureResult);
    }
    return;
  }
}

function defaultTestCase({ actual, expected, testName }: Result) {
  assertEquals(JSON.stringify(actual), JSON.stringify(expected), `${testName} failure: (actual !== expected)`);
  if (typeof actual === 'string')
    assertEquals(p(actual), p(expected), `${testName} JSON.parse() messages failure: (actual !== expected)`);
  return '' as any;
}
