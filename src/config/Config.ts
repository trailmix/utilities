import type { LogLevel, LogFormat } from 'trailmix/log/mod.ts';
import type {
  Environment,
  CommandOptions,
  // LogConfigMap,
  // ConsoleLogConfig,
  // FileLogConfig,
  // LogConfig,
} from 'trailmix/config/Config.d.ts';
import type { LogConfigMap, ConsoleLogConfig, FileLogConfig, LogConfig } from 'trailmix/log/Log.d.ts';
export default class Config {
  // @ts-ignore
  public static log: LogConfigMap = {
    // ...(Config.cmd.env.PAGIC_LOG_PATH !== undefined
    //   ? {
    //       file: {
    //         level: Config.cmd.env.PAGIC_LOG_LEVEL ?? 'ERROR',
    //         format: Config.cmd.env.PAGIC_LOG_FORMAT ?? 'json',
    //         path: Config.cmd.env.PAGIC_LOG_PATH,
    //       },
    //     }
    //   : {}),
    // ...{
    //   console: {
    //     level: Config.cmd.env.PAGIC_CONSOLE_LEVEL ?? 'ERROR',
    //     format: Config.cmd.env.PAGIC_CONSOLE_FORMAT ?? 'string',
    //     color: Config.cmd.env.PAGIC_CONSOLE_COLOR?.toString() === 'false' ? false : true,
    //   },
    // },
  };
  public get log(): LogConfigMap {
    return this._log;
  }
  private _log: LogConfigMap = Config.log;

  public constructor(cmd: CommandOptions = {}) {
    if (cmd !== {}) {
      this._log = this.parseLog(cmd);
    }
  }

  /* Merges a default config, constructor config, and command line options into a single configuration object */
  public async merge(cmd: CommandOptions = {}) {
    this._log = this.parseLog(cmd);
    return this;
  }
  private parseLog(cmd: CommandOptions) {
    return {
      ...{
        ...(cmd.logPath !== undefined
          ? {
              file: {
                level: (cmd.logLevel as LogLevel) ?? Config.log.file?.level ?? 'ERROR',
                format: (cmd.logFormat as LogFormat) ?? Config.log.file?.format ?? 'json',
                path: (cmd.logPath as string) ?? Config.log.file?.path,
              },
            }
          : {}),
        ...{
          console: {
            level: (cmd.consoleLevel as LogLevel) ?? Config.log.console?.level,
            format: (cmd.consoleFormat as LogFormat) ?? Config.log.console?.format,
            color: (cmd.consoleColor as boolean) ?? Config.log.console?.color,
          },
        },
      },
    };
  }
}
