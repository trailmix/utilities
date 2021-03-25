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
  namespace: "DEFAULT",
  _definitionPrefix: "trailmix.config",
  _definitionPathRegexp: new RegExp(/\S*\/(trailmix.config.(ts|tsx){1}){1}/),
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
      const cfg: NewConfig = new NewConfig({ namespace });
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
      const cfg: NewConfig = new NewConfig({ namespace });
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
      const cfg: NewConfig = new NewConfig({ namespace, prefix });
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
  Deno.test({
    name: `Config.ts - ${obj} configuration path`,
    fn: async () => {
      const cfg: NewConfig = new NewConfig({ namespace });
      const path = await cfg.getConfigurationPath();
      assertMatch(
        path,
        testVars._definitionPathRegexp,
        "default Config._definition_path is not resolvable, or doesn't exist at " +
          "./trailmix.config.ts",
      );
    },
  });
  const definitionPathRegexp = new RegExp(
    /\S*\/(trilom.config.(ts|tsx){1}){1}/,
  );
  Deno.test({
    name: `Config.ts - ${obj} configuration path`,
    fn: async () => {
      const cfg: NewConfig = new NewConfig({ namespace });
      const path = await cfg.getConfigurationPath(prefix);
      assertMatch(
        path,
        definitionPathRegexp,
        "named Config._definition_path is not resolvable, or doesn't exist at ./" +
          prefix,
      );
    },
  });
  Deno.test({
    name: `Config.ts - ${obj} throw error for missing configuration`,
    fn: async () => {
      const cfg: NewConfig = new NewConfig({ namespace });
      await assertThrowsAsync(async () => {
        await cfg.getConfigurationPath("nope.config");
      }, Error);
    },
  });
}
