// import { Config } from '/config/mod.ts';
// import { Log, logLevels, loggerNames, stringifyBigInt } from '/log/mod.ts';
// import type { LogLevel, LogConfigMap } from '/log/mod.ts';

// // import { Table, Row, Cell, getLevelByName, assertNotEquals, assertStrictEquals } from '/deps.ts';

// import { logString, strings, colorLog } from 'test/utils/mod.ts';

// let testCases: string[] = [];
// const ogConsole = console.log;

// let table = resetTable();
// function resetTable(table?: []): Table {
//   return new Table().header(Row.from(['Log.ts'])).body([new Row('test', 'test', 'test')]);
//   // .maxColWidth(100)
//   // .border(true)
//   // .padding(1)
//   // .indent(2);
// }
// /**
//  * test logger based on logger name and level
//  * then test messages to ensure that
//  * messages counts are correct per level
//  * @param logger logger name string
//  * @param level LogLevel object
//  * @param l Log object
//  */
// // eslint-disable-next-line max-params
// function testLoggerLevels(
//   logger = 'default',
//   level: LogLevel = 'ERROR',
//   colorMsg = true,
//   l: Log,
//   msg: unknown,
//   ...args: unknown[]
// ) {
//   let levelNum = getLevelByName(level);
//   let actual = 0;
//   let message: string =
//     typeof msg === 'string'
//       ? msg
//       : msg instanceof Error
//       ? msg.stack!
//       : typeof msg === 'object'
//       ? JSON.stringify(msg, stringifyBigInt)
//       : String(msg);
//   // ogConsole(messages);
//   if (logger === 'test') {
//     testCases = [logString(message, 'NOTSET', logger, colorMsg, ...args)];
//     actual++;
//   }
//   if (levelNum <= 10) {
//     testCases.push(logString(message, 'DEBUG', logger, colorMsg, ...args));
//     l.debug(msg, ...args);
//     actual++;
//   }
//   if (levelNum <= 20) {
//     testCases = [logString(message, 'INFO', logger, colorMsg, ...args)];
//     l.info(msg, ...args);
//     actual++;
//   }
//   if (levelNum <= 30) {
//     testCases = [logString(message, 'WARNING', logger, colorMsg, ...args)];
//     l.warn(msg, ...args);
//     actual++;
//   }
//   if (levelNum <= 40) {
//     testCases = [logString(message, 'ERROR', logger, colorMsg, ...args)];
//     l.error(msg, ...args);
//     actual++;
//   }
//   if (levelNum <= 50) {
//     testCases = [logString(message, 'CRITICAL', logger, colorMsg, ...args)];
//     l.success(msg, ...args);
//     actual++;
//   }
//   // divide level by 10
//   let expected = levelNum / 10;
//   // subtract max(50/10)+1 from sum
//   expected = 6 - expected;
//   // add 1 if 'test' to sum for deDEBUG messages
//   expected += logger === 'test' ? 1 : 0;
//   // subtract 1 from sum if NOTSET, default is INFO
//   expected -= levelNum === 0 ? 1 : 0;
//   assertStrictEquals(actual, expected, `Message count failure:\t ${actual} !== ${expected}`);
// }
// /**
//  * this function is meant to be used to override
//  * console.log() so you can ensure it is messaging
//  * the console correctly with custom colored strings
//  * or bold for example
//  * @param data string array of console.log messages
//  */
// function consoleMock(...data: string[]) {
//   // const expected = testCases[testCases.length - 1];
//   // ogConsole(data);
//   // ogConsole(testCases[testCases.length - 1]);
//   // ogConsole(testCases);
//   const expected = Array.isArray(testCases) ? testCases.filter((test) => test === data.join(''))[0] : testCases;
//   assertNotEquals(expected, '', `Did not find matching string in [testCases]\n ${JSON.stringify(testCases)}`);
//   const actual = data.join('');
//   // table.push([Cell.from(actual), Cell.from('==='), Cell.from(expected)]);
//   // ogConsole(`\n${ && table.render()}`);
//   assertStrictEquals(
//     actual,
//     expected,
//     `console.log() messages failure: (actual !== expected)\n "${actual}" !== "${expected}"`,
//   );
//   table.push([actual, '===', expected]);
// }

