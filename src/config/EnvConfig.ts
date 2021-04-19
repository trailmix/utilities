import { default as Config } from "trailmix/config/Config.ts";
import { default as FlagConfig } from "trailmix/config/FlagConfig.ts";
import { default as FileConfig } from "trailmix/config/FileConfig.ts";
import { CommandOptions, ConfigOptions } from "trailmix/config/Config.d.ts";
import { mergeDeep } from "trailmix/common/mod.ts";
import type { LogConfigMap } from "trailmix/log/mod.ts";

/** Construct an EnvConfig
 * @example
 * // set env vars for default or named
 * Deno.env.set("DEFAULT_CONSOLE_LEVEL", "DEBUG");
 * Deno.env.set("TRILOM_CONSOLE_LEVEL", "DEBUG");
 * // returns default EnvConfig
 * const cfg = new EnvConfig();
 * // returns named EnvConfig
 * const cfg = new EnvConfig({namespace: 'trilom'});
 * // update config
 * Deno.env.set("DEFAULT_FILE_LEVEL", "ERROR");
 * cfg.config = cfg.parseEnv()
 * // update log
 * cfg.log = EnvConfig.parseLog();
 */
export default class EnvConfig extends Config {
  /**
   * pass in ENV config, return vars within object namespace as CommandOptions
   * @param env environment config object
   * @returns 
   */
  static parseEnv(
    env: CommandOptions = Deno.env.toObject(),
    namespace: string = this.namespace,
  ): CommandOptions {
    const envKeys = Object.keys(env).filter((key: string) => {
      return (new RegExp(`^(${namespace.toUpperCase()}){1}`)).test(key);
    }).sort();
    let ret = {};
    for (const r of envKeys) {
      ret = mergeDeep(
        ret,
        EnvConfig.strParse(r, env[r] as string, namespace.toUpperCase()),
      );
    }
    return ret;
  }
  parseEnv(
    env = Deno.env.toObject(),
    namespace: string = this.namespace,
  ): CommandOptions {
    return EnvConfig.parseEnv(env, namespace);
  }
  /**
   * merge a CommandOptions into a LogConfigMap
   * @param {CommandOptions} config {console: {level: "DEBUG", enabled: true} }
   * @example
   * const log: LogConfigMap = EnvConfig.parseLog({console: {level: "DEBUG"} });
   * // returns full log object
   * { 
   *  console: {
   *   level: "DEBUG",
   *   format: "string",
   *   color: true,
   *   date: false,
   *   enabled: true,
   * },
   *  file: {
   *   level: "ERROR",
   *   format: "json",
   *   path: ".",
   *   date: false,
   *   enabled: false,
   * }}
   */
  // static parseLog(
  //   log: LogConfigMap = this.parseEnv(Deno.env.toObject()).log as LogConfigMap,
  // ): LogConfigMap {
  //   return mergeDeep(
  //     Config.config.log,
  //     {
  //       console: log.console ?? {},
  //       file: log.file ?? {},
  //     } as LogConfigMap,
  //   );
  // }
  /**
   * turn a string{str}(TEST_ABC_A_B_C) into an object excluding a string{ex}(TEST)
   * while carrying a final string{value}(hello) with a string deliminator{delim}(_)
   * @param str string parse
   * @param value value of key
   * @param ex string to exclude
   * @param delim delimiter string
   * @param lower force lowercase on key
   * @returns {Record<string,unknown>} Usually string=> string, can be string=> Record<string,unknown|string>
   */
  static strParse(
    str: string,
    value: string,
    ex: string,
    delim = "_",
    lower = true,
  ): CommandOptions {
    const strReplace = str.replace(ex + delim, "");
    const nextI = strReplace.indexOf(delim, 0);
    const nextV = nextI === -1
      ? (value === "true"
        ? true
        : value === "false"
        ? false
        : (/^\[{1}\s|\S*\]{1}$/.test(value) ? JSON.parse(value) : value))
      : EnvConfig.strParse(
        strReplace,
        value,
        strReplace.slice(0, nextI),
        delim,
        lower,
      );
    const nextK = nextI === -1 ? strReplace : strReplace.slice(0, nextI);
    return { [lower ? nextK.toLowerCase() : nextK]: nextV };
  }
  public constructor(opts?: ConfigOptions | Config | FlagConfig | FileConfig) {
    super({ ...{ namespace: EnvConfig.namespace }, ...opts });
    this.config = mergeDeep(
      opts?.config ?? {},
      this.parseEnv(Deno.env.toObject()),
    );
    this.log = Config.parseLog(this.config.log as LogConfigMap);
  }
}
