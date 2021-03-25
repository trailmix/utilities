import type { LogLevel } from "trailmix/log/mod.ts";
import { stringifyBigInt } from "trailmix/log/mod.ts";

export enum strings {
  ansi_reset = "\x1b[0m",
  bold_prefix = "\x1b[1m",
  bold_suffix = "\x1b[22m",
  underline_prefix = "\x1b[4m",
  underline_suffix = "\x1b[24m",
  color_suffix = "\x1b[39m",
}
export enum colors {
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
export function logString(
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
  // console.log(JSON.stringify(args, null, 2));
  if (args !== null && args !== undefined && args.toString() !== "") {
    // console.log('inside args');
    // msg = msg + ' \nArguments:\t' + JSON.stringify(JSON.parse(JSON.stringify(args, stringifyBigInt))[0], null, 2);
    msg = msg + " \nArguments:" + JSON.stringify(args[0], stringifyBigInt, 2);
  }
  // console.log(msg);
  return msg;
}
// eslint-disable-next-line max-params
export function color(
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
export function colorLog(
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
// export function successConsoleMock(...data: string[]) {
//   asserts.assertStrictEquals(data.join(' '), consoleMock(...data));
// }
// export function failureConsoleMock(...data: string[]) {
//   // ogConsole(...data);
//   asserts.assertStrictEquals(data.join(' '), 'NOTa');
// }
// export function consoleMock(...data: string[]) {
//   let value = Array.isArray(testCases) ? testCases.filter((test) => test === data.join(' ')).toString() : testCases;
//   // console.log(`\nogConsole.data ${data}\t===\togConsole.value ${value}`);
//   return value;
// }
