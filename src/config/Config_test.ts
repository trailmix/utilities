import {
  Config,
  ConfigNames,
  ConfigOptions,
  EnvConfig,
  ObjectConfig,
  StringConfig,
} from "trailmix/config/mod.ts";
import {
  resetTable,
  testFunction,
  testFunctionAsync,
} from "trailmix/common/mod.ts";
import type { LogConfigMap } from "trailmix/log/mod.ts";

let table = resetTable();

const testVars = {
  strParse: {
    TEST: {
      testWord: {
        TestPhrase: {
          A: {
            B: "hello",
          },
        },
      },
    },
  },
  stringConfig: {
    env1: {
      test1: "hello",
    },
    env2: {
      test2: {
        testword: { testphrase: { testname: { test: "hello" } } },
      },
    },
    env3: { test3: { testword: { testphrase: { a: { b: "hello" } } } } },
  },
  env: {
    console: {
      level: "DEBUG",
    },
    test1: "val1",
    test2: "true",
    test3: JSON.stringify(["val1", "val2"]),
    test4: {
      a: {
        b: "Hello",
      },
    },
    test5: {
      testword: {
        testphrase: {
          a: {
            b: "hello",
          },
        },
      },
    },
  },
  config: {
    namespace: "TRAILMIX", // prefixed to all env vars
    vars: {
      consoleLevel: {
        command: "base",
        global: true,
        description: "Explicitly set console log level",
        // object will be created as log.console.level
        env: "LOG_CONSOLE_LEVEL", // namespace+ENV == TRAILMIX_LOG_CONSOLE_LEVEL
      },
    },
  },
  namespace: "DEFAULT",
  prefix: "trailmix.config",
  _definitionPathRegexp: new RegExp(
    /\S*(\/|\\)+(trailmix.config.(ts|tsx){1}){1}/,
  ),
};

const defaultLog: Record<ConfigNames, LogConfigMap> = {
  Config: {
    console: {
      level: "ERROR",
      format: "string",
      color: true,
      date: false,
    },
    file: {
      level: "ERROR",
      format: "string",
      path: ".",
      date: false,
    },
  },
  ObjectConfig: {
    console: {
      level: "ERROR",
      format: "string",
      color: true,
      date: false,
    },
    file: {
      level: "ERROR",
      format: "string",
      path: ".",
      date: false,
    },
  },
  EnvConfig: {
    console: {
      level: "ERROR",
      format: "string",
      color: true,
      date: false,
    },
    file: {
      level: "ERROR",
      format: "string",
      path: ".",
      date: false,
    },
  },
  StringConfig: {
    console: {
      level: "ERROR",
      format: "string",
      color: true,
      date: false,
    },
  },
};
const testObjs: Record<ConfigNames, string> = {
  Config: "Config",
  ObjectConfig: "ObjectConfig",
  EnvConfig: "EnvConfig",
  StringConfig: "StringConfig",
};

