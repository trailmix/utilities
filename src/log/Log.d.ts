// internal
import type {
  EnumBgColor,
  EnumColor,
  EnumEmphasis,
} from "trailmix/color/mod.ts";
import type { EnumLogLevel } from "trailmix/log/enum.ts";
// external
import type { BaseHandler, FileHandler } from "trailmix/deps.ts";
// external exports
export type { Style } from "trailmix/color/mod.ts";
export type {
  BaseHandler,
  FileHandler,
  stdLogConfig,
  stdLogger,
  stdLoggerConfig,
} from "trailmix/deps.ts";
// exports
export type LogFormat = "json" | "function" | "string";
export type LogHandler = "console" | "file";
export type Handler = BaseHandler | FileHandler;
export type LogLevel = keyof typeof EnumLogLevel;
export type LogColor = {
  [key in LogLevel]?: keyof typeof EnumColor | keyof typeof EnumBgColor;
};
export type LogStyle = {
  [key in LogLevel]?: keyof typeof EnumEmphasis;
};

// export type Loggers = 'default' | 'test' | string;

export interface LogConfig {
  level: LogLevel;
  format: LogFormat;
  path?: string;
  color?: boolean;
  date?: boolean;
  enabled: boolean;
}

export type ConsoleLogConfig = Omit<LogConfig, "path">;
export type FileLogConfig = Omit<LogConfig, "color">;
export type LogConfigType = ConsoleLogConfig | FileLogConfig;
export interface LogConfigMap {
  console: ConsoleLogConfig;
  file?: FileLogConfig;
}
