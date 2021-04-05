import { Cell, Row, Table } from "trailmix/deps.ts";
import type { TableConfig } from "trailmix/common/mod.ts";
/**
 * pass in string and options, get cell
 * @param s string for cell
 * @param colSpan size of column
 * @returns cell
 */
export function cell(s: string, colSpan?: number) {
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
export function row(c: Cell[], border?: boolean) {
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
