import { stringifyAny } from "trailmix/common/string.ts";
enum Colors {
  error = "color:red",
  key = "color:yellow",
  string = "color:seagreen",
  number = "color:gold",
  bigint = "color:darkorange",
  boolean = "color:deepskyblue",
  null = "color:magenta",
  undefined = "color:darkmagenta",
  symbol = "color:darkred",
}
enum ANSIColors {
  "error" = "\x1b[38;2;255;0;0m",
  "key" = "\x1b[38;2;255;255;0m",
  "string" = "\x1b[38;2;46;139;87m",
  "number" = "\x1b[38;2;255;215;0m",
  "bigint" = "\x1b[38;2;255;140;0m",
  "boolean" = "\x1b[38;2;0;191;255m",
  "null" = "\x1b[38;2;255;0;255m",
  "undefined" = "\x1b[38;2;139;0;139m",
  "symbol" = "\x1b[38;2;139;0;0m",
}
enum ANSIColorsSuffix {
  error = "\x1b[39m",
  key = "\x1b[39m",
  string = "\x1b[39m",
  number = "\x1b[39m",
  bigint = "\x1b[39m",
  boolean = "\x1b[39m",
  null = "\x1b[39m",
  undefined = "\x1b[39m",
  symbol = "\x1b[39m",
}
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
        style = reg.key.test(match) ? Colors.key : Colors.string;
      } else if (reg.undefined.test(match)) style = Colors.undefined;
      else if (reg.boolean.test(match)) style = Colors.boolean;
      else if (reg.null.test(match)) style = Colors.null;
      else if (reg.symbol.test(match)) style = Colors.symbol;
      else if (reg.error.test(match)) style = Colors.error;
      else if (reg.bigint.test(match)) style = Colors.bigint;
      else style = Colors.number;
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
      return ANSIColors[style] + match + ANSIColorsSuffix[style];
    },
  );
}
