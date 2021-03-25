<h1 align="center">trailmix/utilities</h1>

<h3 align="center">Repository of utilities for deno written in typescript for trailmix🌤🦕🍣😼</h3>
<p align="center">
  <a href="https://deno.land">
    <img src="https://img.shields.io/badge/Deno-1.8.1-brightgreen.svg?logo=deno" alt="deno" />
  </a>
  <a href="https://github.com/trailmix/utilities">
    <img src="https://img.shields.io/badge/utilities-vNEXT-green.svg" alt="trailmix utilities" />
  </a>
  <a href="http://djkittyplayz.art/">
    <img src="https://img.shields.io/badge/art-djkittyplayz-yellow" alt="art djkittyplayz" />
  </a>
  <a href="https://deno.land/x/trailmix">
    <img src="https://img.shields.io/github/downloads/trailmix/utilities/total" alt="downloads" />
  </a>
  <a href="https://github.com/trailmix/utilities/actions">
    <img src="https://github.com/trailmix/utilities/workflows/ci/badge.svg?branch=next" alt="ci" />
  </a>
</p>
<a href="https://deno.land/x/trailmix">
  <img
    src="https://trailmix-images.s3.amazonaws.com/gooface/gooface-color.png"
    alt="goofus_colors goofus colors trailmix deno typescript"
  />
</a>
<p align="center">
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
</p>
<p align="center">
  <a href="https://app.codecov.io/gh/trailmix/utilities" align="left">
    <img src="https://codecov.io/gh/trailmix/utilities/branch/master/graphs/tree.svg" alt="codecov master" />
  </a>
  <a href="https://app.codecov.io/gh/trailmix/utilities/branch/next" align="right">
    <img src="https://codecov.io/gh/trailmix/utilities/branch/next/graphs/tree.svg" alt="codecov next" />
  </a>
</p>

## Usage

### Simple

```typescript
// import fns and style helpers
import {
  messageByFnSpread,
  messageByString,
  messageByStringSpread,
  messageByFn,
  randomOpts,
  randomStyleFn,
  randomStyleString,
  random,
  styles as s,
} from 'https://deno.land/x/trailmix@1.0.3/mod.ts';

// random StyleFn Message Functions
console.log(messageByFn('hello', [s.cyan, s.bgRed])); // cyan text, red BG
console.log(messageByFnSpread('test', s.yellow, s.bgRed)); // yellow text, red BG
// random Style Functions
console.log(randomStyleFn('emphasis')); // get a random emphasis typeof StyleFn {(str:string) => string}
console.log(randomStyleString('color')); // get a random color string typeof Style
// random StyleString Message Functions
console.log(messageByString('hello', [randomStyleString('color')])); // random text color
console.log(messageByStringSpread('hello', randomStyleString('bgColor'))); // random background color
console.log(messageByFnSpread('hello', s[randomStyleString('emphasis')])); // call style list with random style fn
console.log(random('hello')); // get random style on this string (50% chance of color/bg/emphasis)
console.log(random('hello', { color: true })); // get random color on this string
console.log(random('hello', randomOpts({ color: true }))); // get random color 100%, (50% chance for others)
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
