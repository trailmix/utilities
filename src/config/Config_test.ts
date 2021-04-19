import {
  Config,
  ConfigNames,
  ConfigOptions,
  EnvConfig,
  FileConfig,
  FlagConfig,
} from "trailmix/config/mod.ts";
import {
  renderTable,
  resetTable,
  testFunction,
  testFunctionAsync,
} from "trailmix/common/mod.ts";
import type { CommandOptions, LogConfigMap } from "trailmix/config/mod.ts";

let table = resetTable();
const defaultConfig = Object.assign({}, new Config().config);

const ConfigTests: Record<
  string,
  & Record<"i", ConfigOptions | CommandOptions | string>
  & Record<
    "o",
    ConfigOptions | string | LogConfigMap | CommandOptions | undefined
  >
> = {
  object: {
    i: "default",
    o: {
      namespace: "DEFAULT",
      config: defaultConfig,
      log: defaultConfig.log,
    } as ConfigOptions,
  },
  log: {
    i: {
      console: { format: "json" },
    },
    o: {
      "console": {
        "level": "ERROR",
        "format": "json",
        "color": true,
        "date": false,
        "enabled": true,
      },
      "file": {
        "level": "ERROR",
        "format": "json",
        "path": ".",
        "date": false,
        "enabled": false,
      },
    },
  },
  config: {
    i: "default",
    o: defaultConfig,
  },
  nsObject: {
    i: {
      namespace: "TRILOM",
      config: { test: { test1: "hello" } },
    },
    o: {
      namespace: "TRILOM",
      config: {
        // ...defaultConfig,
        test: { test1: "hello" },
      },
      log: defaultConfig.log,
    } as ConfigOptions,
  },
};
const FileConfigTests: Record<
  string,
  & Record<"i", string | CommandOptions | ConfigOptions>
  & Record<
    "o",
    ConfigOptions | LogConfigMap | FileConfig | CommandOptions | string
  >
> = {
  object: {
    i: "default",
    o: {
      namespace: "DEFAULT",
      config: {},
      log: defaultConfig.log,
      path: Deno.cwd() + "/trailmix.config.ts",
    } as ConfigOptions,
  },
  log: {
    i: {
      console: { format: "json" },
    },
    o: {
      "console": {
        "level": "ERROR",
        "format": "json",
        "color": true,
        "date": false,
        "enabled": true,
      },
      "file": {
        "level": "ERROR",
        "format": "json",
        "path": ".",
        "date": false,
        "enabled": false,
      },
    },
  },
  config: {
    i: "default",
    o: {},
  },
  nsObject: {
    i: {
      namespace: "TRILOM",
      path: Deno.cwd() + "/trilom.config.ts",
    } as ConfigOptions,
    o: {
      namespace: "TRILOM",
      config: {},
      log: defaultConfig.log,
      path: Deno.cwd() + "/trilom.config.ts",
    } as ConfigOptions,
  },
  nsObjectNoPath: {
    i: {
      namespace: "TRILOM",
    } as ConfigOptions,
    o: {
      namespace: "TRILOM",
      config: {},
      log: defaultConfig.log,
      path: Deno.cwd() + "/trilom.config.ts",
    } as ConfigOptions,
  },
  nsObjectParsed: {
    i: "",
    o: {
      namespace: "TRILOM",
      config: {
        log: { console: { level: "DEBUG" } },
        test: { test1: "hello" },
      },
      log: {
        "console": {
          "level": "DEBUG",
          "format": "string",
          "color": true,
          "date": false,
          "enabled": true,
        },
        "file": {
          "level": "ERROR",
          "format": "json",
          "path": ".",
          "date": false,
          "enabled": false,
        },
      },
      path: Deno.cwd() + "/trilom.config.ts",
    } as ConfigOptions,
  },
};
const EnvConfigTests: Record<
  string,
  & Record<"i", string | CommandOptions | ConfigOptions>
  & Record<
    "o",
    ConfigOptions | LogConfigMap | FileConfig | CommandOptions | string
  >
