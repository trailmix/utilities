import type {
  Handler,
  LogColor,
  LogConfig,
  LogConfigMap,
  LogFormat,
  LogHandler,
  LogLevel,
  LogStyle,
} from "trailmix/log/Log.d.ts";
import { logColors, loggerNames, logStyles } from "trailmix/log/enum.ts";
// import type { } from 'trailmix/config/mod.ts';
import { Config } from "trailmix/config/mod.ts";
import { Color as m, messageByStringSpread as sS } from "trailmix/color/mod.ts";
import type {
  stdLogConfig,
  stdLogger,
  stdLoggerConfig,
} from "trailmix/deps.ts";
import {
  getLogger,
  LogRecord,
  setupLogger,
  stdHandlers,
} from "trailmix/deps.ts";
// #region logging

// #endregion
export function stringifyBigInt(key: string, value: any): string {
  return typeof value === "bigint" ? String(value) : value;
}
export function parseMessage(value: unknown): string {
  // console.log(typeof value);
  if (typeof value === "string") return value;
  else if (
    value === null ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "boolean" ||
    typeof value === "undefined" ||
    typeof value === "symbol"
  ) {
    return String(value);
  } else if (value instanceof Error) {
    return value.stack!;
  } else if (typeof value === "object") {
    return JSON.stringify(value, stringifyBigInt);
  }
  return "undefined";
}
/** Construct a Pagic Logger.
 * @example
 * // returns default logger
 * const l = new Log()
 * // returns Pagic logger
 * const l = await new Log().init('Pagic')
 * // log success _message oneliner
 * (await new Log().init('Pagic')).success('main','_message')
 * // log success _message with object
 * const l = await new Log().init('Pagic')
 * l.success('main','_message')
 */
export default class Log {
  private static _loggerNames: string[] = loggerNames; // init static logger list
  public name = "default";
  public logger: stdLogger = getLogger(); // set logger to default logger
  // public config: PagicLogConfigMap = Log._config;
  // public set config(config: LogConfig) {
  //   this._config = config;
  // }
  // public get config(): LogConfig {
  //   return this._config;
  // }
  public pConfig: LogConfigMap = Config.log; // init static log config
  private _config: stdLogConfig;
  private _loggerNames: string[] = Log._loggerNames;
  // private handlers: { [x: string]: BaseHandler | FileHandler };
  /** Construct the default logger.
   * @public
   * @constructor
   */
  public constructor(
    name = "default",
    config?: LogConfigMap,
    loggerNames = Log._loggerNames,
  ) {
    if (config !== undefined) {
      this.pConfig = config;
    }
    this._config = { handlers: this._handlers, loggers: this._loggers };
    this._loggerNames = loggerNames;
    this.set(name);
  }
  public set(name = "default") {
    this.name = name;
    this.logger = getLogger(name);
  }
  /** Initialize the loggers and handlers.
   * @public
   * @example
   * // returns Pagic logger
   * const l = await new Log().init('Pagic')
   */
  public async init(name = this.name): Promise<Log> {
    await setupLogger(this._config);
    if (this.name !== name) this.set(name);
    return this;
  }
  /** DEBUG _message
   * @public
   * @example
   * const l = await new Log().init('Pagic')
   * l.debug('main','_message')
   */
  public debug(first: unknown, ...args: unknown[]): string | string[] {
    let ret = this._log(10, first, ...args);
    // console.log(ret);
    if (this.name === "test") {
      const dedebug = this._log(0, first, ...args);
      // console.log(dedebug);
      if (Array.isArray(ret)) {
        ret.concat(Array.isArray(dedebug) ? dedebug : [dedebug]);
      } else [ret].concat(Array.isArray(dedebug) ? dedebug : [dedebug]);
    }
    // console.log('ret ' + ret);
    return ret.length === 1 ? ret[0] : ret;
  }
  /** INFO _message
   * @public
   * @example
   * const l = await new Log().init('Pagic')
   * l.info('main','_message')
   */
  public info(first: unknown, ...args: unknown[]): string | string[] {
    return this._log(20, first, ...args);
  }
  /** WARN _message
   * @public
   * @example
   * const l = await new Log().init('Pagic')
   * l.warn('main','_message')
   */
  public warn(first: unknown, ...args: unknown[]): string | string[] {
    return this._log(30, first, ...args);
  }
  /** ERROR _message
   * @public
   * @example
   * const l = await new Log().init('Pagic')
   * l.error('main','_message')
   */
  public error(first: unknown, ...args: unknown[]): string | string[] {
    // console.log(...args);
    // console.log(args);
    return this._log(40, first, ...args);
  }
  /** SUCCESS _message
   * @public
   * @example
   * const l = await new Log().init('Pagic')
   * l.success('main','_message')
   */
  public success(first: unknown, ...args: unknown[]): string | string[] {
    return this._log(50, first, ...args);
  }
  /** deDEBUG _message - only works in 'test'
   * @private
   * @example
   * const l = await new Log('test').init('Pagic')
   * l.debug('main','_message')
   */
  private _log(
    level: number,
    msg: unknown,
    ...args: unknown[]
  ): string | string[] {
    let messages: string[] = [];
    let record = new LogRecord({
      level,
      msg: level === 0 && this.name === "test"
        ? "deDEBUG:" + parseMessage(msg)
        : parseMessage(msg),
      args: args,
      loggerName: this.name,
    });
    Object.entries(this._config.handlers ?? {}).forEach(
      (logger: [string, Handler]) => {
        if (level >= logger[1].level || (this.name === "test" && level === 0)) {
          const _msg = logger[1].format(record);
          // messages.push(_msg);
          if (logger[0] === "console") {
            messages.push(_msg);
            console.log(_msg);
          } else {
            logger[1].handle(record);
          }
        }
        //   logger[1].handle(record);
        //   // (logger[1] as FileHandler).flush();
        // }
      },
      {},
    );
    // console.log(messages);
    return messages.length === 1 ? messages[0] : messages;
  }
  private get _loggers(): { [name: string]: stdLoggerConfig } {
    const loggers = Object.fromEntries(
      this._loggerNames.map((logger) => {
        return [
          logger,
          this._getLogger(
            logger,
            Object.keys(this.pConfig) as LogHandler[],
            this.pConfig.console.level,
          ),
        ];
      }),
    );
    return loggers;
  }
  private get _handlers(): { [name: string]: Handler } {
    return Object.entries(this.pConfig).reduce((prev: any, current: any, i) => {
      return {
        ...(i === 0 ? {} : prev),
        ...{
          [current[0]]: this._getHandler(current[0], current[1]),
        },
      };
    }, {});
  }

