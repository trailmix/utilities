export {
  EnumLogColor,
  EnumLogLevel,
  EnumLogStyle,
  loggerNames,
  logLevels,
} from "trailmix/log/enum.ts";
export { default as Log } from "trailmix/log/Log.ts";
// @deno-types="./Log.d.ts"
export type {
  ConsoleLogConfig,
  FileLogConfig,
  LogConfig,
  LogConfigMap,
  LogFormat,
  LogHandler,
  LogLevel,
} from "trailmix/log/Log.d.ts";
