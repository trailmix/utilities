// import {} from 'trailmix/config/mod.ts';
// // import { Table, Row, Cell, assertStrictEquals, assertNotEquals } from 'trailmix/deps.ts';

// let testCases: string[] = [];
// let testName: string;
// const ogConsole = console.log;
// let table = resetTable();
// function resetTable(table?: []): Table {
//   return (
//     new Table()
//       .body(table ?? [])
//       // .maxColWidth(100)
//       .border(true)
//       .padding(1)
//       .indent(2)
//   );
// }
// function consoleMock(...data: string[]) {
//   const expected = Array.isArray(testCases) ? testCases.filter((test) => test === data.join(''))[0] : testCases;
//   const actual = data.join('');
//   try {
//     assertNotEquals(expected, '', `Did not find matching string in [testCases]\n ${JSON.stringify(testCases)}`);
//     assertStrictEquals(
//       actual,
//       expected,
//       `console.log() messages failure: (actual !== expected)\n "${actual}" !== "${expected}"`,
//     );
//     if (typeof JSON.parse(actual) !== 'object')
//       assertStrictEquals(
//         JSON.parse(actual),
//         JSON.parse(expected),
//         `console.log() JSON.parse() messages failure: (actual !== expected)\n "${actual}" !== "${expected}"`,
//       );
//     table.push(
//       Row.from([
//         Cell.from('🧪🧪🧪🧪\t\x1b[1m\x1b[92m\x1b[4m' + testName.trim() + '\x1b[24m\x1b[39m\x1b[22m\n').colSpan(3),
//       ]).border(false),
//       [actual, '===', expected],
//     );
//     if (typeof JSON.parse(actual) !== 'object') table.push([JSON.parse(actual), '===', JSON.parse(expected)]);
//   } catch (e) {
//     table.push(
//       Row.from([
//         Cell.from('🚨🚨🚨🚨\t\x1b[1m\x1b[91m\x1b[4m' + testName.trim() + '\x1b[24m\x1b[39m\x1b[22m' + e + '\n').colSpan(
//           3,
//         ),
//       ]).border(false),
//       [actual, '!==', expected],
//       [JSON.parse(actual ?? []), '!==', JSON.parse(expected ?? [])],
//     );
//   }
// }

// const tests = {};

// Deno.test({
//   name: `Color.ts`,
//   fn: () => {
//     ogConsole('hellow');
//   },
// });