  private _getLogger(
    name = this.name,
    handlers: LogHandler[] = ["console"],
    level: LogLevel = "ERROR",
  ): stdLoggerConfig {
    return {
      level: level,
      handlers: handlers,
    };
  }
  private _getHandler(
    type: LogHandler = "console",
    config: LogConfig,
  ): Handler {
    if (type === "file") {
      return new stdHandlers.FileHandler(config.level, {
        mode: "w",
        filename: config.path +
          `/Pagic.${config.format === "json" ? "json" : "log"}`,
        formatter: (logRecord: LogRecord, handler: LogConfig = config) =>
          this._formatter(logRecord, handler),
      });
    } else {
      return new stdHandlers.BaseHandler(config.level, {
        formatter: (logRecord: LogRecord, handler: LogConfig = config) => {
          let args = this._parseArgs(handler.format, logRecord.args);
          let msg = this._message(logRecord, handler);
          return msg + (args !== undefined ? args : "");
        },
      });
    }
  }
  private _formatter(logRecord: LogRecord, handler: LogConfig): string {
    let msg = this._message(logRecord, handler);
    let args = this._parseArgs(handler.format, logRecord.args);
    if (handler.format === "json") {
      return JSON.stringify(
        {
          logger: this.name,
          date: logRecord.datetime,
          level: handler.level,
          msg: msg,
          args: args,
        },
        null,
        2,
      );
    } else if (handler.format === "function") {
      return logRecord.level + " " + msg + (args !== undefined ? args : "");
    } else {
      return (handler.date ? logRecord.datetime + " " : "") + msg +
        (args !== undefined ? args : "");
    }
  }
  private _message(logRecord: LogRecord, handler: LogConfig): string {
    let msg = `[${this.name}] ${logRecord.msg}`;
    // let args: string | undefined = this._parseArgs(handler.format, logRecord.args);
    // console.log('logrecord.Args: ' + logRecord.args);
    // console.log('after' + args);
    // console.log(consoleMsg);
    if (
      handler.format !== "function" && handler.color &&
      logRecord.levelName !== "DEBUG"
    ) {
      const style = logStyles[logRecord.levelName as LogLevel];
      const color = logColors[logRecord.levelName as LogLevel];
      const colored = sS(logRecord.msg, style, color);
      const name = sS(this.name, style, color);
      // const colored = logFunctions[logColors[logRecord.levelName as LogLevel]](logRecord.msg);
      // const name = logFunctions[logColors[logRecord.levelName as LogLevel]](this.name);
      if (logRecord.levelName === "CRITICAL") {
        msg = `[${sS(name, "bold")}] ${sS(colored, "bold")}`;
      } else {
        msg = `[${name}] ${colored}`;
      }
    }
    return msg;
  }
  private _parseArgs(format: LogFormat, ...args: unknown[]) {
    let msg: string | undefined;
    if (args !== null && args.toString() !== "") {
      if (format === "function") {
        args.forEach((arg, index) => {
          msg += `, arg${index}: ${arg}`;
        });
      } else if (format === "string") {
        msg = " \nArguments:" +
          JSON.stringify(
            JSON.parse(JSON.stringify(args[0], stringifyBigInt))[0],
            null,
            2,
          );
      } else if (format === "json") {
        msg = JSON.parse(JSON.stringify(args[0], stringifyBigInt))[0];
      }
    }
    return msg;
  }
}

// class PagicMessage {}

// "Log.ts - Init test logger with json format"
// 'r' == 'e'
// 'r' == 'e'
// 'r' != 'e'
