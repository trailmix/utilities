// watcher deps
export { v4 } from 'uuid/mod.ts';
export * as path from 'path/mod.ts';
export * as fs from 'fs/mod.ts';

// color deps
export * as colors from 'fmt/colors.ts';

// logger deps
export {
  LoggerConfig as stdLoggerConfig,
  Logger as stdLogger,
  setup as setupLogger,
  getLogger,
  handlers as stdHandlers,
} from 'log/mod.ts';
export type { BaseHandler, FileHandler } from 'log/handlers.ts';
export type { LogConfig as stdLogConfig } from 'log/mod.ts';
export { getLevelByName, LogLevels } from 'log/levels.ts';
export { LogRecord } from 'log/logger.ts';
