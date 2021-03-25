import type { LogLevels, BaseHandler, FileHandler } from 'trailmix/deps.ts';
import type { EnumColor, EnumBgColor, EnumEmphasis } from 'trailmix/color/mod.ts';
export type Handler = BaseHandler | FileHandler;
export type LogColor = Record<LogLevel, keyof typeof EnumColor | keyof typeof EnumBgColor>;
export type LogStyle = Record<LogLevel, keyof typeof EnumEmphasis>;
export type LogLevel = keyof typeof LogLevels;
// export type Loggers = 'default' | 'test' | string;
export type LogFormat = 'json' | 'function' | 'string';
export type LogHandler = 'console' | 'file';
// export type { LogConfigMap, LogConfig } from '/config/mod.ts';
export type { Style } from 'trailmix/color/mod.ts';
export type { stdLogger, BaseHandler, FileHandler, stdLogConfig, stdLoggerConfig } from 'trailmix/deps.ts';
export interface LogConfig {
  level: LogLevel;
  format: LogFormat;
  path?: string;
  color?: boolean;
  date?: boolean;
}

export type ConsoleLogConfig = Omit<LogConfig, 'path'>;
export type FileLogConfig = Omit<LogConfig, 'color'>;
export type LogConfigType = ConsoleLogConfig | FileLogConfig;
export interface LogConfigMap {
  console: ConsoleLogConfig;
  file?: FileLogConfig;
}
