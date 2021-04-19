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
  ansi: new RegExp(
    [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
    ].join("|"),
    "g",
  ),
  argument: new RegExp(/\nArguments:(\[\n(\s|\S)*\n\])/),
  error: new RegExp(/^[A-Za-z]*Error: [a-zA-Z0-9]*/),
  bigint: new RegExp(
    `^\"{0,1}[0-9]{${Number.MAX_SAFE_INTEGER.toString().length - 1},}\"{0,1}`,
  ),
  string: new RegExp(/^"/),
  key: new RegExp(/:$/),
  undefined: new RegExp(/\"{0,1}undefined\"{0,1}/),
  null: new RegExp(/null/),
  boolean: new RegExp(/true|false/),
  symbol: new RegExp(/Symbol([a-zA-Z0-9]*)/),
};
export function consoleColor(json: any, c = console) {
  if (typeof json !== "string") json = stringifyAny(json);
  let styles = [];
  function color(_json = json) {
    return _json.replace(
      reg.global,
      function (match: any) {
        let style;
        if (reg.string.test(match)) {
          style = reg.key.test(match)
            ? EnumCSSColors.key
            : EnumCSSColors.string;
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
  }
  json = reg.ansi.test(json)
    ? json.replace(reg.argument, (match: any) => ansiColor(match))
    : color(json);
  styles.unshift(json);
  return c.log.apply(c, styles);
}

export function ansiColor(json: any) {
  if (typeof json !== "string") json = stringifyAny(json);
  function color(_json = json) {
    return json.replace(
      reg.global,
      (match: any) => {
        let style: string;
        if (reg.bigint.test(match)) {
          style = "bigint";
          match = match.replace(/\"/g, "");
        } else if (reg.error.test(match)) style = "error";
        else if (reg.symbol.test(match)) style = "symbol";
        else if (reg.string.test(match)) {
          if (reg.key.test(match)) style = "key";
          else {
            if (reg.ansi.test(JSON.parse(match))) {
              style = "none";
              match = JSON.parse(match).replace(
                reg.argument,
                (match: any) => ansiColor(match),
              );
            } else style = "string";
          }
        } else if (reg.null.test(match)) style = "null";
        else if (reg.undefined.test(match)) style = "undefined";
        else if (reg.boolean.test(match)) style = "boolean";
        else style = "number";
        // @ts-ignore
        return EnumANSIColors[style] + match + EnumANSIColorsSuffix[style];
      },
    );
  }
  return color(json);
}
