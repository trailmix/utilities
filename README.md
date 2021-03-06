<h1 align="center">trailmix/utilities</h1>

<h3 align="center">Repository of utilities for deno written in typescript for trailmixπ€π¦π£πΌ</h3>
<p align="center">
  <a href="https://deno.land">
    <img src="https://img.shields.io/badge/Deno-1.9.0-brightgreen.svg?logo=deno" alt="deno" />
  </a>
  <a href="https://deno.land/x/trailmix">
    <img src="https://img.shields.io/badge/utilities-v1.0.5-green.svg" alt="trailmix utilities" />
  </a>
  <a href="http://djkittyplayz.art/">
    <img src="https://img.shields.io/badge/art-djkittyplayz-yellow" alt="art djkittyplayz" />
  </a>
  <a href="https://deno.land/x/trailmix">
    <img src="https://img.shields.io/github/downloads/trailmix/utilities/total" alt="downloads" />
  </a>
</p>
<p align="center">
  <a href="https://github.com/trailmix/utilities/actions">
    <img src="https://github.com/trailmix/utilities/workflows/ci/badge.svg" alt="ci" />
  </a>
  <a href="https://app.codecov.io/gh/trailmix/utilities" align="left">
    <img
      src="https://codecov.io/gh/trailmix/utilities/branch/master/graph/badge.svg?token=96CJ5IPAAN"
      alt="codecov master"
    />
  </a>
  <a href="https://app.codecov.io/gh/trailmix/utilities/branch/next" align="right">
    <img
      src="https://codecov.io/gh/trailmix/utilities/branch/next/graph/badge.svg?token=96CJ5IPAAN"
      alt="codecov next"
    />
  </a>
  <a href="https://github.com/trailmix/utilities/actions">
    <img src="https://github.com/trailmix/utilities/workflows/ci/badge.svg?branch=next" alt="ci" />
  </a>
</p>
<p align="center">
  <a href="https://app.codecov.io/gh/trailmix/utilities" align="left">
    <img src="https://codecov.io/gh/trailmix/utilities/branch/master/graphs/tree.svg" alt="codecov master"/>
  </a>
  <a href="https://app.codecov.io/gh/trailmix/utilities/branch/next" align="right">
    <img src="https://codecov.io/gh/trailmix/utilities/branch/next/graphs/tree.svg" alt="codecov next">
  </a>
</p>

## [CONTRIBUTE - learn how to help π§ͺππ©π π―π](CONTRIBUTE.md)

## Usage

### [π Colors](./src/color/README.md)

<h3 align="center">Color string output easily with ANSI.</h3>

#### **Simple**

```typescript
// import fns and style helpers
import {
  messageByFn,
  messageByFnSpread,
  messageByString,
  messageByStringSpread,
  random,
  randomOpts,
  randomStyleFn,
  randomStyleString,
  styles as s,
} from "https://deno.land/x/trailmix@1.0.5/mod.ts";

// random StyleFn Message Functions
console.log(messageByFn("hello", [s.cyan, s.bgRed])); // cyan text, red BG
console.log(messageByFnSpread("test", s.yellow, s.bgRed)); // yellow text, red BG
// random Style Functions
console.log(randomStyleFn("emphasis")); // get a random emphasis typeof StyleFn {(str:string) => string}
console.log(randomStyleString("color")); // get a random color string typeof Style
// random StyleString Message Functions
console.log(messageByString("hello", [randomStyleString("color")])); // random text color
console.log(messageByStringSpread("hello", randomStyleString("bgColor"))); // random background color
console.log(messageByFnSpread("hello", s[randomStyleString("emphasis")])); // call style list with random style fn
console.log(random("hello")); // get random style on this string (50% chance of color/bg/emphasis)
console.log(random("hello", { color: true })); // get random color on this string
console.log(random("hello", randomOpts({ color: true }))); // get random color 100%, (50% chance for others)
```

<a href="https://deno.land/x/trailmix/src/color">
  <img
    src="https://trailmix-images.s3.amazonaws.com/utilities/colorS.gif"
    alt="goofus_colors goofus colors trailmix deno typescript"
  />
