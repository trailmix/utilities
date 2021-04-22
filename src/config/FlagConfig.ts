import { default as Config } from "trailmix/config/Config.ts";
import { default as EnvConfig } from "trailmix/config/EnvConfig.ts";
import { default as FileConfig } from "trailmix/config/FileConfig.ts";
import { CommandOptions, ConfigOptions } from "trailmix/config/Config.d.ts";
import { mergeDeep } from "trailmix/common/mod.ts";
import type { LogConfigMap } from "trailmix/log/mod.ts";

/** Construct a FlagConfig
 * @example
 * // returns default FlagConfig
 * const cfg = new FlagConfig();
 * // returns named FlagConfig
 * const cfg = new FlagConfig({namespace: 'trilom', config: { consoleLevel: "DEBUG" }});
 * // update config
 * cfg.config = FlagConfig.parseFlags({consoleLevel: "ERROR" })
 * // update log
 * cfg.log = FlagConfig.parseLog();
 */
export default class FlagConfig extends Config {
  /**
   * turn a string CommandOptions into an CommandOptions
   * @param {CommandOptions} flags {consoleLevel: "DEBUG", consoleEnabled: "true" }
   * @example
   * const config: CommandOptions = FlagConfig.parseFlags({consoleLevel: "DEBUG"});
   * // returns object
   * { console: {level: "DEBUG"} }
   */
  static parseFlags(
    flags: CommandOptions = {},
  ): CommandOptions {
    let ret = {};
    for (const r in flags) {
      ret = mergeDeep(ret, FlagConfig.strParse(r, flags[r]));
    }
    return ret;
  }
  /**
   * turn a string{str}(test5TestwordTestphraseTestnameTest) into an object based on capital letters
   * while carrying a final string{value}(hello) with a string deliminator{delim}(_)
   * @param {string} str parse
   * @param {unknown} value value of key
   * @returns {CommandOptions} Usually string=> string, can be string=> Record<string,unknown|string>
   */
  static strParse(
    str: string,
    value: unknown,
  ): CommandOptions {
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
    const nextV = nextI === str.length
      ? (value === "true" ? true : value === "false" ? false : value)
      : FlagConfig.strParse(
        str.slice(nextI, nextI + 1).toLowerCase() +
          str.slice(nextI + 1),
        value,
      );
    const nextK = nextI === str.length ? str : str.slice(0, nextI);
    return { [nextK]: nextV };
  }
  constructor(
    opts?: ConfigOptions | EnvConfig | FileConfig | Config,
    flags?: CommandOptions,
  ) {
    super({ ...{ namespace: FlagConfig.namespace }, ...opts });
    this.config = mergeDeep(
      opts?.config ?? {},
      FlagConfig.parseFlags((opts as ConfigOptions)?.flags ?? flags ?? {}),
    );
    this.log = Config.parseLog(this.config.log as LogConfigMap);
  }
}
