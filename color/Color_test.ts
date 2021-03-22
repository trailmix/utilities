import {
  default as Color,
  messageByFn,
  messageByFnSpread,
  messageByString,
  messageByStringSpread,
  random,
  randomStyleFn,
  randomStyleString,
  stylesMap,
} from './Color.ts';
import { styleEnum } from './enum.ts';
import type { Styles, StyleFn } from './Color.d.ts';
import { assertStrictEquals, assertNotEquals } from 'testing/asserts.ts';
import { Table, Row, Cell } from 'cliffy/table';

let testCases: string[] = [];
let testName: string;
const ogConsole = console.log;
let table = resetTable();
function resetTable(table?: []): Table {
  return (
    new Table()
      .body(table ?? [])
      // .maxColWidth(100)
      .border(true)
      .padding(1)
      .indent(2)
  );
}
function consoleMock(...data: string[]) {
  const expected = Array.isArray(testCases) ? testCases.filter((test) => test === data.join(''))[0] : testCases;
  const actual = data.join('');
  try {
    assertNotEquals(expected, '', `Did not find matching string in [testCases]\n ${JSON.stringify(testCases)}`);
    assertStrictEquals(
      actual,
      expected,
      `console.log() messages failure: (actual !== expected)\n "${actual}" !== "${expected}"`,
    );
    assertStrictEquals(
      JSON.parse(actual),
      JSON.parse(expected),
      `console.log() JSON.parse() messages failure: (actual !== expected)\n "${actual}" !== "${expected}"`,
    );
    table.push(
      Row.from([
        Cell.from('🧪🧪🧪🧪\t\x1b[1m\x1b[92m\x1b[4m' + testName.trim() + '\x1b[24m\x1b[39m\x1b[22m\n').colSpan(3),
      ]).border(false),
      [actual, '===', expected],
      [JSON.parse(actual), '===', JSON.parse(expected)],
    );
  } catch (e) {
    table.push(
      Row.from([
        Cell.from('🚨🚨🚨🚨\t\x1b[1m\x1b[91m\x1b[4m' + testName.trim() + '\x1b[24m\x1b[39m\x1b[22m\n').colSpan(3),
      ]).border(false),
      [actual, '!==', expected],
      [JSON.parse(actual ?? []), '!==', JSON.parse(expected ?? [])],
    );
  }
}

const tests = {
  string: {
    random: {
      color: {
        color: false,
      },
      bgColor: {
        bgColor: false,
      },
      emphasis: {
        emphasis: false,
      },
    },
    randomStyleFn: { ...Object.keys(styleEnum).filter((key) => key !== 'suffix') },
    randomStyleString: { ...Object.keys(styleEnum).filter((key) => key !== 'suffix') },
  },
  stringEmpty: {
    random: {
      color: {},
    },
    messageByFn: {
      fixed: [],
    },
    messageByString: {
      fixed: [],
    },
  },
  stringUndefined: {
    random: {
      color: {
        color: undefined,
      },
      bgColor: {
        bgColor: undefined,
      },
      emphasis: {
        emphasis: undefined,
      },
    },
    messageByFn: {
      fixed: [undefined],
      fixedU: [stylesMap.color.red, undefined],
    },
    messageByString: {
      fixedU: ['red', undefined],
      fixed: [undefined],
    },
  },
  stringColor: {
    random: {
      color: {
        color: true,
      },
    },
    messageByFn: {
      fixed: [stylesMap.color.green],
      fixedU: [stylesMap.color.red, undefined],
      random: [randomStyleFn('color')],
      randomU: [randomStyleFn('color'), undefined],
    },
    messageByString: {
      fixed: ['green'],
      fixedU: ['red', undefined],
      random: [randomStyleString('color')],
      randomU: [randomStyleString('color'), undefined],
    },
  },
  stringBgColor: {
    random: {
      color: {
        bgColor: true,
      },
    },
    messageByFn: {
      fixed: [stylesMap.bgColor.bgBrightRed],
      random: [randomStyleFn('bgColor')],
    },
    messageByString: {
      fixed: ['bgBrightRed'],
      random: [randomStyleString('bgColor')],
    },
  },
  stringEmphasis: {
    random: {
      color: {
        emphasis: true,
      },
    },
    messageByFn: {
      fixed: [stylesMap.emphasis.bold],
      random: [randomStyleFn('emphasis')],
    },
    messageByString: {
      fixed: ['bold'],
      random: [randomStyleString('emphasis')],
    },
  },
  stringColorBgColor: {
    random: {
      color: {
        color: true,
        bgColor: true,
      },
    },
    messageByFn: {
      fixed: [stylesMap.color.green, stylesMap.bgColor.bgBrightRed],
      random: [randomStyleFn('color'), randomStyleFn('bgColor')],
    },
    messageByString: {
      fixed: ['green', 'bgBrightRed'],
      random: [randomStyleString('color'), randomStyleString('bgColor')],
    },
  },
  stringColorBgColorEmphasis: {
    random: {
      color: {
        color: true,
        bgColor: true,
        emphasis: true,
      },
    },
    messageByFn: {
      fixed: [stylesMap.color.green, stylesMap.bgColor.bgBrightRed, stylesMap.emphasis.bold],
      random: [randomStyleFn('color'), randomStyleFn('bgColor'), randomStyleFn('emphasis')],
    },
    messageByString: {
      fixed: ['green', 'bgBrightRed', 'bold'],
      random: [randomStyleString('color'), randomStyleString('bgColor'), randomStyleString('emphasis')],
    },
  },
  stringBgColorEmphasis: {
    random: {
      color: {
        bgColor: true,
        emphasis: true,
      },
    },
    messageByFn: {
      fixed: [stylesMap.bgColor.bgBrightRed, stylesMap.emphasis.bold],
      random: [randomStyleFn('bgColor'), randomStyleFn('emphasis')],
    },
    messageByString: {
      fixed: ['bgBrightRed', 'bold'],
      random: [randomStyleString('bgColor'), randomStyleString('emphasis')],
    },
  },
  stringColorEmphasis: {
    random: {
      color: {
        color: true,
        emphasis: true,
      },
    },
    messageByFn: {
      fixed: [stylesMap.color.green, stylesMap.emphasis.bold],
      random: [randomStyleFn('color'), randomStyleFn('emphasis')],
    },
    messageByString: {
      fixed: ['green', 'bold'],
      random: [randomStyleString('color'), randomStyleString('emphasis')],
    },
  },
};

