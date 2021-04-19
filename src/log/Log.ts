// log imports
import { logColors, loggerNames, logStyles } from "trailmix/log/enum.ts";
import type {
  Handler,
  LogConfig,
  LogConfigMap,
  LogFormat,
  LogHandler,
  LogLevel,
} from "trailmix/log/Log.d.ts";
// internal
import { messageByStringSpread as sS } from "trailmix/color/mod.ts";
import {
  ansiColor,
  consoleColor,
  stringifyAny,
  stringifyBigInt,
} from "trailmix/common/mod.ts";
// external
import {
  format,
  getLogger,
  LogRecord,
  setupLogger,
  stdHandlers,
} from "trailmix/deps.ts";
import type {
  FileHandler,
  stdLogConfig,
  stdLogger,
  stdLoggerConfig,
} from "trailmix/deps.ts";

/** Construct a Logger
 * @example
 * // returns default logger
 * const l = new Log();
 * // returns named logger
 * const l = new Log('test');
 * // log success _message oneliner
 * new Log().success('All good friends');
 * // log success _message with object and named logger
 * const l = new Log('test')
 * l.success('An object...',{obj:'an object'})
 */
export default class Log {
  public static handler = "default";
  public static level: LogLevel = "ERROR";
  public level: LogLevel = Log.level;
  public handler = Log.handler;
  public logger: stdLogger = getLogger();
  public static pConfig: LogConfigMap = {
    console: {
      level: "ERROR",
      format: "string",
      color: true,
      date: false,
      enabled: true,
    },
  };
  public pConfig: LogConfigMap = Log.pConfig;
  public static _loggerNames: string[] = loggerNames;
  public _loggerNames: string[] = Log._loggerNames;
  public static _config: stdLogConfig = {
    handlers: {
      console: Log._getHandler("console", Log.pConfig.console),
    },

    loggers: {
      default: {
        level: Log.pConfig.console.level,
        handlers: Log._loggerNames,
      },
    },
  };
  public _config: stdLogConfig = Log._config;
  /** Construct the default logger.
   * @public
   * @constructor
   */
  public constructor(
    handler = "default",
    config?: LogConfigMap,
    loggerNames = Log._loggerNames,
    level = Log.level,
  ) {
    this._loggerNames = loggerNames;
    this.level = level;
    this.set(handler, config);
  }
  public set(handler = this.handler, config: LogConfigMap = this.pConfig) {
    if (config !== undefined) {
      this.pConfig = config;
    }
    this._config = { handlers: this._handlers, loggers: this._loggers };
    this.handler = handler;
    this.logger = getLogger(handler);
  }
  /** Initialize the loggers and handlers.
   * @public
   * @example
   * // returns Pagic logger
   * const l = await new Log().init('Pagic')
   */
  public async init(
    handler = this.handler,
    config: LogConfigMap = this.pConfig,
  ): Promise<Log> {
    this.set(handler, config);
    await setupLogger(this._config);
    return this;
  }
  private get _loggers(): Record<string, stdLoggerConfig> {
    const loggers = Object.fromEntries(
      this._loggerNames.map((logger) => {
        return [
          logger,
          {
            level: this.level,
            handlers: Object.keys(this.pConfig) as LogHandler[],
          },
        ];
      }),
    );
    return loggers;
  }
  private get _handlers(): Record<string, Handler> {
    return Object.entries(this.pConfig).reduce((prev: any, current: any, i) => {
      return {
        ...(i === 0 ? {} : prev),
        ...{
          [current[0]]: Log._getHandler(current[0], current[1]),
        },
      };
    }, {});
  }
  private static _getHandler(
    type: LogHandler = "console",
    config: LogConfig,
  ): Handler {
    if (type === "file") {
      return new stdHandlers.FileHandler(config.level, {
        mode: "w",
        filename: config.path +
          `/trailmix.${config.format === "json" ? "json" : "log"}`,
        formatter: (logRecord: LogRecord, handler: LogConfig = config) =>
          Log._formatter(logRecord, handler),
      });
    } else {
      return new stdHandlers.BaseHandler(config.level, {
        formatter: (logRecord: LogRecord, handler: LogConfig = config) =>
          Log._formatter(logRecord, handler),
      });
    }
  }
  /** DEBUG _message
   * @public
   * @example
   * const l = await new Log().init('Pagic')
   * l.debug('main','_message')
   */
  public debug(first: unknown, ...args: unknown[]): string | string[] {
    const ret = [
      Log._log(10, first, this._config, this.handler, this.pConfig, args),
      (this.handler === "test"
        ? Log._log(0, first, this._config, this.handler, this.pConfig, args)
        : ""),
    ].filter((v) => v !== "");
    return ret.length > 1 ? ret : ret[0];
  }
  public static debug(first: unknown, ...args: unknown[]): string {
    return this._log(10, first, this._config, this.handler, this.pConfig, args);
  }
  /** INFO _message
   * @public
   * @example
   * const l = await new Log().init('Pagic')
   * l.info('main','_message')
   */
  public info(first: unknown, ...args: unknown[]): string {
    return Log._log(20, first, this._config, this.handler, this.pConfig, args);
  }
  public static info(first: unknown, ...args: unknown[]): string {
    return this._log(20, first, this._config, this.handler, this.pConfig, args);
  }
  /** WARN _message
   * @public
   * @example
   * const l = await new Log().init('Pagic')
   * l.warn('main','_message')
   */
  public warn(first: unknown, ...args: unknown[]): string {
    return Log._log(30, first, this._config, this.handler, this.pConfig, args);
  }
  public static warn(first: unknown, ...args: unknown[]): string {
    return this._log(30, first, this._config, this.handler, this.pConfig, args);
  }
  /** ERROR _message
   * @public
   * @example
   * const l = await new Log().init('Pagic')
   * l.error('main','_message')
   */
  public error(first: unknown, ...args: unknown[]): string {
    return Log._log(40, first, this._config, this.handler, this.pConfig, args);
  }
  public static error(first: unknown, ...args: unknown[]): string {
    return this._log(40, first, this._config, this.handler, this.pConfig, args);
  }
  /** SUCCESS _message
   * @public
   * @example
   * const l = await new Log().init('Pagic')
   * l.success('main','_message')
   */
  public success(first: unknown, ...args: unknown[]): string {
    return Log._log(50, first, this._config, this.handler, this.pConfig, args);
  }
  public static success(
    first: unknown,
    ...args: unknown[]
  ): string {
    return this._log(50, first, this._config, this.handler, this.pConfig, args);
  }
  /** deDEBUG _message - only works in 'test'
   * @private
   * @example
   * const l = await new Log('test').init('Pagic')
   * l.debug('main','_message')
   */
  private static _log(
    level: number,
    msg: unknown,
    config = this._config,
    handler = this.handler,
    pConfig = this.pConfig,
    args: unknown[],
  ): string {
    const record = new LogRecord({
      level,
      msg: stringifyAny(msg),
      args: args,
      loggerName: handler,
    });
    let message = "";
    for (const h in config.handlers) {
      if (
        level >= config.handlers[h].level ||
        (handler === "test" && level === 0)
      ) {
        if (pConfig[h as LogHandler]?.enabled) {
          if (h === "file") {
            config.handlers[h].log(
              Log._formatter(record, pConfig[h as LogHandler] as LogConfig),
            );
            if (level >= 40) this.flush(config.handlers[h] as FileHandler);
          } else {
            message = config.handlers?.console.format(record);
            if (pConfig.console.color) {
              consoleColor(message, console);
            } else console.log(message);
          }
        }
      }
    }
    return message;
  }
  public static flush(
    handler: FileHandler | undefined = this._config.handlers
      ?.file as FileHandler,
  ) {
    handler.flush();
  }
  public flush(
    handler: FileHandler | undefined = this._config.handlers
      ?.file as FileHandler,
  ) {
    handler.flush();
  }
  public static async destroy(
    handler: FileHandler | undefined = this._config.handlers
      ?.file as FileHandler,
  ) {
    await handler.destroy();
  }
  public async destroy(
    handler: FileHandler | undefined = this._config.handlers
      ?.file as FileHandler,
  ) {
    await handler.destroy();
  }
  private static _formatter(logRecord: LogRecord, handler: LogConfig): string {
    let msg = this._message(logRecord, handler);
    let args = this._parseArgs(handler.format, logRecord.args);
    if (handler.format === "json") {
      return JSON.stringify(
        {
          ...{
            logger: logRecord.loggerName,
            level: handler.level,
            msg: msg,
            args: args,
          },
          ...(handler.date ? { date: logRecord.datetime } : {}),
        },
        null,
        2,
      );
    } else if (handler.format === "function") {
      return logRecord.level + " " + msg + (args !== undefined ? args : "");
    } else {
      return (handler.date
        ? format(logRecord.datetime, "dd-MM-yyyy") + " "
        : "") +
        msg +
        (args !== undefined ? args : "");
    }
  }
  private static _message(logRecord: LogRecord, handler: LogConfig): string {
    const level = logRecord.levelName as LogLevel;
    const color = handler.format === "string" && handler.color
      ? logColors[level]
      : undefined;
    const style = handler.format === "string" && handler.color
      ? logStyles[level]
      : undefined;
    const msg = `[${sS(logRecord.loggerName, color, style)}] ` +
      sS(
        (logRecord.level === 0 && logRecord.loggerName === "test"
          ? "deDEBUG:"
          : "") + logRecord.msg,
        color,
        style,
      );
    return msg;
  }
  private static _parseArgs(format: LogFormat, args: unknown[]) {
    let msg: string | undefined;
    if (args !== null && args.length > 0) {
      if (format === "function") {
        args.forEach((arg, index) => {
          msg += `, arg${index}: ${arg}`;
        });
      } else if (format === "string") {
        msg = " \nArguments:" +
          stringifyAny(args);
      } else if (format === "json") {
        msg = stringifyAny(args);
      }
    }
    return msg;
  }
}
