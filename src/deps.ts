// watcher deps
export { v4 } from "uuid/mod.ts";
export { extname, relative, resolve } from "path/mod.ts";
export { exists, existsSync } from "fs/mod.ts";

// color deps
export * as colors from "fmt/colors.ts";

// logger deps
export {
  getLogger,
  handlers as stdHandlers,
  Logger as stdLogger,
  LoggerConfig as stdLoggerConfig,
  setup as setupLogger,
} from "log/mod.ts";
export type { BaseHandler, FileHandler } from "log/handlers.ts";
export type { LogConfig as stdLogConfig } from "log/mod.ts";
export { getLevelByName, LogLevels } from "log/levels.ts";
export { LogRecord } from "log/logger.ts";
