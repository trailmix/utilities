import { LogLevels as EnumLogLevel } from "trailmix/deps.ts";
export { EnumLogLevel };
import type { LogColor, LogLevel, LogStyle } from "trailmix/log/Log.d.ts";

export const logLevels = Object.values(EnumLogLevel).filter((key) =>
  typeof key === "string"
) as LogLevel[];
export const loggerNames = ["default", "test"];

// export type Styles = 'bold' | 'italic' | 'dim' | 'underline' | 'strikethrough' | 'hidden' | 'inverse' | 'clear';
export const logColors: LogColor = {
  NOTSET: "white",
  DEBUG: "clear",
  INFO: "blue",
  WARNING: "yellow",
  ERROR: "red",
  CRITICAL: "green",
};
export const logStyles: LogStyle = {
  NOTSET: "clear",
  DEBUG: "clear",
  INFO: "clear",
  WARNING: "clear",
  ERROR: "clear",
  CRITICAL: "bold",
};

export enum EnumLogStyle {
  NOTSET = "clear",
  DEBUG = "clear",
  INFO = "clear",
  WARNING = "clear",
  ERROR = "clear",
  CRITICAL = "bold",
}
export enum EnumLogColor {
  NOTSET = "white",
  DEBUG = "clear",
  INFO = "blue",
  WARNING = "yellow",
  ERROR = "red",
  CRITICAL = "green",
}
