import {
  cmdConfig,
  Config,
  defConfig,
  envConfig,
} from "trailmix/config/mod.ts";
import { resetTable, testFunction } from "test/common/mod.ts";
import type { LogConfigMap } from "trailmix/log/Log.d.ts";
import { assertEquals } from "test/deps.ts";

let table = resetTable();

Deno.test({
  name: `Config.ts`,
  fn: async () => {
    let log: LogConfigMap = new Config({
      consoleLevel: "WARNING",
    }).log;
    assertEquals(
      log,
      { console: { level: "WARNING", format: undefined, color: undefined } },
      "Config constructor doesn't init default configuration.",
    );
    assertEquals(
      defConfig,
      {
        console: {
          level: "ERROR",
          format: "string",
          color: true,
        },
        file: {
          level: "ERROR",
          format: "string",
        },
      },
      "defConfig doesn't init default configuration.",
    );
    assertEquals(
      envConfig(),
      {
        console: {
          level: undefined,
          format: undefined,
          color: undefined,
        },
        file: {
          level: undefined,
          format: undefined,
          path: undefined,
        },
      },
      "envConfig doesn't init default configuration.",
    );
    Deno.env.set("PAGIC_CONSOLE_LEVEL", "ERROR");
    Deno.env.set("PAGIC_CONSOLE_FORMAT", "string");
    Deno.env.set("PAGIC_CONSOLE_COLOR", "true");
    Deno.env.set("PAGIC_LOG_LEVEL", "ERROR");
    Deno.env.set("PAGIC_LOG_FORMAT", "json");
    Deno.env.set("PAGIC_LOG_PATH", ".");
    assertEquals(envConfig(), {
      console: {
        level: "ERROR",
        format: "string",
        color: true,
      },
      file: {
        level: "ERROR",
        format: "json",
        path: ".",
      },
    });
    assertEquals(
      cmdConfig({
        consoleLevel: "ERROR",
      }),
      {
        console: {
          format: undefined,
          level: "ERROR",
          color: undefined,
        },
        file: {
          format: undefined,
          level: undefined,
          path: undefined,
        },
      },
      "envConfig doesn't read ENV Variables.",
    );
    const config: Config = new Config();
    console.log(await config.merge());
    // load config
    /// default
    // {
    //   console: {
    //     level: 'ERROR',
    //     format: 'string',
    //     color: true,
    //   },
    //   file: {
    //     level: 'ERROR',
    //     format: 'string',
    //   },
    // };

    /// env
    // LOG_CONSOLE_LEVEL
    // LOG_CONSOLE_FORMAT
    // LOG_CONSOLE_COLOR
    // LOG_FILE_LEVEL
    // LOG_FILE_FORMAT
    // LOG_FILE_PATH
    // change config
    // write config

    /// cmd
    // {
    //   console: {
    //     level: cmd.consoleLevel as LogLevel,
    //     format: cmd.consoleFormat as LogFormat,
    //     color: cmd.consoleColor as boolean,
    //   },
    //   file: {
    //     level: cmd.logLevel as LogLevel,
    //     format: cmd.logFormat as LogFormat,
    //     path: cmd.logPath,
    //   },
    // } as LogConfigMap;
  },
});