// const messages = {
//   string: ['string', `${Deno.env.get('HOME')}`, Object.keys(Deno)[0]],
//   numbers: [
//     1,
//     Number.MAX_SAFE_INTEGER, // max number
//     9007199254740999007199254740990n, // bigint
//   ],
//   boolean: [true, false],
//   undefined: [undefined],
//   null: [null],
//   object: [
//     new RangeError('Uh-oh!'),
//     {
//       test1: 'test',
//     },
//     {
//       test2: ['a', true, 3],
//     },
//     {
//       test3: { testInner: 'test' },
//     },
//     Deno.version,
//     {
//       deno: { ...Deno.version, ...Deno.build },
//     },
//     {
//       deno: [Deno.version, Deno.build],
//     },
//     {
//       deno: {
//         version: Deno.version,
//         build: Deno.build,
//       },
//     },
//   ],
// };
// const args = [
//   ...messages.string,
//   ...messages.numbers,
//   ...messages.boolean,
//   ...messages.undefined,
//   ...messages.null,
//   ...messages.object,
//   messages.string,
//   messages.numbers,
//   messages.boolean,
//   messages.undefined,
//   messages.null,
//   messages.object,
//   [messages.string, messages.numbers, messages.boolean, messages.undefined, messages.null, messages.object],
// ];
// /**
//  * Functional tests
//  */
// console.log = consoleMock;
// Deno.test({
//   name: `Log.ts - Init default logger w/o configuration\n`,
//   fn: async () => {
//     // create default logger with default ERROR level
//     const l: Log = new Log();
//     // CRITICAL is used for success messages
//     testCases = [logString('success', 'CRITICAL'), logString('error', 'ERROR')];
//     l.success('success');
//     l.error('error');
//   },
// });
// Deno.test({
//   name: `Log.ts - Init default logger with level configuration\n`,
//   fn: async () => {
//     // set level to WARNING
//     let log: LogConfigMap = new Config({
//       consoleLevel: 'WARNING',
//     }).log;
//     // create 'default' logger with WARNING level
//     const l: Log = new Log('default', log);
//     testCases = [logString('success', 'CRITICAL'), logString('error', 'ERROR'), logString('warn', 'WARNING')];
//     l.success('success');
//     l.error('error');
//     l.warn('warn');
//   },
// });
// Deno.test({
//   name: `Log.ts - Init test logger with INFO level configuration to use see debug with deDEBUG\n`,
//   fn: async () => {
//     // set level to INFO
//     let log: LogConfigMap = new Config({
//       consoleLevel: 'INFO',
//     }).log;
//     // create 'test' logger with INFO level
//     const l: Log = new Log('test', log);
//     testCases = [logString('debug', 'NOTSET', 'test')];
//     // calling a DEBUG message will not yield a normal debug message
//     // it will yield a deDEBUG message only in the 'test' logger
//     l.debug('debug');
//   },
// });
// Deno.test({
//   name: `Log.ts - Init test logger with DEBUG level configuration to ensure there is no color\n`,
//   fn: async () => {
//     // set level to DEBUG and color to false
//     let log: LogConfigMap = new Config({
//       consoleLevel: 'DEBUG',
//       consoleColor: false,
//     }).log;
//     // create 'test' logger with DEBUG level
//     const l: Log = new Log('test', log);
//     testCases = [
//       logString('debug', 'NOTSET', 'test', false),
//       logString('debug', 'DEBUG', 'test', false),
//       logString('info', 'INFO', 'test', false),
//       logString('warn', 'WARNING', 'test', false),
//       logString('error', 'ERROR', 'test', false),
//       logString('success', 'CRITICAL', 'test', false),
//     ];
//     // calling a DEBUG message will not yield a normal debug message
//     // it will yield a deDEBUG message only in the 'test' logger
//     l.success('success');
//     l.error('error');
//     l.warn('warn');
//     l.info('info');
//     l.debug('debug');
//   },
// });
// Deno.test({
//   name: `Log.ts - Init test logger with json format \n`,
//   only: true,
//   fn: async () => {
//     // set level to DEBUG and color to false
//     let log: LogConfigMap = new Config({
//       consoleLevel: 'DEBUG',
//       consoleFormat: 'json',
//     }).log;
//     // create 'test' logger with DEBUG level
//     const l: Log = new Log('test', log);
//     ogConsole(log);
//     ogConsole(l);
//     testCases = [
//       logString('debug', 'NOTSET', 'test'),
//       logString('debug', 'DEBUG', 'test'),
//       logString('info', 'INFO', 'test'),
//       logString('warn', 'WARNING', 'test'),
//       logString('error', 'ERROR', 'test'),
//       logString('success', 'CRITICAL', 'test'),
//     ];
//     // calling a DEBUG message will not yield a normal debug message
//     // it will yield a deDEBUG message only in the 'test' logger
//     l.success('success');
//     l.error('error');
//     l.warn('warn');
//     l.info('info');
//     l.debug('debug');
//   },
// });
// /**
//  * Logger Tests
//  * For each LogLevel, for each Logger, with or without Args
//  */
// for await (const logger of loggerNames.concat('trailmix')) {
//   // table = resetTable([Cell.from(logger).colSpan(3)]);
//   for await (const level of logLevels) {
//     // table.push([Cell.from(level).border(true).colSpan(3)]);
//     for await (const arg of [undefined]) {
//       table.push([
//         Cell.from(arg ?? 'undefined')
//           .border(true)
//           .colSpan(3),
//       ]);
//       Deno.test({
//         only: true,
//         sanitizeResources: false,
//         sanitizeExit: false,
//         sanitizeOps: false,
//         name: 'Log.ts',
//         // name: `Log.ts Logger test for \x1b[47m\x1b[30m${logger}${strings.ansi_reset} at level \x1b[${colorLog(
//         //   level as LogLevel,
//         //   logger,
//         // )}m${level}${strings.color_suffix}${
//         //   arg !== undefined ? ' with args ' + JSON.stringify(arg, stringifyBigInt) : ''
//         // }\n`,
//         async fn() {
//           console.log = consoleMock;
//           const log: LogConfigMap = new Config({
//             consoleLevel: level,
//             logPath: '.',
//             logLevel: level,
//           }).log;
//           assertStrictEquals(level, log.console.level, `Config logLevel not set: ${level} !== ${log.console.level}`);
//           const l: Log = await new Log(logger, log).init();
//           assertStrictEquals(
//             level,
//             l.pConfig.console.level,
//             `Log logLevel not set: ${level} !== ${l.pConfig.console.level}`,
//           );
//           testLoggerLevels(logger, level as LogLevel, true, l, level, arg);
//           testCases = [];
//         },
//       });
//     }
//     // ogConsole(table.render());
//     // table = resetTable(table);
//   }
// }
// /**
//  * Message Tests
//  * For each LogLevel, for each primitive type, with or without Args
//  * // uses test logger to see deDEBUG messages
//  */
// for await (const level of logLevels) {
//   for await (const primitive of Object.entries(messages)) {
//     for await (const arg of args) {
//       for await (const value of primitive[1]) {
//         Deno.test({
//           sanitizeResources: false,
//           sanitizeExit: false,
//           sanitizeOps: false,
//           name: `Log.ts Message test primitive:value \x1b[47m\x1b[30m${primitive[0]}:${value}${
//             strings.ansi_reset
//           } at level \x1b[${colorLog(level as LogLevel, 'default')}m${level}${strings.color_suffix}${
//             arg !== undefined ? ' with args ' + JSON.stringify(arg, stringifyBigInt) : ''
//           }\n`,
//           async fn() {
//             console.log = consoleMock;
//             const log: LogConfigMap = new Config({
//               consoleLevel: level,
//               logPath: '.',
//               logLevel: level,
//             }).log;
//             assertStrictEquals(level, log.console.level, `Config logLevel not set: ${level} !== ${log.console.level}`);
//             const l: Log = await new Log('test', log).init();
//             assertStrictEquals(
//               level,
//               l.pConfig.console.level,
//               `Log logLevel not set: ${level} !== ${l.pConfig.console.level}`,
//             );
//             testLoggerLevels('test', level as LogLevel, true, l, value, arg);
//             testCases = [];
//           },
//         });
//       }
//     }
//   }
// }
