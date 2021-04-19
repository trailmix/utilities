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
  namespace = Config.namespace;
  config: CommandOptions;
  log: LogConfigMap;

  constructor(
    opts?: Partial<ConfigOptions>,
  ) {
    this.namespace = opts?.namespace ?? Config.namespace;
    this.config = Config.parse(opts?.config);
    this.log = Config.parseLog(this.config.log as LogConfigMap);
  }
}
