import { default as Config } from "trailmix/config/Config.ts";
import { default as FlagConfig } from "trailmix/config/FlagConfig.ts";
import { default as EnvConfig } from "trailmix/config/EnvConfig.ts";
import { CommandOptions, ConfigOptions } from "trailmix/config/Config.d.ts";
import { mergeDeep } from "trailmix/common/mod.ts";
import { importDefault, validPath } from "trailmix/common/mod.ts";
import type { LogConfigMap } from "trailmix/log/mod.ts";

/** Construct a FileConfig
 * @example
 * // write a file
 * Deno.writeFile(
 *   Deno.cwd()+"/test.ts",
 *   new TextEncoder().encode('export default {log: {console: {level: "DEBUG"}}};'),
 * );
 * // returns default FileConfig
 * const cfg = new FileConfig();
 * // parse file
 * await cfg.parseFile();
 * // update config and log
 * Deno.writeFile(
 *   Deno.cwd()+"/test.ts",
 *   new TextEncoder().encode('export default {log: {console: {level: "ERROR"}}};'),
 * );
 * console.log(await cfg.parseEnv())
 */
export default class FileConfig extends Config {
  static path = Deno.cwd() + "/trailmix.config.ts";
  static config: CommandOptions = {
    log: mergeDeep(Config.config.log, { file: { enabled: true } }),
  };
  // public static log: Partial<LogConfigMap> = {};
  private static async getConfiguration(
    path: string = this.path,
  ): Promise<CommandOptions> {
    return await importDefault(path, {
      reload: true,
    }, this._importCache);
  }
  //#region parseFile options
  path = FileConfig.path;
  private static _importCache: Record<string, string> = {};
  //#endregion

  public constructor(opts?: ConfigOptions | Config | FlagConfig | EnvConfig) {
    super({ ...{ namespace: FileConfig.namespace }, ...opts });
    this.config = opts?.config ?? {};
    this.path = (opts as ConfigOptions)?.path ??
      Deno.cwd() +
        `/${
          this.namespace === "DEFAULT"
            ? "trailmix"
            : this.namespace.toLowerCase()
        }.config.ts`;
    // return this;
  }
  // set valid path in private var
  public async parseFile(
    path = this.path,
  ): Promise<FileConfig> {
    const valid = validPath(path);
    try {
      if (valid !== false) {
        this.path = valid;
        console.log("before", this.config);
        this.config = mergeDeep(
          this.config,
          Config.parse(
            await FileConfig.getConfiguration(this.path),
          ),
        );
        console.log("after", this.config);
        this.log = Config.parseLog(this.config.log as LogConfigMap);
        console.log("after", this.log);
      } else throw new Error(`path:${path} is not valid`);
    } catch (e) {
      throw e;
    }
    // console.log("logging", await FileConfig.getConfiguration(this.path));
    // this.config = Config.parse(await FileConfig.getConfiguration(this.path));

    return this as FileConfig;
  }
}
