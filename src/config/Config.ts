import { importDefault, validPath } from "trailmix/common/mod.ts";
import type { FileExtension } from "trailmix/common/mod.ts";

import type { ConfigOptions } from "trailmix/config/Config.d.ts";
import type { LogConfigMap } from "trailmix/log/mod.ts";
export default class Config {
  // should suck in a namespace and optional config file
  public static env: Record<string, unknown> = {};
  public static log: LogConfigMap = Config.parseLog();
  public env: Record<string, unknown> = Config.env;
  public log: LogConfigMap = Config.log;
  // public get log(): LogConfigMap {
  //   return this._log;
  // }
  // public _log: LogConfigMap = Config.log;
  // public get test(): LogConfigMap {
  //   return Config.log;
  // }
  public static namespace = "DEFAULT";
  public static prefix = "trailmix.config";
  public namespace = Config.namespace;
  public path = "";
  public prefix = Config.namespace;
  private _importCache: Record<string, unknown> = {};
  public constructor(
    {
      namespace = Config.namespace,
      prefix = Config.prefix,
      env = Config.env,
    }: ConfigOptions,
  ) {
    this.namespace = namespace;
    this.prefix = prefix;
    this.env = env;
    this.log = this.parseLog();
    // read srcDir from env vars here?
    // this.getConfigurationPath(prefix)
    // suck up file to understand env config
    // spit out understanding of config
    // ingest remaining config (env vars, cmd, file config)
  }
  public async init() {
    await this.getConfigurationPath();
    await this.getConfiguration();
    return this;
  }
  public async getConfigurationPath(
    file = this.prefix,
    ext: FileExtension = "ts",
    srcDir = ".",
  ) {
    try {
      this.path = await validPath(file, ext, srcDir) ?? "";
      return this.path;
    } catch (e) {
      throw new Error(e);
    }
  }
  public async getConfiguration(path = this.path) {
    try {
      this.env = await importDefault(path, {
        reload: true,
      }, this._importCache);
      return this.env;
    } catch (e) {
      throw new Error(e);
    }
  }
  // import { parse } from "https://raw.githubusercontent.com/hashicorp/terraform-cdk/main/packages/%40cdktf/hcl2json/lib/index.ts";
  // public async getConfiguration() {
  //   const cfg = await Deno.readTextFile(this.path);
  //   // TODO: for HCL support this will need to be converted to use deno std libs
  //   // https://github.com/hashicorp/terraform-cdk/tree/main/packages/%40cdktf/hcl2json/lib
  //   const hcl = await parse(
  //     "trailmix.config.hcl",
  //     await Deno.readTextFile("trailmix.config.hcl"),
  //   );
  //   console.log(cfg);
  // }
  public static parseLog(): LogConfigMap {
    return {
      console: {
        level: "ERROR",
        format: "string",
        color: true,
        date: false,
      },
      file: {
        level: "ERROR",
        format: "string",
        path: ".",
        date: false,
      },
    } as LogConfigMap;
  }
  public parseLog(): LogConfigMap {
    this.log = Config.parseLog();
    return this.log;
  }
}
