import {
  EnumANSIColors,
  EnumANSIColorsSuffix,
  EnumCSSColors,
  stringifyAny,
} from "trailmix/common/mod.ts";

const reg = {
  global: new RegExp(
    // /(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"]|[a-zA-Z0-9]*\r)*"(\s*:)?|\b((\s|\S)*Error: [a-zA-Z0-9]*|Symbol([a-zA-Z0-9]*)|true|false|null|undefined)\b|\b-?(\w+(?:\.\w*)?)\b/g,
    // /(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"]|[a-zA-Z0-9]*\r)*"(\s*:)?\b((\s|\S)*Error: [a-zA-Z0-9]*|"Symbol([a-zA-Z0-9]*)|true|false|null|"undefined)\b|\b-?(\w+(?:\.\w*)?)\b/g,
    // /(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"]|[a-zA-Z0-9]*\r)*(\s*:)?\b((\s|\S)*Error: [a-zA-Z0-9]*|"Symbol([a-zA-Z0-9]*)|true|false|null|"undefined)\b|\b-?(\w+(?:\.\N*)?)\b/g,
    // /(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"]|[a-zA-Z0-9]*\r)*(\s*:)?((\s|\S)*Error: [a-zA-Z0-9]*|Symbol([a-zA-Z0-9]*)|true|false|null|undefined)|(?:(.+\/[^\/]+$))|-?(\w+(?:\.\N*)?)/g,
    // /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"]|[a-zA-Z0-9]*\r)*"(\s*:)?)|\b((\s|\S)*Error: [a-zA-Z0-9]*|Symbol([a-zA-Z0-9]*)|true|false|null|undefined)|(?:(.+\/[^\/]+$))|-?(\w+(?:\.\N*)?)\b/g,
    // /\b(?:(\s|\S*Error: [a-zA-Z0-9]*\n)|"(Symbol\([a-zA-Z0-9]*\))"|true|false|null|"undefined)|(?:(.+\/[^\/]+$))|-?(\w+(?:\.\N*)?)\b|"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"]|[a-zA-Z0-9]*)"\s*:?/g,
    // /\b(?:(\s|\S*Error: [a-zA-Z0-9]*\n)|(Symbol)\(([a-zA-Z0-9]*)\)|true|false|null|"undefined)|(?:(.+\/[^\/]+$))|-?(\w+(?:\.\N*)?)\b|"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])"\S*:?/g,
    // substiution
    // /(?:(\s|\S*Error: [a-zA-Z0-9]*\n)|(Symbol)\(([a-zA-Z0-9]*)\)|true|false|null|"undefined)|(?:(.+\/[^\/]+$))|-?("[\w]*"?)|"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"]|[a-zA-Z0-9]*\r)"\S*:?/g,
    // /(?:(\s|\S*Error: [a-zA-Z0-9]*\n)|(Symbol)\(([a-zA-Z0-9]*)\)|true|false|null|"undefined)|(?:(.+\/[^\/]+$))|-?("[\w]*"\n?)|(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"]|[a-zA-Z0-9]+)\S*\n{0,1}:?/g,
    // /(?:(\s|\S*Error: [a-zA-Z0-9]*\n)|"(Symbol)\(([a-zA-Z0-9]*)\)"|true|false|null|"undefined")|(?:(.+\/[^\/]+$))|-?"{0,1}(\w+\w*)"{0,1}\n{0,1}|(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])\w*\n{0,1}:?/g,
    // /(?:(\s|\S*Error: [a-zA-Z0-9]*\n)|"Symbol\(|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined)\n?|(?:(.+\/[^\/]+$))|-?"?(\w+\w*)"?\n?|(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])\n?:?/g,
    // /(?:(\S*Error: [a-zA-Z0-9]*\n)|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined)\n?|(?:(.+\/[^\/]+$))|-?"?(\w+\w*)"?\n?|(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])\n?:?/g,
    // /(?:(\S*Error: [a-zA-Z0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined)\n?|(?:.+(file:\/\/[^\n]+)\n)|-?"?(\w+\w*)"?\n?|(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])\n?:?/g,
    // /(?:(\S*Error: [a-zA-Z0-9]*)\n(\s*.+file:\/\/[^\n]+)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined)\n?|-?"?(\w+\w*)"?\n?|(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])\n?:?/g,
    // /(?:(\S*Error: [a-zA-Z0-9]*)\n(\s*.+file:\/\/[^\n]+)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined)\n?|-?"?(\w+\w*)"?\n?\n?:?/g,
    // /(?:(\S*Error: [a-zA-Z0-9]*)\n(\s*.+file:\/\/[^\n]+)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined)|-?"?(\w+\w*)"?:?/g,
    // /(\S*Error: [a-zA-Z0-9]*)\n(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined|-?"?(\w+\w*)"?:?/g,
    // /(\[\\u001(?:B|b).*\r?)|(\S*Error: [a-zA-Z0-9]*)\n(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined|-?"?(\w+\w*)"?:?/g,
    // /(\[\\u001(?:B|b).*\r?)|([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined|(?:-?"?(\w+\w*"?:?))/g,
    // /(\[\\u001(?:B|b).*\r?)|([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined|(-?"?(\w+(\w|\s|\\|\/|:|\.)*)"?:?)/g,
    // /("\[\\u001b\[(?:\w+(\w|\s|\\|\/|:|\.|\[|\])*)")|([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined|(-?"?(\w+(\w|\s|\\|\/|:|\.)*)"?:?)/g,
    // /(\[\\u001b\[(?:(\w|\s|\\|\/|:|\.|\[|\]|,|{|"|})*))|([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined|(-?"?(\w+(\w|\s|\\|\/|:|\.)*)"?:?)/g,
    // /("?\[\\u001b\[.*\n?)|([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined|(-?"?(?:\w+(\w|\s|\\|\/|:|\.)*)"?:?\n)/g,
    // /((\[(?:[^"\\]|\\.)*:*\[*\]*\s*\\*\v*\d*\w*)\]?\n?)|([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined|(-?"?(?:\w+(\w|\s|\\|\/|:|\.)*)"?:?\n)/g,
    // /(["'])(?:(?=(\\?))\2.)*?\1:?|([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined/g,
    // /(["'])(?:(?=(\\?))\2.)*?\1:?|([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined|(\d|\w)*\n$/g,
    /(["'])(?:(?=(\\?))\2.)*?\1:?|([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?|("Symbol\()([a-zA-Z0-9]*)(\)")|\(([a-zA-Z0-9]*)\)"|true|false|null|undefined|^[\d|\s|\w]*$|[\d]*,$/gm,
  ),
  ansi: new RegExp(/"?\[\\u001b\[[0-9]{1,3}m.*"?\n?/),
  argument: new RegExp(/\nArguments:(\[\n(\s|\S)*\n\])/),
  // error: new RegExp(/^"{0,1}[A-Za-z]*Error: [a-zA-Z0-9]*/),
  error: new RegExp(
    /([a-zA-Z]*Error: [a-zA-Z0-9]*)(?:\n|\\n)(\s+at file:\/{3}[\w*\/\.?]*)(:[0-9]*)(:[0-9]*)\n?/,
  ),
  errorReplace: new RegExp(
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
  // undefined: new RegExp(/^"{0,1}undefined"{0,1}$/),
  undefined: new RegExp(/^"?undefined"?$/),
  null: new RegExp(/^"?null"?$/),
  // null: new RegExp(/^"{0,1}null"{0,1}$/),
  boolean: new RegExp(/true|false/),
  // symbol: new RegExp(/("Symbol\()([a-zA-Z0-9]*)(\)")/),
  symbol: new RegExp(/Symbol([a-zA-Z0-9]*)/),
  symbolReplace: new RegExp(/("Symbol\()([a-zA-Z0-9]*)(\)")/),
};
function removeQuotes(str: string) {
  console.log(
    "removing quotes from: ",
    str,
    " to ",
    str.replace(/^"{1}/, "").replace(/"{1}$/, ""),
  );
  return str.replace(/^"{1}/, "").replace(/"{1}$/, "");
}
export function consoleColor(json: any, c = console) {
  console.log("inside consoleColor beforeParse 🎸");
  if (typeof json !== "string") json = stringifyAny(json);
  console.log("inside consoleColor afterParse 🎸");
  const styles: string[] = [];
  function color(_json = json) {
    console.log("inside consoleColor:color 🌈");
    const ret = _json.replace(
      reg.global,
      function (match: any) {
        console.log("inside consoleColor:color.replace 🌈");
        console.log("color:global match 🌎", match);
        console.log("color:key match 🔑", reg.key.test(match));
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
          match = match.replace(reg.errorReplace, "$1%c\n%c$2%c%c$3%c%c$4");
        } else if (reg.symbol.test(match)) {
          style = "symbol";
          styles.push(EnumCSSColors.symbol, "", EnumCSSColors.key, "");
          match = match.replace(reg.symbolReplace, "$1%c%c$2%c%c$3");
        } else if (reg.undefined.test(match)) style = "undefined";
        else if (reg.null.test(match)) style = "null";
        else if (reg.number.test(match)) style = "number";
        else if (reg.boolean.test(match)) style = "boolean";
        else {
          if (reg.key.test(match)) {
            console.log("string: key", match);
            style = "key";
          } else {
            console.log("🐜 match 🐜", reg.ansi.test(match));
            if (
              reg.string.test(match) &&
              reg.ansi.test(match)
            ) {
              console.log("string: ansi", match);
              style = "none";
              match = JSON.parse(match).replace(
                reg.argument,
                (match: any) => color(match),
              );
            } else {
              console.log("string: string", match);
              style = "string";
              match = String(
                '"' + match.replace(/(^("|'))|(('|")$)/g, "") + '"',
              );
            }
          }
        }
        if (["undefined", "bigint", "symbol"].includes(style)) {
          match = removeQuotes(match);
        }
        // console.log(style);
        console.log("my style is✂️", style);
        styles.push(EnumCSSColors[style as keyof typeof EnumCSSColors], "");
        // console.log(
        //   "%c" +
        //     (["key", "string"].includes(style) ? match : removeQuotes(match)) +
        //     "%c",
        // );
        // return ["key", "string"].includes(style) ? match : removeQuotes(match);
        // () +
        // "%c";
        return "%c" + match + "%c";
        // return ["key", "string"].includes(style)
        //   ? "%c" + match + "%c"
        //   : "%c" + removeQuotes(match) + "%c";
      },
    );
    return ret;
    // if (reg.symbol.test(ret)) return removeQuotes(ret);
    // else
  }
  console.log("parsing", json);
  console.log("is ansi:", reg.ansi.test(JSON.stringify(json)));
  json = reg.ansi.test(JSON.stringify(json))
    ? json.replace(reg.argument, (match: any) => ansiColor(match))
    : color(json);
  console.log("after parse", JSON.stringify(json));
  console.log("after parse json", json);
  console.log(styles);
  styles.unshift(json);
  return c.log.apply(c, styles);
}

export function ansiColor(json: any) {
  console.log("inside ansiColor beforeParse 🎸");
  if (typeof json !== "string") json = stringifyAny(json);
  console.log("inside ansiColor afterParse 🎸");
  function color(_json = json) {
    console.log("inside ansiColor:color 🌈");
    return _json.replace(
      reg.global,
      (match: any) => {
        console.log("inside ansiColor:color.replace 🌈");
        console.log("🚨🚨ERROR match", reg.error.test(match));
        console.log(match);
        let style = "none";
        if (reg.bigint.test(match)) {
          style = "bigint";
          // match = match.replace(/\"/g, "");
        } else if (reg.error.test(match)) {
          console.log("🚨🚨ERROR");
          style = "error";
          const pN = EnumANSIColors.number;
          const sN = EnumANSIColorsSuffix.number;
          const pS = EnumANSIColors.string;
          const sS = EnumANSIColorsSuffix.string;
          const pE = EnumANSIColors.error;
          const sE = EnumANSIColorsSuffix.error;
          match = match.replace(
            reg.errorReplace,
            "$1" + sE + "\n" + pS + "$2" + sS + pN + "$3" + sN + pE + "$4",
          );
        } else if (reg.symbol.test(match)) {
          style = "symbol";
          const sS = EnumANSIColorsSuffix.symbol;
          const pS = EnumANSIColors.symbol;
          const sK = EnumANSIColorsSuffix.key;
          const pK = EnumANSIColors.key;
          match = match.replace(
            reg.symbolReplace,
            "$1" + sS + pK + "$2" + sK + pS + "$3",
          );
        } else if (reg.symbol.test(match)) style = "symbol";
        else if (reg.undefined.test(match)) {
          style = "undefined";
          // match = match.replace(/\"/g, "");
        } else if (reg.null.test(match)) style = "null";
        else if (reg.boolean.test(match)) style = "boolean";
        else if (reg.number.test(match)) style = "number";
        else {
          if (reg.key.test(match)) style = "key";
          else {
            // console.log("string or ansi 🧵/ᇗ");
            // console.log(match);
            // console.log(stringifyAny(match));
            console.log("🧵 match 🧵", reg.string.test(match));
            console.log("🐜 match 🐜", reg.ansi.test(match));
            if (
              reg.ansi.test(match)
            ) {
              // console.log("stringify", stringifyAny(match));
              // if (!reg.string.test(match)) match = stringifyAny(match);
              console.log("ansi ᇗ");
              // console.log("string: ansi", match);
              style = "none";
              match = JSON.parse(match).replace(
                reg.argument,
                (match: any) => ansiColor(match),
              );
            } else {
              console.log(_json);
              console.log("🎸  ", match);
              style = "string";
            }
          }
        }
        if (
          ["undefined", "bigint", "symbol"].includes(style)
        ) {
          match = removeQuotes(match);
        }
        console.log("my style is✂️", style);
        // console.log(
        //   JSON.stringify(
        //     // @ts-ignore
        //     EnumANSIColors[style] + match + EnumANSIColorsSuffix[style],
        //   ),
        // );
        // @ts-ignore
        return EnumANSIColors[style] + match + EnumANSIColorsSuffix[style];
      },
    );
  }
  // json = reg.error.test(JSON.stringify(json))
  //   ? json.replace(reg.error, (match: any) => JSON.stringify(match))
  //   : json;
  return color(json);
}
