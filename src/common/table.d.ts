import type { Table } from "trailmix/deps.ts";
export type { Table };
export type { Cell, Row } from "cliffy/table";
import type { ITableOptions } from "trailmix/deps.ts";

export interface Result {
  testName: string;
  table: Table;
  actual?: any | any[];
  expected?: any | any[];
  e?: string;
}
export type TableConfig = ITableOptions & Record<"table", Table>;

export type TestType = "unimplemented" | "success" | "failure";
export type FailureResult = Required<Result>;
export type UnimplementedResult = Required<Omit<Result, "actual" | "expected">>;
export type SuccessResult = Required<Omit<Result, "e">>;

export type TestExpectedFunction =
  | ((...any: Result | any[] | any) => any)
  | any[]
  | any;
export type TestActualFunction = ((...any: any[] | any) => any) | any[] | any;
