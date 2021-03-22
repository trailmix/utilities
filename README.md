# utilities

Repository of common utilities in TS.  
[![art djkittyplayz][art]](http://djkittyplayz.art/)
[![codecov][codecov]](https://app.codecov.io/gh/trailmix/utilities)
![downloads][downloads]
[![goofus_colors goofus colors trailmix deno typescript](https://trailmix-images.s3.amazonaws.com/gooface/gooface_colorsB.jpg)](http://djkittyplayz.art/)

## Usage

### Simple

```typescript
// import fns and style helpers
import {
  messageByFnSpread,
  messageByString,
  messageByStringSpread,
  messageByFn,
  randomStyleFn,
  randomStyleString,
  styles as s,
} from 'https://deno.land/x/trailmix@1.0.1/mod.ts';

// random StyleFn Message Functions
console.log(messageByFn('hello', [s.cyan, s.bgRed])); // cyan text, red BG
console.log(messageByFnSpread('test', s.yellow, s.bgRed)); // yellow text, red BG
// random Style Functions
console.log(randomStyleFn('emphasis')); // get a random emphasis typeof StyleFn {(str:string) => string}
console.log(randomStyleString('color')); // get a random color string typeof Style
// random StyleString Message Functions
console.log(messageByString('hello', [randomStyleString('color')])); // random text color
console.log(messageByStringSpread('hello', randomStyleString('bgColor'))); // random background color
console.log(messageByFnSpread('hello', s[randomStyleString('emphasis')]));
```

### Complex

```typescript
// import the class and style helpers
import { Color as C, styles as s } from 'https://deno.land/x/trailmix@1.0.1/mod.ts';
import type { Styles } from 'https://deno.land/x/trailmix@1.0.1/mod.ts';

// you can use defined or anon functions
function test(str: string) {
  return str + 'defined function';
}
const byFnConfAlpha = [
  C.randomStyleFn(), // randoms return a random text color by default
  test,
  C.randomStyleFn('bgColor'),
  (str: string) => {
    // anon functions can be used
    return str + C.random('anon function', { emphasis: true });
  },
];
const rConf = { color: true, bgColor: true, emphasis: false };
const byFnConfBeta = [
  C.stylesMap.color.brightBlue, // stylesMap is ordered by color|bgColor|emphasis
  (str: string) => {
    return str + 'anon function';
  },
  C.stylesMap.color.yellow,
  C.stylesMap.bgColor.bgBrightCyan,
  test,
  C.stylesMap.emphasis.strikethrough,
  C.styles.dim, // styles is all in a map
  C.stylesMap.bgColor.bgBrightYellow,
  test,
  (str: string) => {
    return 'anon function' + str;
  },
  C.styles.bgBrightYellow,
];
const _sList: Styles[] = ['cyan', 'bgMagenta', 'underline']; // list of Style strings
console.log(C.messageByFnSpread('test', ...byFnConfAlpha)); // spread StyleFns
console.log(C.messageByFnSpread('test', ...byFnConfBeta));
console.log(C.messageByString('this is not a spring spread', ['cyan', 'bgMagenta', 'underline'])); // no spread
console.log(C.messageByStringSpread('a spring spread', 'green', 'bgBlack', 'strikethrough')); // spreading Style strings
console.log(C.messageByStringSpread('a spring spread again with a var', ..._sList));
console.log(C.random('test some string', rConf)); // random function
```

## [CONTRIBUTE](CONTRIBUTE.md)

[art]: https://img.shields.io/badge/art-djkittyplayz-yellow
[codecov]: https://img.shields.io/codecov/c/github/trailmix/utilities
[downloads]: https://img.shields.io/github/downloads/trailmix/utilities/total