</a>

#### **Complex**

```typescript
// import the class and style helpers
import {
  Color as C,
  stylesMap as sM,
} from "https://deno.land/x/trailmix@1.0.5/mod.ts";
import type { Style } from "https://deno.land/x/trailmix@1.0.5/mod.ts";

// you can use defined or anon functions
function test(str: string) {
  return str + "defined function";
}
const byFnConfAlpha = [
  C.randomStyleFn(), // randoms return a random text color by default
  test,
  C.randomStyleFn("bgColor"),
  (str: string) => {
    // anon functions can be used
    return str + C.random("anon function", { emphasis: true });
  },
];
const rConf = { color: true, bgColor: true, emphasis: false };
const byFnConfBeta = [
  sM.color.brightBlue, // stylesMap is ordered by color|bgColor|emphasis
  (str: string) => {
    return str + "anon function";
  },
  sM.color.yellow,
  sM.bgColor.bgBrightCyan,
  test,
  sM.emphasis.strikethrough,
  C.styleMap.dim, // styles is all in a map
  sM.bgColor.bgBrightYellow,
  test,
  (str: string) => {
    return "anon function" + str;
  },
  C.styleMap.bgBrightYellow,
];
const _sList: Style[] = ["cyan", "bgMagenta", "underline"]; // list of Style strings
console.log(C.messageByFnSpread("test", ...byFnConfAlpha)); // spread StyleFns
console.log(C.messageByFnSpread("test", ...byFnConfBeta));
console.log(
  C.messageByString("this is not a spring spread", [
    "cyan",
    "bgMagenta",
    "underline",
  ]),
); // no spread
console.log(
  C.messageByStringSpread(
    "a spring spread",
    "green",
    "bgBlack",
    "strikethrough",
  ),
); // spreading Style strings
console.log(
  C.messageByStringSpread("a spring spread again with a var", ..._sList),
);
console.log(C.random("test some string", rConf)); // random function
```

<a href="https://deno.land/x/trailmix/src/color">
  <img
    src="https://trailmix-images.s3.amazonaws.com/utilities/colorC.gif"
    alt="goofus_colors goofus colors trailmix deno typescript"
  />
</a>

### [π Config](./src/config/README.md)

<h3 align="center">Ingest configuration from env variables, file, or flags.</h3>

#### **Simple**

```typescript
import {
  EnvConfig,
  FlagConfig,
} from "https://deno.land/x/trailmix@1.0.5/mod.ts";

Deno.env.set("DEFAULT_TEST1", "val1"); // set example env var in DEFAULT namespace
// slurp up env vars
console.log(EnvConfig.parseEnv()); // should have { test1: "val1" }
// something more complex
Deno.env.set("DEFAULT_LOG_CONSOLE_LEVEL", "DEBUG"); // set log level in DEFAULT namespace
console.log(EnvConfig.parseEnv()); // should have { test1: "val1", log: { console: { level: "DEBUG" } } }
// this is good for cmd line arguments (--logConsoleLevel DEBUG)
console.log(FlagConfig.parseFlags({
  logConsoleLevel: "DEBUG",
  test1: "val1",
  test2: "true",
  test3: ["val1", "val2"],
  test4AB: "false",
  test5TestwordTestphraseAB: "hello",
})); // should have same as above
```

<a href="https://deno.land/x/trailmix/src/config">
  <img
    src="https://trailmix-images.s3.amazonaws.com/utilities/configS.gif"
    alt="goofus_config goofus config trailmix deno typescript"
  />
</a>

#### **Complex**

```typescript
import {
  EnvConfig,
  FileConfig,
  FlagConfig,
} from "https://deno.land/x/trailmix@1.0.5/mod.ts";

// set env first is if it was there before runtime
Deno.env.set("TRILOM_LOG_CONSOLE_LEVEL", "DEBUG");
// lets use our own namespace with a config file
await Deno.writeFile(
  Deno.cwd() + "/trilom.config.ts",
  new TextEncoder().encode(
    'export default {log: {console: {format: "json"}}};',
  ),
);
// slurp flags
const flagCfg = new FlagConfig({
  namespace: "TRILOM",
  flags: { logConsoleColor: "false" },
});
// scope env vars
const envCfg = new EnvConfig(flagCfg);
// suck in file
const cfg = await new FileConfig(envCfg).parseFile();

console.log(flagCfg); // will give a log config with {console: { color: false } }
console.log(envCfg); // will give a log config with {console: { color: false, level: "DEBUG" } }
console.log(cfg); // will give a log config with {console: { color: false, level: "DEBUG", format: "json" } }
```

