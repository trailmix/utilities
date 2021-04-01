// subclass to ingest string config format
// export default {
//   logConsoleFormat: 'string'
// }

import { default as Config } from "trailmix/config/Config.ts";
import { ConfigOptions } from "trailmix/config/Config.d.ts";
import type {
  ConsoleLogConfig,
  FileLogConfig,
  LogConfigMap,
} from "trailmix/log/mod.ts";

export default class StringConfig extends Config {
  public static log: LogConfigMap = StringConfig.parseLog();
  public static env: Record<string, unknown> = StringConfig.parseEnv();
  public constructor(opts: ConfigOptions) {
    super(opts);
  }
  /**
   * turn a string{str}(test5TestwordTestphraseTestnameTest) into an object based on capital letters
   * while carrying a final string{value}(hello) with a string deliminator{delim}(_)
   * @param str string parse
   * @param value value of key
   * @returns {Record<string,unknown>} Usually string=> string, can be string=> Record<string,unknown|string>
   */
  public static strParse(
    str: string,
    value: string,
  ): Record<string, string | Record<string, unknown | string>> {
    // init is the starting value for finding strings later
    let nextI = 0;
    // for each letter in string find first capital letter
    for (const letter of str.split("")) {
      if (letter !== letter.toUpperCase()) {
        nextI += 1;
      } else break;
    }
    // if nextI is number or 0, add one to nextI
    if (nextI === 0 || Number(str[nextI])) nextI += 1;
    const nextV = nextI === str.length ? value : StringConfig.strParse(
      str.slice(nextI, nextI + 1).toLowerCase() +
        str.slice(nextI + 1),
      value,
    );
    const nextK = nextI === str.length ? str : str.slice(0, nextI);
    return Object.fromEntries([[
      nextK,
      nextV,
    ]]);
  }
  public static parseEnv(
    env: Record<string, string> = {},
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.keys(env).flatMap((key: string) => {
        return Object.entries(
          StringConfig.strParse(key, env[key]),
        );
      }),
    );
  }
  public static parseLog(env: Record<string, string> = {}): LogConfigMap {
    return {
      console: {
        ...Config.parseLog().console,
        ...StringConfig.parseEnv(env).console as ConsoleLogConfig,
      },
      file: {
        ...Config.parseLog().file,
        ...StringConfig.parseEnv(env).file as FileLogConfig,
      },
    } as LogConfigMap;
  }
}
