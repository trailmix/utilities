import { exists, extname, resolve } from "trailmix/deps.ts";
import type { ConfigOptions } from "trailmix/config/Config.d.ts";
export default class NewConfig {
  // should suck in a namespace and optional config file
  public namespace: string;
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
  ) {
    let path = resolve(`${srcDir}/${prefix}.tsx`);
    if (!(await exists(path))) {
      path = resolve(`${srcDir}/${prefix}.ts`);
      if (!(await exists(path))) {
        // TODO: use custom exception class here
        throw new Error(`${prefix}.ts not exist`);
      }
    }
    this._definition_path = path;
    return this._definition_path;
  }
}
