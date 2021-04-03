export function stringifyBigInt(key: string, value: any): string {
  return typeof value === "bigint" ? String(value) : value;
}
export function stringifyAny(value: unknown): string {
  // console.log(typeof value);
  if (typeof value === "string") return value;
  else if (
    value === null ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "boolean" ||
    typeof value === "undefined" ||
    typeof value === "symbol"
  ) {
    return String(value);
  } else if (value instanceof Error) {
    return value.stack!;
  } else if (typeof value === "object") {
    return JSON.stringify(value, stringifyBigInt);
  }
  return "undefined";
}
