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
      format: "json",
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
      format: "json",
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
      format: "json",
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
async function writeFile(file = "trailmix.config.ts") {
  return await Deno.writeFile(
    Deno.cwd() + "/" + file,
    new TextEncoder().encode('export default {consoleFormat: "json"};'),
  );
}
Deno.test({
  name: `Config.ts functional tests`,
  fn: async () => {
    for (const o in testObjs) {
      const obj = o as ConfigNames;
      // this is a default object with no params
      let cfg = objFactory(obj);
      testFunction(
        `${obj} - default namespace`,
        table,
        cfg.namespace,
        testVars.namespace,
      );
      // config object with a named namespace - namespace
      const namespace = "TRAILMIX";
      cfg = objFactory(obj, { namespace });
      testFunction(
        `${obj} - named namespace`,
        table,
        cfg.namespace,
        namespace,
      );
      // config object with named namespace - default prefix
      testFunction(
        `${obj} - default prefix`,
        table,
        cfg,
        {
          ...cfg,
          ...{ prefix: testVars.prefix },
        },
      );
      // init configurationPath and get configuration
      await testFunctionAsync(
        `${obj} - default init configuration`,
        table,
        await cfg.init(),
        {
          "env": {
            "consoleFormat": "json",
          },
          "log": defaultLog[obj],
          "namespace": namespace,
          "path": Deno.cwd() + "/trailmix.config.ts",
          "prefix": "trailmix.config",
          "_importCache": {
            ["file://" + Deno.cwd() + "/trailmix.config.ts"]: {
              "default": {
                "consoleFormat": "json",
              },
            },
          },
        },
      );
      // write a file and ensure we can resolve it
      await writeFile().then(async (v) => {
        await testFunctionAsync(
          `${obj}.getConfigurationPath - default prefix`,
          table,
          await cfg.getConfigurationPath(),
          Deno.cwd() + "/trailmix.config.ts",
        );
      });
      // config object with named namespace - get false config path
      await testFunctionAsync(
        `${obj} throw error for missing configuration`,
        table,
        (i = "nope.config") => {
          return cfg.getConfigurationPath(i);
        },
        Error.name,
      );
      // write a file and ensure we can read it
      await writeFile().then(async (v) => {
        await testFunctionAsync(
          `${obj}.getConfiguration() - default`,
          table,
          await cfg.getConfiguration(),
          '{\n  "consoleFormat": "json"\n}',
        );
      });
      // dont write file and ensure we throw error
      await testFunctionAsync(
        `${obj}.getConfiguration() - throw error for now file`,
        table,
        () => cfg.getConfiguration(Deno.cwd() + "/nope.config.ts"),
        Error.name,
      );
      const prefix = "trilom.config";
      // config object with named namespace - named prefix
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
      await writeFile("trilom.config.ts").then(async (v) => {
        testFunctionAsync(
          `${obj}.getConfigurationPath - named prefix`,
          table,
          await cfg.getConfigurationPath(prefix),
          Deno.cwd() + "/trilom.config.ts",
        );
      });
      // config static object - default log
      let log: LogConfigMap = objFactoryStatic(obj).log;
      testFunction(
        `${obj}.log - default`,
        table,
        log,
        defaultLog[obj],
      );
      Deno.env.delete("DEFAULT_CONSOLE_LEVEL");
      // config static object - parse new env without consoleLevel
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
        // set env to previously set variables and parse them with static obj
        let env: Record<string, unknown> = EnvConfig.parseEnv();
        testFunction(
          `STATIC ${obj}.parseEnv() - returns env`,
          table,
          env,
          testVars.env,
        );
        Deno.env.set(
          "DEFAULT_CONSOLE_LEVEL",
          "DEBUG",
        );
        // default config with instanced obj
        const cfg = new EnvConfig();
        env = cfg.parseEnv();
        testFunction(
          `${obj}.parseEnv() - returns env`,
          table,
          env,
          testVars.env,
        );
        // set env to some different cases
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
        // change env variable and ensure it is changed
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
        // default config with instanced obj
        const cfg = new StringConfig({ env: test });
        let env: Record<string, unknown> = cfg.parseEnv();
        testFunction(
          `${obj}.parseEnv() - returns env`,
          table,
          env,
          testVars.env,
        );
        // set env object and parse to string config
        env = StringConfig.parseEnv(test);
        testFunction(
          `${obj}.parseEnv() returns env`,
          table,
          env,
          testVars.env,
        );
        // ensure log config works
        const ex = {
          ...defaultLog[obj],
          ...{
            console: { ...defaultLog[obj].console, ...{ level: "DEBUG" } },
            file: { ...defaultLog["Config"].file, ...{ level: "INFO" } },
          },
        };
        const log: LogConfigMap = StringConfig.parseLog({
          consoleLevel: "DEBUG",
          fileLevel: "INFO",
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
