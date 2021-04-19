import { default as Config } from "trailmix/config/Config.ts";
import { default as FlagConfig } from "trailmix/config/FlagConfig.ts";
import { default as EnvConfig } from "trailmix/config/EnvConfig.ts";
import { CommandOptions, ConfigOptions } from "trailmix/config/Config.d.ts";
import { mergeDeep } from "trailmix/common/mod.ts";
import { importDefault, validPath } from "trailmix/common/mod.ts";
import { resolve } from "trailmix/deps.ts";
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
  static path = resolve(Deno.cwd(), "trailmix.config.ts");
  static config: CommandOptions = {
    log: mergeDeep(Config.config.log, { file: { enabled: true } }),
  };
  path = FileConfig.path;
  #importCache: Record<string, string> = {};

  constructor(opts?: ConfigOptions | Config | FlagConfig | EnvConfig) {
    super({ ...{ namespace: FileConfig.namespace }, ...opts });
    this.config = opts?.config ?? {};
    this.path = (opts as ConfigOptions)?.path ??
      resolve(
        Deno.cwd(),
        `${
          this.namespace === "DEFAULT"
            ? "trailmix"
            : this.namespace.toLowerCase()
        }.config.ts`,
      );
  }
  // set valid path in private var
  async parseFile(
    path = this.path,
  ): Promise<FileConfig> {
    const valid = validPath(path);
    try {
      if (valid !== false) {
        this.path = valid;
        this.config = mergeDeep(
          this.config,
          Config.parse(
            await this.getConfiguration(this.path),
          ),
        );
        this.log = Config.parseLog(this.config.log as LogConfigMap);
      } else throw new Error(`path:${path} is not valid`);
    } catch (e) {
      throw e;
    }
    return this as FileConfig;
  }
  private async getConfiguration(
    path: string = this.path,
    cache = this.#importCache,
  ): Promise<CommandOptions> {
    return await importDefault(path, {
      reload: true,
    }, cache);
  }
}
