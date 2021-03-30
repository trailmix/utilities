import {
  cmdConfig,
  ConfigNames,
  ConfigOptions,
  defConfig,
  EnvConfig,
  envConfig,
  NewConfig,
  ObjectConfig,
  StringConfig,
} from "trailmix/config/mod.ts";
// import { testFunction, resetTable } from 'test/common/mod.ts';
import type { LogConfigMap } from "trailmix/log/Log.d.ts";
import {
  assertEquals,
  assertMatch,
  assertObjectMatch,
  assertStrictEquals,
  assertThrows,
  assertThrowsAsync,
} from "test/deps.ts";

// let table = resetTable();

const testVars = {
  env: {
    "TEST1": "val1",
    "TEST2": "true",
    "TEST3": JSON.stringify(["val1", "val2"]),
    "TEST4": {
      A: {
        B: "hello",
      },
    },
    "TEST5": {
      testWord: {
        TestPhrase: {
          A: {
            B: "hello",
          },
        },
      },
    },
  },
  log: {
    console: {
      level: "ERROR",
      format: "string",
      color: true,
      date: true,
    },
    file: {
      level: "ERROR",
      format: "string",
      path: ".",
      date: false,
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
  _definitionPrefix: "trailmix.config",
  _definitionPathRegexp: new RegExp(
    /\S*(\/|\\)+(trailmix.config.(ts|tsx){1}){1}/,
  ),
};

const testObjs = {
  NewConfig: "NewConfig",
  ObjectConfig: "ObjectConfig",
  EnvConfig: "EnvConfig",
  StringConfig: "StringConfig",
};
// const testObjs: Record<string, ConfigNames> = {
//   NewConfig: NewConfig,
//   ObjectConfig: ObjectConfig,
//   EnvConfig: EnvConfig,
//   StringConfig: StringConfig,
// };
function objFactory(type: ConfigNames = "NewConfig", opts: ConfigOptions = {}) {
  if (type === "ObjectConfig") return new ObjectConfig(opts);
  if (type === "EnvConfig") return new EnvConfig(opts);
  if (type === "StringConfig") return new StringConfig(opts);
  else return new NewConfig(opts);
}
function objFactoryStatic(
  type: ConfigNames = "NewConfig",
) {
  if (type === "ObjectConfig") return ObjectConfig;
  if (type === "EnvConfig") return EnvConfig;
  if (type === "StringConfig") return StringConfig;
  else return NewConfig;
}
for (let obj of Object.keys(testObjs) as ConfigNames[]) {
  // const o = testObjs[obj];
  Deno.test({
    name: `Config.ts - ${obj} default namespace`,
    fn: () => {
      const cfg = objFactory(obj);
      assertEquals(
        cfg.namespace,
        testVars.namespace,
        "Config.namespace is not the default namespace of " +
          testVars.namespace,
      );
    },
  });
  const namespace = "TRAILMIX";
  Deno.test({
    name: `Config.ts - ${obj} named namespace`,
    fn: () => {
      const cfg = objFactory(obj, { namespace });
      assertEquals(
        cfg.namespace,
        namespace,
        "Config.namespace is not the named namespace of " + namespace,
      );
    },
  });
  Deno.test({
    name: `Config.ts - ${obj} default prefix`,
    fn: () => {
      const cfg = objFactory(obj, { namespace });
      assertEquals(
        cfg,
        {
          ...cfg,
          ...{ _definition_prefix: testVars._definitionPrefix },
        },
        "Config._definitionPrefix is not the default prefix of " +
          testVars._definitionPrefix,
      );
    },
  });
  const prefix = "trilom.config";
  Deno.test({
    name: `Config.ts - ${obj} named prefix`,
    fn: () => {
      const cfg = objFactory(obj, { namespace, prefix });
      assertEquals(
        cfg,
        {
          ...cfg,
          ...{ _definition_prefix: prefix },
        },
        "Config._definitionPrefix is not the named prefix of " +
          prefix,
      );
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
  Deno.test({
    name: `Config.ts - ${obj} throw error for missing configuration`,
    fn: async () => {
      const cfg = objFactory(obj, { namespace });
      await assertThrowsAsync(async () => {
        await cfg.getConfigurationPath("nope.config");
      }, Error);
    },
  });
  Deno.test({
    name: `Config.ts - ${obj}.log is the correct default`,
    fn: () => {
      const log: LogConfigMap = objFactoryStatic(obj).log;
      assertEquals(
        log,
        testVars.log,
        "Config.log is not the correct default of " +
          testVars.log,
      );
    },
  });
  Deno.test({
    name: `Config.ts - ${obj}.parseLog() returns default log`,
    fn: () => {
      const log: LogConfigMap = objFactoryStatic(obj).parseLog();
      assertEquals(
        log,
        testVars.log,
        "Config.parseLog() is not the correct default of " +
          testVars.log,
      );
    },
  });
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
  if (obj === "EnvConfig") {
    Deno.test({
      name: `Config.ts - ${obj}.log returns env log`,
      fn: () => {
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
          "hello",
        );
        Deno.env.set(
          "DEFAULT_TEST5_testWord_TestPhrase_A_B",
          "hello",
        );
        const env: Record<string, unknown> = EnvConfig.parseEnv();
        console.log(env);
        assertEquals(
          env,
          testVars.env,
          `Config.parseEnv(): ${
            JSON.stringify(env)
          } is not the correct default of ` +
            JSON.stringify(testVars.env),
        );
      },
    });
  }
}
