export function stringifyBigInt(key: string, value: any): string {
  return typeof value === "bigint" ? String(value) : value;
}
export function stringifyAny(value: unknown): string {
  if (typeof value === "string") return String(value);
  else {
    if (value instanceof Error) {
      return value.stack!;
    } else if (typeof value === "object") {
      return JSON.stringify(value, stringifyBigInt, 2);
    } else { //null, number, bigint, boolean, undefined, symbol
      return String(value);
    }
  }
}