function objFactory(type: ConfigNames = "Config", opts: ConfigOptions = {}) {
  if (type === "ObjectConfig") return new ObjectConfig(opts);
  if (type === "EnvConfig") return new EnvConfig(opts);
  if (type === "StringConfig") return new StringConfig(opts);
  else return new Config(opts);
}
function objFactoryStatic(
  type: ConfigNames = "Config",
) {
  if (type === "ObjectConfig") return ObjectConfig;
  if (type === "EnvConfig") return EnvConfig;
  if (type === "StringConfig") return StringConfig;
  else return Config;
}
Deno.test({
  name: `Config.ts functional tests`,
  fn: async () => {
    for (const o in testObjs) {
      const obj = o as ConfigNames;
      let cfg = objFactory(obj as ConfigNames);
      testFunction(
        `${obj} - default namespace`,
        table,
        cfg.namespace,
        testVars.namespace,
      );
      const namespace = "TRAILMIX";
      cfg = objFactory(obj, { namespace });
      testFunction(
        `${obj} - named namespace`,
        table,
        cfg.namespace,
        namespace,
      );
      cfg = objFactory(obj, { namespace });
      testFunction(
        `${obj} - default prefix`,
        table,
        cfg,
        {
          ...cfg,
          ...{ prefix: testVars.prefix },
        },
      );
      const prefix = "trilom.config";
      cfg = objFactory(obj, { namespace, prefix });
      testFunction(
        `${obj} - named prefix`,
        table,
        cfg,
        {
          ...cfg,
          ...{ prefix: prefix },
        },
      );
      cfg = objFactory(obj, { namespace });
      await testFunctionAsync(
        `${obj} throw error for missing configuration`,
        table,
        (i = "nope.config") => {
          return cfg.getConfigurationPath(i);
        },
        Error.name,
      );
      let log: LogConfigMap = objFactoryStatic(obj).log;
      testFunction(
        `${obj}.log - default`,
        table,
        log,
        defaultLog[obj],
      );
      Deno.env.delete("DEFAULT_CONSOLE_LEVEL");
      log = objFactoryStatic(obj).parseLog();
      testFunction(
        `${obj}.log - default`,
        table,
        log,
        defaultLog[obj],
      );
      if (obj === "EnvConfig") {
        // pass string
        Deno.env.set("DEFAULT_TEST1", "val1");
        // pass boolean true
        Deno.env.set(
          "DEFAULT_TEST2",
          (String(true) === "true" ? "true" : "false"),
        );
        // pass list
        Deno.env.set(
          "DEFAULT_TEST3",
          JSON.stringify(["val1", "val2"]),
        );
        Deno.env.set(
          "DEFAULT_TEST4_A_B",
          "Hello",
        );
        Deno.env.set(
          "DEFAULT_TEST5_testWord_TestPhrase_A_B",
          "hello",
        );
        Deno.env.set(
          "DEFAULT_CONSOLE_LEVEL",
          "DEBUG",
        );
        let env: Record<string, unknown> = EnvConfig.parseEnv();
        testFunction(
          `${obj}.parseEnv() - returns env`,
          table,
          env,
          testVars.env,
        );

        env = EnvConfig.strParse(
          "DEFAULT_TEST_testWord_TestPhrase_A_B",
          "hello",
          "DEFAULT",
          "_",
          false,
        );
        testFunction(
          `${obj}.strParse() doesn't change key case`,
          table,
          env,
          testVars.strParse,
        );
        Deno.env.set("DEFAULT_CONSOLE_LEVEL", "DEBUG");
        const ex = {
          ...defaultLog[obj],
          ...{ console: { ...defaultLog[obj].console, ...{ level: "DEBUG" } } },
        };
        const log = EnvConfig.parseLog();
        testFunction(
          `${obj}.parseLog() merges env log config`,
          table,
          log,
          ex,
        );
      }
      if (obj === "StringConfig") {
        const test = {
          consoleLevel: "DEBUG",
          test1: "val1",
          test2: (String(true) === "true" ? "true" : "false"),
          test3: JSON.stringify(["val1", "val2"]),
          test4AB: "Hello",
          test5TestwordTestphraseAB: "hello",
        };
        const env: Record<string, unknown> = StringConfig.parseEnv(test);
        testFunction(
          `${obj}.parseEnv() returns env`,
          table,
          env,
          testVars.env,
        );
        const ex = {
          ...defaultLog[obj],
          ...{ console: { ...defaultLog[obj].console, ...{ level: "DEBUG" } } },
        };
        const log: LogConfigMap = StringConfig.parseLog({
          consoleLevel: "DEBUG",
        });
        testFunction(
          `${obj}.parseLog() merges env log config`,
          table,
          log,
          ex,
        );
      }
      table.render();
      table = resetTable();
    }
  },
});

// Deno.test({
//   name: `Config.ts - ${obj} configuration path`,
//   fn: async () => {
//     const cfg = objFactory(obj, { namespace });
//     const path = await cfg.getConfigurationPath();
//     assertMatch(
//       path,
//       testVars._definitionPathRegexp,
//       "default Config._definition_path is not resolvable, or doesn't exist at " +
//         "./trailmix.config.ts",
//     );
//   },
// });
// const definitionPathRegexp = new RegExp(
//   /\S*(\/|\\)+(trilom.config.(ts|tsx){1}){1}/,
// );
// Deno.test({
//   name: `Config.ts - ${obj} configuration path`,
//   fn: async () => {
//     const cfg = objFactory(obj, { namespace });
//     const path = await cfg.getConfigurationPath(prefix);
//     assertMatch(
//       path,
//       definitionPathRegexp,
//       "named Config._definition_path is not resolvable, or doesn't exist at ./" +
//         prefix,
//     );
//   },
// });
// Deno.test({
//   name: `Config.ts - ${obj} throw error for missing configuration`,
//   fn: async () => {
//     const cfg = objFactory(obj, { namespace });
//     await assertThrows(
//       () => cfg.getConfigurationPath("nope.config"),
//       Error,
//     );
//   },
// });
// Deno.test({
//   name: `Config.ts - ${obj}.getConfiguration() to ingest cmd config`,
//   fn: async () => {
//     const cfg = await objFactory(obj, { namespace }).getConfigurationPath();
//     const config = await cfg.getConfiguration();
//     console.log(config);
//     assertEquals(
//       config,
//       testVars.config,
//       "Config.getConfiguration() cannot ingest command config" +
//         config,
//     );
//   },
// });
