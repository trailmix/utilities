export type Environment = Record<string, string>;
export type CommandOptions = Record<
  string,
  string | boolean | number | undefined
>;
export interface ConfigOptions {
  namespace?: string;
  prefix?: string;
}
export type ConfigNames =
  | "NewConfig"
  | "ObjectConfig"
  | "EnvConfig"
  | "StringConfig";
