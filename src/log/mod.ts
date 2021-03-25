// @deno-types="./Logger.d.ts"
export type { LogLevel, LogFormat, LogHandler, LogConfigMap, LogConfig } from 'trailmix/log/Log.d.ts';
export { loggerNames, logLevels, EnumLogStyle, EnumLogColors, EnumLogLevel } from 'trailmix/log/enum.ts';
export { default as Log, stringifyBigInt } from 'trailmix/log/Log.ts';
