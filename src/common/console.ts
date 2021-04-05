import {
  EnumANSIColors,
  EnumANSIColorsSuffix,
  EnumCSSColors,
  stringifyAny,
} from "trailmix/common/mod.ts";

const reg = {
  global: new RegExp(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b([A-Za-z]*Error: [a-zA-Z0-9]*|Symbol([a-zA-Z0-9]*)|true|false|null|undefined)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
  ),
  error: new RegExp(/^[A-Za-z]*Error: [a-zA-Z0-9]*/),
  bigint: new RegExp(
    `^[0-9]{${Number.MAX_SAFE_INTEGER.toString().length - 1},}`,
  ),
  string: new RegExp(/^"/),
  key: new RegExp(/:$/),
  undefined: new RegExp(/undefined/),
  null: new RegExp(/null/),
  boolean: new RegExp(/true|false/),
  symbol: new RegExp(/Symbol([a-zA-Z0-9]*)/),
};
export function consoleColor(json: any, c = console) {
  if (typeof json != "string") json = stringifyAny(json);
  let styles = [];
  json = json.replace(
    reg.global,
    function (match: any) {
      let style;
      if (reg.string.test(match)) {
        style = reg.key.test(match) ? EnumCSSColors.key : EnumCSSColors.string;
      } else if (reg.undefined.test(match)) style = EnumCSSColors.undefined;
      else if (reg.boolean.test(match)) style = EnumCSSColors.boolean;
      else if (reg.null.test(match)) style = EnumCSSColors.null;
      else if (reg.symbol.test(match)) style = EnumCSSColors.symbol;
      else if (reg.error.test(match)) style = EnumCSSColors.error;
      else if (reg.bigint.test(match)) style = EnumCSSColors.bigint;
      else style = EnumCSSColors.number;
      styles.push(style);
      styles.push("");
      return "%c" + match + "%c";
    },
  );
  styles.unshift(json);
  return c.log.apply(c, styles);
}

export function ansiColor(json: any, c = console) {
  if (typeof json != "string") json = stringifyAny(json);
  return json.replace(
    reg.global,
    function (match: any) {
      let style: string;
      if (reg.string.test(match)) {
        style = reg.key.test(match) ? "key" : "string";
      } else if (reg.undefined.test(match)) style = "undefined";
      else if (reg.boolean.test(match)) style = "boolean";
      else if (reg.null.test(match)) style = "null";
      else if (reg.symbol.test(match)) style = "symbol";
      else if (reg.error.test(match)) style = "error";
      else if (reg.bigint.test(match)) style = "bigint";
      else style = "number";
      // @ts-ignore
      return EnumANSIColors[style] + match + EnumANSIColorsSuffix[style];
    },
  );
}
