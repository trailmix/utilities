export { default as Config } from "trailmix/config/Config.ts";
export { default as EnvConfig } from "trailmix/config/EnvConfig.ts";
export { default as FlagConfig } from "trailmix/config/FlagConfig.ts";
export { default as FileConfig } from "trailmix/config/FileConfig.ts";

// @deno-types="./Config.d.ts"
export type {
  CommandOptions,
  ConfigNames,
  ConfigOptions,
  ConsoleLogConfig,
  Environment,
  FileLogConfig,
  LogConfigMap,
} from "trailmix/config/Config.d.ts";
