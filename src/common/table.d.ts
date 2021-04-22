import type { ITableOptions, Table } from "trailmix/deps.ts";
export { Table };
export type TableConfig = Partial<
  ITableOptions & Record<"table", Table>
>;
