// internal
import { FlagConfig } from "trailmix/config/mod.ts";
import { Log, loggerNames, logLevels } from "trailmix/log/mod.ts";
import {
  renderTable,
  resetTable,
  stringifyBigInt,
  testFunction,
  testFunctionAsync,
} from "trailmix/common/mod.ts";
import type { LogLevel } from "trailmix/log/mod.ts";
import type { Table } from "trailmix/common/mod.ts";
// external
import { getLevelByName } from "trailmix/deps.ts";
import { resolve } from "trailmix/deps.ts";

let table = resetTable();
// console.log = () => {};

enum strings {
  ansi_reset = "\x1b[0m",
  bold_prefix = "\x1b[1m",
  bold_suffix = "\x1b[22m",
  underline_prefix = "\x1b[4m",
  underline_suffix = "\x1b[24m",
  color_suffix = "\x1b[39m",
}
enum colors {
  clear = "0",
  black = "30",
  red = "31",
  green = "32",
  yellow = "33",
  blue = "34",
  magenta = "35",
  cyan = "36",
  white = "37",
  BGblack = "40",
  BGred = "41",
  BGgreen = "42",
  BGyellow = "43",
  BGblue = "44",
  BGmagenta = "45",
  BGcyan = "46",
  BGwhite = "47",
}
/**
 * pass in logger level, name, and message and get a parsed message
 * @param log log message to log
 * @param level LogLevel object
 * @param logger logger name string
 * @returns formatted log message
 */
// eslint-disable-next-line max-params
function logString(
  log: string,
  level: LogLevel = "ERROR",
  logger = "default",
  colorMsg = true,
  ...args: unknown[]
): string {
  const logColor = colorLog(level, logger);
  const colorSuffix = logColor === "0" ? "0" : strings.color_suffix;
  const bold = level === "CRITICAL" ? true : false;
  const _log = level === "NOTSET" && logger === "test" ? "deDEBUG:" + log : log;
  let msg = `[${logger}] ${_log}`;
  if (colorMsg) {
    msg = `[${color(logger, logColor, colorSuffix, bold)}] ${
      color(_log, logColor, colorSuffix, bold)
    }`;
  }
  if (args !== null && args.length > 0) {
    msg = msg + " \nArguments:" + JSON.stringify(args[0], stringifyBigInt, 2);
  }
  return msg;
}
// eslint-disable-next-line max-params
function color(
  s: string,
  prefix: strings | colors = colors.clear,
  suffix: strings | string = strings.color_suffix,
  bold = false,
  underline = false,
) {
  const _underline = underline ? strings.underline_prefix : "";
  const _bold = bold ? strings.bold_prefix : "";
  const _prefix = Number(prefix) > 0 ? `\x1b[${prefix}m` : "";
  const _suffix = suffix !== "0" ? suffix : "";
  const _underline_suffix = underline ? strings.underline_suffix : "";
  const _bold_suffix = bold ? strings.bold_suffix : "";
  let msg =
    `${_bold}${_underline}${_prefix}${s}${_suffix}${_underline_suffix}${_bold_suffix}`;
  return msg;
}
/**
 * pass in logger name and level and get a string color
 * @param level LogLevel object
 * @param logger logger name string
 * @returns colors
 */
function colorLog(
  level: LogLevel = "ERROR",
  logger = "default",
): colors {
  let color = colors.red;
  switch (level) {
    case "CRITICAL":
      color = logger === "undefined" ? colors.red : colors.green;
      break;
    case "ERROR":
      color = colors.red;
      break;
    case "WARNING":
      color = colors.yellow;
      break;
    case "INFO":
      color = colors.blue;
      break;
    case "DEBUG":
      color = colors.clear;
      break;
    case "NOTSET":
      color = colors.white;
      break;
  }
  return color;
}
/**
 * test logger based on logger name and level
 * then test messages to ensure that
 * messages counts are correct per level
 * @param logger logger name string
 * @param level LogLevel object
 * @param l Log object
 */
