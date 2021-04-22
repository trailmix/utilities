import type { ConsoleLogConfig } from "trailmix/log/mod.ts";
export type {
  ConsoleLogConfig,
  FileLogConfig,
  LogConfigMap,
} from "trailmix/log/mod.ts";
export type Environment = Record<string, string>;
export type CommandOptions = Record<
  string,
  ConsoleLogConfig | unknown
>;
export interface ConfigOptions {
  namespace?: string;
  config?: Record<string, unknown>;
  path?: string;
  env?: Record<string, string>;
  flags?: Record<string, unknown>;
}
export type ConfigNames =
  | "Config"
  | "FileConfig"
  | "EnvConfig"
  | "FlagConfig";
