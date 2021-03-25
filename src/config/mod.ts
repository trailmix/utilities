export {
  cmdConfig,
  default as Config,
  defConfig,
  envConfig,
} from "trailmix/config/Config.ts";
// @deno-types="./Config.d.ts"
export type {
  CommandOptions,
  ConfigNames,
  ConfigOptions,
  Environment,
} from "trailmix/config/Config.d.ts";

export { default as NewConfig } from "trailmix/config/NewConfig.ts";
export { default as EnvConfig } from "trailmix/config/EnvConfig.ts";
export { default as StringConfig } from "trailmix/config/StringConfig.ts";
export { default as ObjectConfig } from "trailmix/config/ObjectConfig.ts";