// eslint-disable-next-line max-params
function testLoggerLevels(
  table: Table,
  logger = "default",
  level: LogLevel = "ERROR",
  colorMsg = true,
  l: Log,
  msg: unknown,
  ...args: unknown[]
) {
  const levelNum = getLevelByName(level);
  const message: string = typeof msg === "string"
    ? msg
    : msg instanceof Error
    ? msg.stack!
    : typeof msg === "object"
    ? JSON.stringify(msg, stringifyBigInt)
    : String(msg);
  const funcs: Record<string, string> = {};
  let ex: string[] = [];
  if (logger === "test") {
    ex = [logString(message, "NOTSET", logger, colorMsg, ...args)];
    funcs["dedebug"] = "NOTSET";
  }
  if (levelNum <= 10) {
    funcs["debug"] = "DEBUG";
  }
  if (levelNum <= 20) {
    funcs["info"] = "INFO";
  }
  if (levelNum <= 30) {
    funcs["warn"] = "WARNING";
  }
  if (levelNum <= 40) {
    funcs["error"] = "ERROR";
  }
  if (levelNum <= 50) {
    funcs["success"] = "CRITICAL";
  }
  for (const fn in funcs) {
    if (fn === "dedebug") break;
    testFunction(
      fn,
      table,
      l[fn as "debug" | "info" | "warn" | "error" | "success"](msg, ...args),
      () => {
        const r = logString(
          message,
          funcs[fn] as LogLevel,
          logger,
          colorMsg,
          args,
        );
        return ex.length > 0 ? ex.concat(r) : r;
      },
      true,
      false,
    );
    ex = [];
  }
  // divide level by 10
  let expected = levelNum / 10;
  // subtract max(50/10)+1 from sum
  expected = 6 - expected;
  // add 1 if 'test' to sum for deDEBUG messages
  expected += logger === "test" ? 1 : 0;
  // subtract 1 from sum if NOTSET, default is INFO
  expected -= levelNum === 0 ? 1 : 0;
  testFunction(
    "message count",
    table,
    Object.keys(funcs).length,
    expected,
  );
}
const messages = {
  string: ["string", `${Deno.env.get("HOME")}`, Object.keys(Deno)[0]],
  numbers: [
    1,
    Number.MAX_SAFE_INTEGER, // max number
    9007199254740999007199254740990n, // bigint
  ],
  boolean: [true, false],
  undefined: [undefined],
  null: [null],
  object: [
    new RangeError("Uh-oh!"),
    { test1: "test" },
    { test2: ["a", true, 3] },
    { test3: { testInner: "test" } },
    Deno.version,
    { deno: { ...Deno.version, ...Deno.build } },
    { deno: [Deno.version, Deno.build] },
    { deno: { version: Deno.version, build: Deno.build } },
  ],
};
const args = [
  ...messages.string,
  ...messages.numbers,
  ...messages.boolean,
  ...messages.undefined,
  ...messages.null,
  ...messages.object,
  messages.string,
  messages.numbers,
  messages.boolean,
  messages.undefined,
  messages.null,
  messages.object,
  [
    messages.string,
    messages.numbers,
    messages.boolean,
    messages.undefined,
    messages.null,
    messages.object,
  ],
];
/**
 * Functional tests
 */
