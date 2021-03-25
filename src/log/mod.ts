// @deno-types="./Log.d.ts"
export type {
  LogConfig,
  LogConfigMap,
  LogFormat,
  LogHandler,
  LogLevel,
} from "trailmix/log/Log.d.ts";
export {
  EnumLogColors,
  EnumLogLevel,
  EnumLogStyle,
  loggerNames,
  logLevels,
} from "trailmix/log/enum.ts";
export { default as Log, stringifyBigInt } from "trailmix/log/Log.ts";
