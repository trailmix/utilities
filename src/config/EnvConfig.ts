import { default as Config } from "trailmix/config/Config.ts";
import type { default as StringConfig } from "trailmix/config/StringConfig.ts";
import { ConfigOptions } from "trailmix/config/Config.d.ts";
import type {
  ConsoleLogConfig,
  FileLogConfig,
  LogConfigMap,
} from "trailmix/log/mod.ts";

export default class EnvConfig extends Config {
  public static log: LogConfigMap = EnvConfig.parseLog();
  public static env: Record<string, unknown> = EnvConfig.parseEnv();
  public constructor(opts?: ConfigOptions | Config | StringConfig) {
    let _opts = opts ?? { namespace: Config.namespace, prefix: Config.prefix };
    super(_opts);
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
   * @param namespace namespace of env
   * @returns 
   */
  public static parseEnv(
    namespace = this.namespace,
    env: Record<string, string> = Deno.env.toObject(),
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.keys(env).filter((key: string) => {
        return (new RegExp(`^(${namespace.toUpperCase()}){1}`)).test(key);
      }).flatMap((key: string) => {
        return Object.entries(
          EnvConfig.strParse(
            key,
            Deno.env.toObject()[key],
            namespace.toUpperCase(),
          ),
        );
      }).sort(),
    );
  }
  public static parseLog(namespace = this.namespace): LogConfigMap {
    return {
      console: {
        ...Config.parseLog().console,
        ...EnvConfig.parseEnv(namespace).console as ConsoleLogConfig,
      },
      file: {
        ...Config.parseLog().file,
        ...EnvConfig.parseEnv(namespace).file as FileLogConfig,
      },
    } as LogConfigMap;
  }
  public parseEnv(
    namespace = this.namespace,
    env: Record<string, string> = Deno.env.toObject(),
  ): Record<string, unknown> {
    this.env = EnvConfig.parseEnv(namespace, env);
    return this.env;
  }
  public parseLog(namespace = this.namespace): LogConfigMap {
    this.log = EnvConfig.parseLog(namespace);
    return this.log;
  }
}