> = {
  object: {
    i: "default",
    o: {
      namespace: "DEFAULT",
      config: defaultConfig,
      log: defaultConfig.log,
      path: Deno.cwd() + "/trailmix.config.ts",
    } as ConfigOptions,
  },
  log: {
    i: {
      log: { console: { format: "json" } },
    },
    o: {
      "console": {
        "level": "ERROR",
        "format": "json",
        "color": true,
        "date": false,
        "enabled": true,
      },
      "file": {
        "level": "ERROR",
        "format": "json",
        "path": ".",
        "date": false,
        "enabled": false,
      },
    },
  },
  config: {
    i: "default",
    o: defaultConfig,
  },
  nsObject: {
    i: {
      namespace: "TRILOM",
      path: Deno.cwd() + "/trilom.config.ts",
    } as ConfigOptions,
    o: {
      namespace: "TRILOM",
      config: defaultConfig,
      log: defaultConfig.log,
      path: Deno.cwd() + "/trilom.config.ts",
    } as ConfigOptions,
  },
  nsObjectParsed: {
    i: "",
    o: {
      namespace: "TRILOM",
      config: {
        log: { console: { level: "DEBUG" } },
        test: { test1: "hello" },
      },
      log: {
        "console": {
          "level": "DEBUG",
          "format": "string",
          "color": true,
          "date": false,
          "enabled": true,
        },
        "file": {
          "level": "ERROR",
          "format": "json",
          "path": ".",
          "date": false,
          "enabled": false,
        },
      },
      path: Deno.cwd() + "/trilom.config.ts",
    } as ConfigOptions,
  },
};