<a href="https://deno.land/x/trailmix/src/config">
  <img
    src="https://trailmix-images.s3.amazonaws.com/utilities/configC.gif"
    alt="goofus_config goofus config trailmix deno typescript"
  />
</a>

### [πͺ΅ Log](./src/log/README.md)

<h3 align="center">make logging grape again with color</h3>

#### **Simple**

```typescript
import { Log, random as r } from "https://deno.land/x/trailmix@1.0.5/mod.ts";
Log.error("basic britchesπ"); // in red "[default] basic britchesπ"
// pass any number of arguments
Log.success(
  "test",
  { error: "really?" },
  "s",
  20,
  90071992547409990071992547404545990n,
  true,
  null,
  undefined,
  Symbol("key"),
  new Error("test"),
  Log.success("noArgs"),
  Log.error("args", "failure"),
); // in green  "[default] success"
Log.error("error", "trust me, its π"); //
Log.success(
  "silly " + r("r") + r("a") + r("n") + r("d") + r("o") + r("m") + " strang",
);
```

<a href="https://deno.land/x/trailmix/src/log">
  <img
    src="https://trailmix-images.s3.amazonaws.com/utilities/logS.gif"
    alt="goofus_log goofus log trailmix deno typescript"/>
</a>

#### **Complex**

```typescript
import {
  EnvConfig,
  FlagConfig,
  Log,
} from "https://deno.land/x/trailmix@1.0.5/mod.ts";

// make a logger with flags
const l = await new Log(
  "default",
  new FlagConfig({
    flags: {
      logConsoleLevel: "DEBUG",
      logConsoleFormat: "json",
      logFileEnabled: true,
      logFilePath: ".",
      logFileLevel: "DEBUG",
      logFileFormat: "string",
    },
  }).log,
).init();
// now log, 5 console json messages, and 5 string file messages
l.success("success");
l.error("error");
l.warn("warn");
l.info("info");
l.debug("debug");

// make a test logger with env for deDEBUG
Deno.env.set("DEFAULT_LOG_CONSOLE_LEVEL", "DEBUG");
const lNew = await new Log(
  "test",
  new EnvConfig().log,
).init();
// now log, 6 console string messages
lNew.success("success");
lNew.error("error");
lNew.warn("warn");
lNew.info("info");
lNew.debug("debug");
```

<a href="https://deno.land/x/trailmix/src/log">
  <img
    src="https://trailmix-images.s3.amazonaws.com/utilities/logC.gif"
    alt="goofus_log goofus log trailmix deno typescript"/>
</a>

### [π° Watch](./src/watch/README.md)

<h3 align="center">Watch and react to changes of files.</h3>

### [π common](./src/common/README.md)

<h3 align="center">a collection of micro-utilities</h3>

#### alphaBET

Use color, and table to build a table of 26 rows with 26 random styled letter in
each row.

```typescript
import {
  random as r,
  resetTable,
} from "https://deno.land/x/trailmix@1.0.5/mod.ts";
import type { Table } from "https://deno.land/x/trailmix@1.0.5/mod.ts";

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const tR: string[][] = [];
for (const a of Array(10).keys()) {
  let m = "";
  for (const _a of alpha) {
    m += r(_a);
  }
  tR.push([m + "\n"]);
}
resetTable({ table: tR as Table, maxColWidth: 100 }).render();
```

<a href="https://deno.land/x/trailmix/src/common">
  <img
    src="https://trailmix-images.s3.amazonaws.com/utilities/common.gif"
    alt="goofus_common goofOOF common trailmix deno typescript"
  />
</a>
