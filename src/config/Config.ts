import { exists, extname, resolve } from "trailmix/deps.ts";

import type { ConfigOptions } from "trailmix/config/Config.d.ts";
import type { LogConfigMap } from "trailmix/log/mod.ts";
export default class Config {
  // should suck in a namespace and optional config file
  public static log: LogConfigMap = Config.parseLog();
  // public get log(): LogConfigMap {
  //   return this._log;
  // }
  // public _log: LogConfigMap = Config.log;
  // public get test(): LogConfigMap {
  //   return Config.log;
  // }
  public static namespace = "DEFAULT";
  public namespace = Config.namespace;
  private _definition_prefix: string;
  private _definition_path = "";
  public constructor(
    { namespace = "DEFAULT", prefix = "trailmix.config" }: ConfigOptions,
  ) {
    this.namespace = namespace;
    this._definition_prefix = prefix;
    // read srcDir from env vars here?
    // this.getConfigurationPath(prefix)
    // suck up file to understand env config
    // spit out understanding of config
    // ingest remaining config (env vars, cmd, file config)
  }
  /**
   * 
   * @param srcDir relative dir location of cfg source
   * @returns path of cfg location, verified with resolve & exists
   */
  public async getConfigurationPath(
    prefix = this._definition_prefix,
    srcDir = ".",
    ext = "ts",
  ) {
    let path = resolve(`${srcDir}/${prefix}.${ext}`);
    if (!(await exists(path))) {
      path = resolve(`${srcDir}/${prefix}.tsx`);
      if (!(await exists(path))) {
        // TODO: use custom exception class here
        throw new Error(`${prefix}.ts/tsx not exist`);
      }
    }
    this._definition_path = path;
    return this;
  }
  // import { parse } from "https://raw.githubusercontent.com/hashicorp/terraform-cdk/main/packages/%40cdktf/hcl2json/lib/index.ts";
  // public async getConfiguration() {
  //   const cfg = await Deno.readTextFile(this._definition_path);
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
        date: true,
      },
      file: {
        level: "ERROR",
        format: "string",
        path: ".",
        date: false,
      },
    };
  }
}
