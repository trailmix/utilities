import {
  EnumANSIColors,
  EnumANSIColorsSuffix,
  EnumCSSColors,
  stringifyAny,
} from "trailmix/common/mod.ts";

const reg = {
  global: new RegExp(
    /(["'])(?:(?=(\\?))\2.)*?\1:?|([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined|^[\d|\s|\w]*$|[\d]*,$/gm,
  ),
  ansi: new RegExp(/"?\[\\u001b\[[0-9]{1,3}m.*"?\n?/),
  argument: new RegExp(/\nArguments:(\[\n(\s|\S)*\n\])/),
  error: new RegExp(
    /([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?/,
  ),
  number: new RegExp(
    `^[0-9]{1,${Number.MAX_SAFE_INTEGER.toString().length - 1}}`,
  ),
  bigint: new RegExp(
    `^\"[0-9]{${Number.MAX_SAFE_INTEGER.toString().length - 1},}`,
  ),
  string: new RegExp(/^"/),
  key: new RegExp(/[a-zA-Z]*:$/),
  undefined: new RegExp(/^"?undefined"?$/),
  null: new RegExp(/^"?null"?$/),
  boolean: new RegExp(/true|false/),
  symbol: new RegExp(/("Symbol\()([a-zA-Z0-9]*)(\)")/),
};
function removeQuotes(str: string) {
  return str.replace(/^"{1}/, "").replace(/"{1}$/, "");
}
export function consoleColor(json: any, c = console) {
  if (typeof json !== "string") json = stringifyAny(json);
  const styles: string[] = [];
  function color(_json = json) {
    const ret = _json.replace(
      reg.global,
      function (match: any) {
        let style = "none";
        if (reg.bigint.test(match)) style = "bigint";
        else if (reg.error.test(match)) {
          styles.push(
            EnumCSSColors.error,
            "",
            EnumCSSColors.string,
            "",
            EnumCSSColors.number,
            "",
          );
          style = "error";
          match = match.replace(reg.error, "$1%c\n%c$2%c%c$3%c%c$4");
        } else if (reg.symbol.test(match)) {
          style = "symbol";
          styles.push(EnumCSSColors.symbol, "", EnumCSSColors.key, "");
          match = match.replace(reg.symbol, "$1%c%c$2%c%c$3");
        } else if (reg.undefined.test(match)) style = "undefined";
        else if (reg.null.test(match)) style = "null";
        else if (reg.number.test(match)) style = "number";
        else if (reg.boolean.test(match)) style = "boolean";
        else {
          if (reg.key.test(match)) style = "key";
          else {
            style = "string";
            match = String(
              '"' + match.replace(/(^("|'))|(('|")$)/g, "") + '"',
            );
          }
        }
        if (["undefined", "bigint", "symbol"].includes(style)) {
          match = removeQuotes(match);
        }
        styles.push(EnumCSSColors[style as keyof typeof EnumCSSColors], "");
        return "%c" + match + "%c";
      },
    );
    return ret;
  }
  json = reg.ansi.test(JSON.stringify(json))
    ? json.replace(reg.argument, (match: any) => ansiColor(match))
    : color(json);
  styles.unshift(json);
  return c.log.apply(c, styles);
}

export function ansiColor(json: any) {
  if (typeof json !== "string") json = stringifyAny(json);
  function color(_json = json) {
    return _json.replace(
      reg.global,
      (match: any) => {
        let style = "none";
        if (reg.bigint.test(match)) style = "bigint";
        else if (reg.error.test(match)) {
          style = "error";
          match = match.replace(
            reg.error,
            "$1" + EnumANSIColorsSuffix.error + "\n" + EnumANSIColors.string +
              "$2" + EnumANSIColorsSuffix.string + EnumANSIColors.number +
              "$3" + EnumANSIColorsSuffix.number + EnumANSIColors.error + "$4",
          );
        } else if (reg.symbol.test(match)) {
          style = "symbol";
          match = match.replace(
            reg.symbol,
            "$1" + EnumANSIColorsSuffix.symbol + EnumANSIColors.key + "$2" +
              EnumANSIColorsSuffix.key + EnumANSIColors.symbol + "$3",
          );
        } else if (reg.symbol.test(match)) style = "symbol";
        else if (reg.undefined.test(match)) style = "undefined";
        else if (reg.null.test(match)) style = "null";
        else if (reg.boolean.test(match)) style = "boolean";
        else if (reg.number.test(match)) style = "number";
        else {
          if (reg.key.test(match)) style = "key";
          else {
            if (reg.ansi.test(match)) {
              style = "none";
              match = JSON.parse(match).replace(
                reg.argument,
                (match: any) => ansiColor(match),
              );
            } else style = "string";
          }
        }
        if (
          ["undefined", "bigint", "symbol"].includes(style)
        ) {
          match = removeQuotes(match);
        }
        // @ts-ignore
        return EnumANSIColors[style] + match + EnumANSIColorsSuffix[style];
      },
    );
  }
  return color(json);
}