Deno.test({
  name: `Log.ts Functional tests`,
  // only: true,
  fn: async () => {
    // test default static logger
    testFunction("Static default logger", table, [
      Log.success("success"),
      Log.error("error"),
      Log.warn("warn"),
      Log.info("info"),
      Log.debug("debug"),
    ], [
      logString("success", "CRITICAL"), // CRITICAL is used for success messages
      logString("error", "ERROR"),
      "",
      "",
      "",
    ]);
    // create default logger with default ERROR level
    let l: Log = new Log();
    // testCases = [logString("success", "CRITICAL"), logString("error", "ERROR")];
    testFunction("Init default logger w/o configuration", table, [
      l.success("success"),
      l.error("error"),
    ], [
      logString("success", "CRITICAL"), // CRITICAL is used for success messages
      logString("error", "ERROR"),
    ]);
    l = new Log("test");
    // create 'default' logger with WARNING level
    l = await l.init(
      "default",
      // set level to WARNING
      new FlagConfig({ flags: { logConsoleLevel: "WARNING" } }).log,
    );
    console.log(l);
    testFunction("Init default logger with level configuration", table, [
      l.success("success"),
      l.error("error"),
      l.warn("warn"),
    ], [
      logString("success", "CRITICAL"),
      logString("error", "ERROR"),
      logString("warn", "WARNING"),
    ]);
    l = new Log(
      "test",
      // create 'test' logger with INFO level
      new FlagConfig({ flags: { logConsoleLevel: "INFO" } }).log,
    );
    testFunction(
      "Init test logger with INFO level configuration to use see debug with deDEBUG",
      table,
      // calling a DEBUG message will not yield a normal debug message
      // it will yield a deDEBUG message only in the 'test' logger
      l.debug("debug"),
      logString("debug", "NOTSET", "test"),
    );
    // create 'test' logger with DEBUG level
    l = new Log(
      "test",
      // set level to DEBUG and color to false
      new FlagConfig({
        flags: { logConsoleLevel: "DEBUG", logConsoleColor: false },
      })
        .log,
    );
    testFunction(
      "Init test logger with DEBUG level configuration to ensure there is no color",
      table,
      // calling a DEBUG message will not yield a normal debug message
      // it will yield a deDEBUG message only in the 'test' logger
      [
        l.success("success"),
        l.error("error"),
        l.warn("warn"),
        l.info("info"),
        ...l.debug("debug"), // test logger will return list here
      ],
      [
        logString("success", "CRITICAL", "test", false),
        logString("error", "ERROR", "test", false),
        logString("warn", "WARNING", "test", false),
        logString("info", "INFO", "test", false),
        logString("debug", "DEBUG", "test", false),
        logString("debug", "NOTSET", "test", false),
      ],
    );
    // create 'test' logger with DEBUG level
    l = new Log(
      "test",
      // set level to DEBUG and format to json
      new FlagConfig({
        flags: {
          logConsoleLevel: "DEBUG",
          logConsoleFormat: "json",
          logConsoleDate: false,
        },
      }).log,
    );
    await testFunction(
      "Init test logger with json format",
      table,
      [
        l.success("success"),
        l.error("error"),
        l.warn("warn"),
        l.info("info"),
        ...l.debug("debug"), // test logger will return list here
      ],
      [
        JSON.stringify(
          {
            logger: "test",
            // date: new Date(),
            level: "DEBUG",
            msg: logString("success", "CRITICAL", "test", false),
          },
          null,
          2,
        ),
        JSON.stringify(
          {
            logger: "test",
            // date: new Date(),
            level: "DEBUG",
            msg: logString("error", "ERROR", "test", false),
          },
          null,
          2,
        ),
        JSON.stringify(
          {
            logger: "test",
            // date: new Date(),
            level: "DEBUG",
            msg: logString("warn", "WARNING", "test", false),
          },
          null,
          2,
        ),
        JSON.stringify(
          {
            logger: "test",
            // date: new Date(),
            level: "DEBUG",
            msg: logString("info", "INFO", "test", false),
          },
          null,
          2,
        ),
        JSON.stringify(
          {
            logger: "test",
            // date: new Date(),
            level: "DEBUG",
            msg: logString("debug", "DEBUG", "test", false),
          },
          null,
          2,
        ),
        JSON.stringify(
          {
            logger: "test",
            // date: new Date(),
            level: "DEBUG",
            msg: logString("debug", "NOTSET", "test", false),
          },
          null,
          2,
        ),
      ],
    );
    l = await new Log(
      "test",
      // set file level to DEBUG and format to json
      new FlagConfig({
        flags: {
          logFileLevel: "DEBUG",
          logFilePath: ".",
          logFileDate: false,
          logFileEnabled: true,
        },
      }).log,
    ).init();
    await testFunctionAsync(
      "Init test logger with json file format",
      table,
      async () => {
        const a = [
          l.success("success"),
          l.error("error"),
          l.warn("warn"),
          l.info("info"),
          ...l.debug("debug"), // test logger will return list here
        ];
        l.flush();
        await l.destroy();
        return await Deno.readTextFile(resolve(Deno.cwd() + "/trailmix.json"));
      },
      '{\n  "logger": "test",\n  "level": "DEBUG",\n  "msg": "[test] success"\n}\n{\n  "logger": "test",\n  "level": "DEBUG",\n  "msg": "[test] error"\n}\n{\n  "logger": "test",\n  "level": "DEBUG",\n  "msg": "[test] warn"\n}\n{\n  "logger": "test",\n  "level": "DEBUG",\n  "msg": "[test] info"\n}\n{\n  "logger": "test",\n  "level": "DEBUG",\n  "msg": "[test] debug"\n}\n{\n  "logger": "test",\n  "level": "DEBUG",\n  "msg": "[test] deDEBUG:debug"\n}\n',
    );
    table = renderTable(table);
  },
});
/**
 * Logger Tests
 * For each LogLevel, for each Logger, with or without Args
 */
Deno.test({
  name: `Log.ts - Logger Test`,
  fn: async () => {
    for await (const logger of loggerNames.concat("trailmix")) {
      for await (const level of logLevels) {
        for await (const arg of ["string", undefined]) {
          const l: Log = await new Log(
            logger,
            new FlagConfig({
              flags: {
                logConsoleLevel: level,
                logFilePath: ".",
                logFileLevel: level,
              },
            }).log,
          ).init();
          testFunction(
            `testing:${logger}${level}${arg}`,
            table,
            l.pConfig.console.level,
            level,
          );
          testLoggerLevels(
            table,
            logger,
            level as LogLevel,
            true,
            l,
            level,
            arg,
          );
          await l.destroy();
        }
      }
    }
    table = renderTable(table);
  },
});

/**
 * Message Tests
 * For each LogLevel, for each primitive type, with or without Args
 * // uses test logger to see deDEBUG messages
 */
Deno.test({
  name: `Log.ts Message Test`,
  fn: async () => {
    for await (const level of logLevels) {
      for await (const primitive of Object.entries(messages)) {
        for await (const arg of args) {
          for await (const value of primitive[1]) {
            const l: Log = await new Log(
              "test",
              new FlagConfig({
                flags: {
                  logConsoleLevel: level,
                  logFilePath: ".",
                  logFileLevel: level,
                },
              }).log,
            ).init();
            testFunction(
              level,
              table,
              l.pConfig.console.level,
              level,
            );
            testLoggerLevels(
              table,
              "test",
              level as LogLevel,
              true,
              l,
              value,
              arg,
            );
            await l.destroy();
            // since there are a lot of tests here render table recursively
            table = renderTable(table, false);
          }
        }
      }
    }
    renderTable(table, true);
  },
});
