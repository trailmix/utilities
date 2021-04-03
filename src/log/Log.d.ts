import type { BaseHandler, FileHandler, LogLevels } from "trailmix/deps.ts";
import type {
  EnumBgColor,
  EnumColor,
  EnumEmphasis,
} from "trailmix/color/mod.ts";
import type {
  EnumLogColor,
  EnumLogLevel,
  EnumLogStyle,
} from "trailmix/log/enum.ts";
export type Handler = BaseHandler | FileHandler;
export type LogLevel = keyof typeof EnumLogLevel;
export type LogColor = {
  [key in LogLevel]?: keyof typeof EnumColor | keyof typeof EnumBgColor;
};
export type LogStyle = {
  [key in LogLevel]?: keyof typeof EnumEmphasis;
};

// export type Loggers = 'default' | 'test' | string;
export type LogFormat = "json" | "function" | "string";
export type LogHandler = "console" | "file";
// export type { LogConfigMap, LogConfig } from '/config/mod.ts';
export type { Style } from "trailmix/color/mod.ts";
export type {
  BaseHandler,
  FileHandler,
  stdLogConfig,
  stdLogger,
  stdLoggerConfig,
} from "trailmix/deps.ts";
export interface LogConfig {
  level: LogLevel;
  format: LogFormat;
  path?: string;
  color?: boolean;
  date?: boolean;
}

export type ConsoleLogConfig = Omit<LogConfig, "path">;
export type FileLogConfig = Omit<LogConfig, "color">;
export type LogConfigType = ConsoleLogConfig | FileLogConfig;
export interface LogConfigMap {
  console: ConsoleLogConfig;
  file?: FileLogConfig;
}
