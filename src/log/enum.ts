// internal
import type { LogColor, LogLevel, LogStyle } from "trailmix/log/Log.d.ts";
//external
import { LogLevels as EnumLogLevel } from "trailmix/deps.ts";

// exports
export { EnumLogLevel };
export const logLevels = Object.values(EnumLogLevel).filter((key) =>
  typeof key === "string"
) as LogLevel[];
export const loggerNames = ["default", "test"];

export const logColors: LogColor = {
  NOTSET: "white",
  DEBUG: "clear",
  INFO: "blue",
  WARNING: "yellow",
  ERROR: "red",
  CRITICAL: "green",
};
export const logStyles: LogStyle = {
  NOTSET: "none",
  DEBUG: "none",
  INFO: "none",
  WARNING: "none",
  ERROR: "none",
  CRITICAL: "bold",
};

export enum EnumLogStyle {
  NOTSET = "none",
  DEBUG = "none",
  INFO = "none",
  WARNING = "none",
  ERROR = "none",
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
