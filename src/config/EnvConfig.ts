// subclass to ingest env config format
// export default {
//   TRAILMIX_LOG_CONSOLE_FORMAT: 'string'
// }

import { default as NewConfig } from "trailmix/config/NewConfig.ts";
import { ConfigOptions } from "trailmix/config/Config.d.ts";
import type {
  ConsoleLogConfig,
  FileLogConfig,
  LogConfigMap,
} from "trailmix/log/mod.ts";

export default class EnvConfig extends NewConfig {
  public static log: LogConfigMap = EnvConfig.parseLog();
  public static env: Record<string, unknown> = EnvConfig.parseEnv();
  public constructor(opts: ConfigOptions) {
    super(opts);
  }
  /**
   * turn a string{str}(TEST_ABC_A_B_C) into an object excluding a string{ex}(TEST)
   * while carrying a final string{value}(hello) with a string deliminator{delim}(_)
   * @param str string parse
   * @param value value of key
   * @param ex string to exclude
   * @param delim delimiter string
   * @returns {Record<string,unknown>} Usually string=> string, can be string=> Record<string,unknown|string>
   */
  public static strParse(
    str: string,
    value: string,
    ex: string,
    delim = "_",
    lower = true,
  ): Record<string, string | Record<string, unknown | string>> {
    const strReplace = str.replace(ex + delim, "");
    const nextI = strReplace.indexOf(delim, 0);
    const nextV = nextI === -1 ? value : EnvConfig.strParse(
      strReplace,
      value,
      strReplace.slice(0, nextI),
      delim,
      lower,
    );
    const nextK = nextI === -1 ? strReplace : strReplace.slice(0, nextI);
    return Object.fromEntries([[
      lower ? nextK.toLowerCase() : nextK,
      nextV,
    ]]);
  }
  /**
   * pass in env, return vars within object namespace
   * @param env environment env object
   * @returns 
   */
  public static parseEnv(
    env: Record<string, string> = Deno.env.toObject(),
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.keys(env).filter((key: string) =>
        (new RegExp(`^(${this.namespace}){1}`)).test(key)
      ).flatMap((key: string) => {
        return Object.entries(
          EnvConfig.strParse(key, Deno.env.toObject()[key], this.namespace),
        );
      }),
    );
  }
  public static parseLog(): LogConfigMap {
    return {
      console: {
        ...NewConfig.parseLog().console,
        ...EnvConfig.parseEnv().console as ConsoleLogConfig,
      },
      file: {
        ...NewConfig.parseLog().file,
        ...EnvConfig.parseEnv().file as FileLogConfig,
      },
    } as LogConfigMap;
  }
}
