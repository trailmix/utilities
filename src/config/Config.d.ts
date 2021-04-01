export type Environment = Record<string, string>;
export type CommandOptions = Record<
  string,
  string | boolean | number | undefined
>;
export interface ConfigOptions {
  namespace?: string;
  prefix?: string;
  env?: Record<string, unknown>;
}
export type ConfigNames =
  | "Config"
  | "ObjectConfig"
  | "EnvConfig"
  | "StringConfig";
