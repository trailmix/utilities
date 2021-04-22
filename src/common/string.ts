export function stringifyBigInt(key: string, value: any): string {
  if (typeof value === "bigint") {
    return String(value);
  } else if (value instanceof Error) {
    return value.stack!;
  } else if (
    ["string", "number", "boolean", "object"].includes(typeof value) ||
    String(value) === "null"
  ) {
    return value;
  } else {
    return String(value);
  }
}

export function stringifyAny(value: unknown): string {
  if (typeof value === "string") {
    return value;
  } else {
    return JSON.stringify(value, stringifyBigInt, 2);
  }
}