for (const style of Object.keys(stylesMap)) {
  // @ts-ignore
  for (const fn of Object.keys(stylesMap[style])) {
    Deno.test({
      name: `Color.ts`,
      fn: () => {
        testName = `style:${style}, test:${fn}`;
        // @ts-ignore
        const args = stylesMap[style][fn];
        let msg = '';
        msg = JSON.stringify(args(style));
        console.log = consoleMock;
        testCases = [msg];
        console.log(msg);
        console.log = ogConsole;
        if (
          Object.keys(stylesMap).length - 1 === Object.keys(stylesMap).indexOf(style) &&
          // @ts-ignore
          Object.keys(stylesMap[style]).length - 1 === Object.keys(stylesMap[style]).indexOf(fn)
        ) {
          table.render();
          table = resetTable();
        }
      },
    });
  }
}
for (const test of Object.keys(tests)) {
  // @ts-ignore
  for (const fn of Object.keys(tests[test])) {
    for (const obj of [true, false]) {
      // @ts-ignore
      for (const stylefn of Object.keys(tests[test][fn])) {
        for (const spread of [true, false]) {
          Deno.test({
            name: `Color.ts`,
            fn: () => {
              testName = `${test}, fn:${fn}, styleFn:${stylefn}, spread:${spread}, fromObj:${obj}\n`;
              // @ts-ignore
              const args = tests[test][fn][stylefn];
              let TmessageByStringSpread = messageByStringSpread;
              let TmessageByString = messageByString;
              let TmessageByFnSpread = messageByFnSpread;
              let TmessageByFn = messageByFn;
              let TrandomStyleFn = randomStyleFn;
              let TrandomStyleString = randomStyleString;
              let Trandom = random;
              if (obj) {
                TmessageByStringSpread = Color.messageByStringSpread;
                TmessageByString = Color.messageByString;
                TmessageByFnSpread = Color.messageByFnSpread;
                TmessageByFn = Color.messageByFn;
                TrandomStyleFn = Color.randomStyleFn;
                TrandomStyleString = Color.randomStyleString;
                Trandom = Color.random;
              }
              let msg = '';
              if (fn === 'messageByString') {
                if (spread) msg = JSON.stringify(TmessageByStringSpread(test, ...(args as Styles[])));
                else msg = JSON.stringify(TmessageByString(test, args as Styles[]));
              }
              if (fn === 'messageByFn') {
                if (spread) msg = JSON.stringify(TmessageByFnSpread(test, ...(args as StyleFn[])));
                else msg = JSON.stringify(TmessageByFn(test, args as StyleFn[]));
              }
              if (fn === 'randomStyleFn') msg = JSON.stringify(TrandomStyleFn(args)(test));
              if (fn === 'randomStyleString') msg = JSON.stringify(TrandomStyleString(args));
              if (fn === 'random') msg = JSON.stringify(Trandom(test, args));
              console.log = consoleMock;
              testCases = [msg];
              console.log(msg);
              console.log = ogConsole;
              if (
                Object.keys(tests).length - 1 === Object.keys(tests).indexOf(test) &&
                // @ts-ignore
                Object.keys(tests[test]).length - 1 === Object.keys(tests[test]).indexOf(fn) &&
                // @ts-ignore
                Object.keys(tests[test][fn]).length - 1 === Object.keys(tests[test][fn]).indexOf(stylefn) &&
                !spread
              ) {
                table.render();
                table = resetTable();
              }
            },
          });
        }
      }
    }
  }
}
