import type { LogFormat, LogLevel } from "trailmix/log/mod.ts";
import type {
  CommandOptions,
  Environment,
  // LogConfigMap,
  // ConsoleLogConfig,
  // FileLogConfig,
  // LogConfig,
} from "trailmix/config/Config.d.ts";
import type {
  ConsoleLogConfig,
  FileLogConfig,
  LogConfig,
  LogConfigMap,
} from "trailmix/log/Log.d.ts";
import { exists, extname, resolve } from "trailmix/deps.ts";
const importCache: Record<string, any> = {};
interface ImportOptions {
  reload?: boolean;
}
export const defConfig: LogConfigMap = {
  console: {
    level: "ERROR",
    format: "string",
    color: true,
  },
  file: {
    level: "ERROR",
    format: "string",
  },
};
export function envConfig(): LogConfigMap {
  return {
    console: {
      level: Deno.env.get("PAGIC_CONSOLE_LEVEL") as LogLevel,
      format: Deno.env.get("PAGIC_CONSOLE_FORMAT") as LogFormat,
      color: Deno.env.get("PAGIC_CONSOLE_COLOR") === undefined
        ? undefined
        : Boolean(Deno.env.get("PAGIC_CONSOLE_COLOR")),
    },
    file: {
      level: Deno.env.get("PAGIC_LOG_LEVEL") as LogLevel,
      format: Deno.env.get("PAGIC_LOG_FORMAT") as LogFormat,
      path: Deno.env.get("PAGIC_LOG_PATH"),
    },
  };
}
export function cmdConfig(cmd: CommandOptions): LogConfigMap {
  return {
    console: {
      level: cmd.consoleLevel as LogLevel,
      format: cmd.consoleFormat as LogFormat,
      color: cmd.consoleColor as boolean,
    },
    file: {
      level: cmd.logLevel as LogLevel,
      format: cmd.logFormat as LogFormat,
      path: cmd.logPath,
    },
  } as LogConfigMap;
}
export async function getPagicConfigPath(srcDir = ".") {
  let pagicConfigPath = resolve(`${srcDir}/trailmix.config.tsx`);
  if (!(await exists(pagicConfigPath))) {
    pagicConfigPath = resolve(`${srcDir}/trailmix.config.ts`);
    if (!(await exists(pagicConfigPath))) {
      throw new Error("trailmix.config.ts not exist");
    }
  }
  return pagicConfigPath;
}
/** Replacement of dynamic import default */
export async function importDefault<T = any>(
  importPath: string,
  options: ImportOptions = {},
): Promise<T> {
  const mod = await import_<{ default: T }>(importPath, options);
  return mod.default;
}
/** Replacement of dynamic import, enable cache by default, support reload options */
export async function import_<T = any>(
  importPath: string,
  options: ImportOptions = {},
): Promise<T> {
  let finalImportPath = importPath;
  if (finalImportPath.startsWith("/") || finalImportPath.substr(1, 1) === ":") {
    finalImportPath = `file://${finalImportPath}`;
  }
  if (!options.reload) {
    if (importCache[finalImportPath]) {
      return importCache[finalImportPath];
    }
  }
  let versionQuery = "";
  if (options.reload) {
    versionQuery = `?version=${Math.random().toString().slice(2)}${
      extname(importPath)
    }`;
  }

  let mod = await import(`${finalImportPath}${versionQuery}`);

  importCache[finalImportPath] = mod;
  return mod;
}
export default class Config {
  // @ts-ignore
  public static log: LogConfigMap = {
    // ...(Config.cmd.env.PAGIC_LOG_PATH !== undefined
    //   ? {
    //       file: {
    //         level: Config.cmd.env.PAGIC_LOG_LEVEL ?? 'ERROR',
    //         format: Config.cmd.env.PAGIC_LOG_FORMAT ?? 'json',
    //         path: Config.cmd.env.PAGIC_LOG_PATH,
    //       },
    //     }
    //   : {}),
    // ...{
    //   console: {
    //     level: Config.cmd.env.PAGIC_CONSOLE_LEVEL ?? 'ERROR',
    //     format: Config.cmd.env.PAGIC_CONSOLE_FORMAT ?? 'string',
    //     color: Config.cmd.env.PAGIC_CONSOLE_COLOR?.toString() === 'false' ? false : true,
    //   },
    // },
  };
  public get log(): LogConfigMap {
    return this._log;
  }
  private _log: LogConfigMap = Config.log;
  private pagicConfigPath = "";
  private projectConfig = "";

  public constructor(cmd: CommandOptions = {}) {
    if (cmd !== {}) {
      this._log = this.parseLog(cmd);
    }
  }
  /* Merges a default config, constructor config, and command line options into a single configuration object */
  public async merge(cmd: CommandOptions = {}) {
    this.pagicConfigPath = await getPagicConfigPath(envConfig().file?.path);
    this.projectConfig = await importDefault(this.pagicConfigPath, {
      reload: true,
    });
    console.log(this.projectConfig);
    this._log = this.parseLog(cmd);
    return this;
  }
  private parseLog(cmd: CommandOptions) {
    return {
      ...{
        ...(cmd.logPath !== undefined
          ? {
            file: {
              level: (cmd.logLevel as LogLevel) ?? Config.log.file?.level ??
                "ERROR",
              format: (cmd.logFormat as LogFormat) ?? Config.log.file?.format ??
                "json",
              path: (cmd.logPath as string) ?? Config.log.file?.path,
            },
          }
          : {}),
        ...{
          console: {
            level: (cmd.consoleLevel as LogLevel) ?? Config.log.console?.level,
            format: (cmd.consoleFormat as LogFormat) ??
              Config.log.console?.format,
            color: (cmd.consoleColor as boolean) ?? Config.log.console?.color,
          },
        },
      },
    };
  }
}