async function writeFile(
  file = "trailmix.config.ts",
  cwd = true,
  content = 'export default {log: {console: {format: "json"}}};',
) {
  return await Deno.writeFile(
    (cwd ? (Deno.cwd() + "/") : "") + file,
    new TextEncoder().encode(content),
  );
}
const testObjs: Record<ConfigNames, string> = {
  Config: "Config",
  FileConfig: "FileConfig",
  EnvConfig: "EnvConfig",
  FlagConfig: "FlagConfig",
};
function objFactory(type: ConfigNames = "Config", opts?: ConfigOptions) {
  if (type === "FileConfig") return new FileConfig(opts);
  if (type === "EnvConfig") return new EnvConfig(opts);
  if (type === "FlagConfig") return new FlagConfig(opts);
  else return new Config(opts);
}
function objFactoryStatic(
  type: ConfigNames = "Config",
) {
  if (type === "FileConfig") return FileConfig;
  if (type === "EnvConfig") return EnvConfig;
  if (type === "FlagConfig") return FlagConfig;
  else return Config;
}
const f = testFunction;
const fa = testFunctionAsync;
Deno.test({
  name: `Config.ts`,
  fn: async () => {
    for (const o in testObjs) {
      const obj = o as ConfigNames;
      if (obj === "Config") {
        const t = ConfigTests;
        let cfg = objFactory(obj);
        f(`${obj}.ts - simple - default` + " object", table, cfg, t.object.o);
        f(
          `${obj}.ts - simple - default` + " config",
          table,
          cfg.config,
          t.config.o,
        );
        f(
          `${obj}.ts - simple - default` + " parseLog()",
          table,
          objFactoryStatic(obj).parseLog(t.log.i as LogConfigMap),
          t.log.o,
        );
        cfg = objFactory(obj, t.nsObject.i as ConfigOptions);
        f(
          `${obj}.ts - simple - named NS` + " object",
          table,
          cfg,
          t.nsObject.o,
        );
      }
      if (obj === "FileConfig") {
        const t = FileConfigTests;
        // default
        await writeFile().then(async (file) => {
          const cfg = objFactory(obj) as FileConfig;
          f(`${obj}.ts - simple - default` + " object", table, cfg, t.object.o);
          f(
            `${obj}.ts - simple - default` + " config",
            table,
            cfg.config,
            t.config.o,
          );
          fa(
            `${obj}.ts - simple - default` + " parseFile().log",
            table,
            (await cfg.parseFile()).log,
            t.log.o,
          );
          fa(
            `${obj}.ts - simple - default` + " parseFile().log failure",
            table,
            () => cfg.parseFile("./nope.ts"),
            Error.name,
          );
          await Deno.remove("trailmix.config.ts");
        });
        await writeFile(
          "trilom.config.ts",
          true,
          'export default {log: {console: {level: "DEBUG"}}, test:{test1: "hello"}};',
        ).then(async (file) => {
          const cfgNoPath = objFactory(
            obj,
            t.nsObjectNoPath.i as ConfigOptions,
          ) as FileConfig;
          f(
            `${obj}.ts - simple - named NS` + " object",
            table,
            cfgNoPath,
            t.nsObjectNoPath.o,
          );
          const cfg = objFactory(
            obj,
            t.nsObject.i as ConfigOptions,
          ) as FileConfig;
          f(
            `${obj}.ts - simple - named NS w/ path` + " object",
            table,
            cfg,
            t.nsObject.o,
          );
          fa(
            `${obj}.ts - simple - named NS` + " parseFile()",
            table,
            await cfg.parseFile(),
            t.nsObjectParsed.o,
          );
          fa(
            `${obj}.ts - simple - named NS` + " parseFile() failure",
            table,
            () => cfg.parseFile("./nope.ts"),
            Error.name,
          );
          await Deno.remove("trilom.config.ts");
        });
        table = renderTable(table, false);
      }
      if (obj === "EnvConfig") {
        const t = EnvConfigTests;
        const cfgS = objFactoryStatic(obj) as typeof EnvConfig;
        Deno.env.delete("DEFAULT_LOG_CONSOLE_LEVEL");
        Deno.env.delete("DEFAULT_TEST1");
        f(`${obj}.parseEnv() - empty`, table, cfgS.parseEnv(), {});
        f(`${obj}.parseLog() - empty`, table, cfgS.parseLog(), {
          "console": {
            "level": "ERROR",
            "format": "string",
            "color": true,
            "date": false,
            "enabled": true,
          },
          "file": {
            "level": "ERROR",
            "format": "json",
            "path": ".",
            "date": false,
            "enabled": false,
          },
        });
        testFunction(
          `${obj}.strParse() doesn't change key case`,
          table,
          EnvConfig.strParse(
            "DEFAULT_TEST_testWord_TestPhrase_A_B",
            "hello",
            "DEFAULT",
            "_",
            false,
          ),
          {
            "TEST": {
              "testWord": {
                "TestPhrase": {
                  "A": {
                    "B": "hello",
                  },
                },
              },
            },
          },
        );
        // set config to some different cases
        // pass string
        Deno.env.set("DEFAULT_TEST1", "val1");
        // pass boolean true
        Deno.env.set("DEFAULT_TEST2", "true");
        // pass list
        Deno.env.set("DEFAULT_TEST3", JSON.stringify(["val1", "val2"]));
        Deno.env.set("DEFAULT_TEST4_A_B", "false");
        Deno.env.set("DEFAULT_TEST5_testWord_TestPhrase_A_B", "hello");
        Deno.env.set("DEFAULT_LOG_CONSOLE_LEVEL", "DEBUG");
        // set config to previously set variables and parse them with static obj
        testFunction(
          `${obj}.parseEnv() - not empty`,
          table,
          cfgS.parseEnv(),
          {
            "log": {
              "console": {
                "level": "DEBUG",
              },
            },
            "test1": "val1",
            "test2": true,
            "test3": [
              "val1",
              "val2",
            ],
            "test4": {
              "a": {
                "b": false,
              },
            },
            "test5": {
              "testword": {
                "testphrase": {
                  "a": {
                    "b": "hello",
                  },
                },
              },
            },
          },
        );
        // change config variable and ensure it is changed
        Deno.env.set("DEFAULT_LOG_CONSOLE_ENABLED", "false");
        Deno.env.set("DEFAULT_LOG_FILE_LEVEL", "DEBUG");
        Deno.env.set("DEFAULT_LOG_FILE_ENABLED", "true");
        testFunction(
          `${obj}.parseLog() merges log config`,
          table,
          cfgS.parseLog(cfgS.parseEnv().log as LogConfigMap),
          {
            "console": {
              "level": "DEBUG",
              "format": "string",
              "color": true,
              "date": false,
              "enabled": false,
            },
            "file": {
              "level": "DEBUG",
              "format": "json",
              "path": ".",
              "date": false,
              "enabled": true,
            },
          },
        );
        let cfg = objFactory(
          obj,
        ) as EnvConfig;
        f(
          `${obj}.ts - simple - default` + " object",
          table,
          cfg,
          {
            "namespace": "DEFAULT",
            "config": {
              "log": {
                "console": {
                  "enabled": false,
                  "level": "DEBUG",
                },
                "file": {
                  "enabled": true,
                  "level": "DEBUG",
                },
              },
              "test1": "val1",
              "test2": true,
              "test3": [
                "val1",
                "val2",
              ],
              "test4": {
                "a": {
                  "b": false,
                },
              },
              "test5": {
                "testword": {
                  "testphrase": {
                    "a": {
                      "b": "hello",
                    },
                  },
                },
              },
            },
            "log": {
              "console": {
                "level": "DEBUG",
                "format": "string",
                "color": true,
                "date": false,
                "enabled": false,
              },
              "file": {
                "level": "DEBUG",
                "format": "json",
                "path": ".",
                "date": false,
                "enabled": true,
              },
            },
          },
        );
        cfg = objFactory(
          obj,
          { "config": { "test6": "hello" } },
        ) as EnvConfig;
        f(
          `${obj}.ts - simple - default` + " object",
          table,
          cfg,
          {
            "namespace": "DEFAULT",
            "config": {
              "test6": "hello",
              "log": {
                "console": {
                  "enabled": false,
                  "level": "DEBUG",
                },
                "file": {
                  "enabled": true,
                  "level": "DEBUG",
                },
              },
              "test1": "val1",
              "test2": true,
              "test3": [
                "val1",
                "val2",
              ],
              "test4": {
                "a": {
                  "b": false,
                },
              },
              "test5": {
                "testword": {
                  "testphrase": {
                    "a": {
                      "b": "hello",
                    },
                  },
                },
              },
            },
            "log": {
              "console": {
                "level": "DEBUG",
                "format": "string",
                "color": true,
                "date": false,
                "enabled": false,
              },
              "file": {
                "level": "DEBUG",
                "format": "json",
                "path": ".",
                "date": false,
                "enabled": true,
              },
            },
          },
        );
      }
      if (obj === "FlagConfig") {
        // set config to some different cases
        let env: Record<string, unknown> = {
          ...FlagConfig.strParse(
            "consoleLevel",
            "DEBUG",
          ),
          ...FlagConfig.strParse(
            "test1",
            "val1",
          ),
          ...FlagConfig.strParse(
            "test2",
            "true",
          ),
          ...FlagConfig.strParse(
            "test3",
            ["val1", "val2"],
          ),
          ...FlagConfig.strParse(
            "test4AB",
            "false",
          ),
          ...FlagConfig.strParse(
            "test5TestwordTestphraseAB",
            "hello",
          ),
        };
        testFunction(
          `${obj}.strParse() doesn't change key case`,
          table,
          env,
          {
            "console": {
              "level": "DEBUG",
            },
            "test1": "val1",
            "test2": true,
            "test3": [
              "val1",
              "val2",
            ],
            "test4": {
              "a": {
                "b": false,
              },
            },
            "test5": {
              "testword": {
                "testphrase": {
                  "a": {
                    "b": "hello",
                  },
                },
              },
            },
          },
        );
        const test = {
          consoleLevel: "DEBUG",
          test1: "val1",
          test2: "true",
          test3: ["val1", "val2"],
          test4AB: "false",
          test5TestwordTestphraseAB: "hello",
        };
        // set config object and parse to string config
        env = FlagConfig.parseFlags(test);
        testFunction(
          `${obj}.parseFlags() returns config`,
          table,
          env,
          {
            "console": {
              "level": "DEBUG",
            },
            "test1": "val1",
            "test2": true,
            "test3": [
              "val1",
              "val2",
            ],
            "test4": {
              "a": {
                "b": false,
              },
            },
            "test5": {
              "testword": {
                "testphrase": {
                  "a": {
                    "b": "hello",
                  },
                },
              },
            },
          },
        );
        let log: LogConfigMap = FlagConfig.parseLog(
          FlagConfig.parseFlags({
            logConsoleEnabled: false,
            logFileLevel: "INFO",
            logFileEnabled: true,
          }).log as LogConfigMap,
        );
        testFunction(
          `${obj}.parseLog() merges file config log config`,
          table,
          log,
          {
            "console": {
              "level": "ERROR",
              "format": "string",
              "color": true,
              "date": false,
              "enabled": false,
            },
            "file": {
              "level": "INFO",
              "format": "json",
              "path": ".",
              "date": false,
              "enabled": true,
            },
          },
        );
        let cfg = objFactory(
          obj,
        ) as FlagConfig;
        f(
          `${obj}.ts - simple - default` + " object",
          table,
          cfg,
          {
            "namespace": "DEFAULT",
            "config": {},
            "log": {
              "console": {
                "level": "ERROR",
                "format": "string",
                "color": true,
                "date": false,
                "enabled": true,
              },
              "file": {
                "level": "ERROR",
                "format": "json",
                "path": ".",
                "date": false,
                "enabled": false,
              },
            },
          },
        );
        cfg = objFactory(
          obj,
          { namespace: "TRILOM", flags: test },
        ) as FlagConfig;
      }
    }
    renderTable(table, true);
  },
});
