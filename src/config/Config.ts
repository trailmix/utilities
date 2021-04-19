import type {
  CommandOptions,
  ConfigOptions,
} from "trailmix/config/Config.d.ts";
import { mergeDeep } from "trailmix/common/mod.ts";
import type { LogConfigMap } from "trailmix/log/mod.ts";
/** Construct an Config
 * @example
 * // returns default Config
 * const cfg = new Config({ config: { log: { console: { level: "DEBUG" }}}});
 * // returns named Config
 * const cfg = new Config({namespace: 'trilom', config: { log: { console: { level: "ERROR" }}}});
 * // update config
 * cfg.config = Config.parse({ log: { console: { level: "ERROR" }}})
 * // update log
 * cfg.log = Config.parseLog();
 */
export default class Config {
  static namespace = "DEFAULT";
  static config: CommandOptions = {
    log: {
      console: {
        level: "ERROR",
        format: "string",
        color: true,
        date: false,
        enabled: true,
      },
      file: {
        level: "ERROR",
        format: "json",
        path: ".",
        date: false,
        enabled: false,
      },
    },
  };
  static log: Partial<LogConfigMap> = {};
  static parse(env: CommandOptions = Config.config): CommandOptions {
    return env;
  }
  static parseLog(
    log: LogConfigMap = Config.config.log as LogConfigMap,
  ): LogConfigMap {
    return mergeDeep(Config.config.log, log as LogConfigMap);
  }
  config: CommandOptions;
  log: LogConfigMap;
  namespace = Config.namespace;

  constructor(
    opts?: Partial<ConfigOptions>,
  ) {
    this.namespace = opts?.namespace ?? Config.namespace;
    this.config = Config.parse(opts?.config);
    this.log = Config.parseLog(this.config.log as LogConfigMap);
    if (this.constructor.name === "Config") {
      return this;
    }
  }
  // public parseLog(config: CommandOptions = this.config): LogConfigMap {
  //   console.log(config);
  //   console.log(this.config);
  //   delete this.config.log;
  //   console.log(this.config);
  //   this.log = config;
  //   return this.log;
  // }
  // public parse(env: CommandOptions = this.config): CommandOptions {
  //   this.config = env;
  //   return this.config;
  // }
  // private async getConfigurationPath(
  //   file = this.prefix,
  //   ext: FileExtension = "ts",
  //   srcDir = ".",
  // ): Promise<string> {
  //   try {
  //     return await validPath(file, ext, srcDir);
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // }
  // private async getConfiguration(
  //   path = this._path,
  // ): Promise<CommandOptions> {
  //   try {
  //     return await importDefault(path, {
  //       reload: true,
  //     }, this._importCache);
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // }
  // import { parse } from "https://raw.githubusercontent.com/hashicorp/terraform-cdk/main/packages/%40cdktf/hcl2json/lib/index.ts";
  // public async getConfiguration() {
  //   const cfg = await Deno.readTextFile(this._path);
  //   // TODO: for HCL support this will need to be converted to use deno std libs
  //   // https://github.com/hashicorp/terraform-cdk/tree/main/packages/%40cdktf/hcl2json/lib
  //   const hcl = await parse(
  //     "trailmix.config.hcl",
  //     await Deno.readTextFile("trailmix.config.hcl"),
  //   );
  //   console.log(cfg);
  // }
}
