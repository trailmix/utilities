/**
 * Each enum represents name of function in https://deno.land/std/fmt/colors.ts
 * mapped to the prefix ANSI number for the color/bgColor/emphasis
 *
 * NOTE: Suffix isn't mapped to any functions and can be used to testing
 */
export enum EnumColor {
  black = 30,
  red = 31,
  green = 32,
  yellow = 33,
  blue = 34,
  magenta = 35,
  cyan = 36,
  white = 37,
  gray = 90,
  brightBlack = 90,
  brightRed = 91,
  brightGreen = 92,
  brightYellow = 93,
  brightBlue = 94,
  brightMagenta = 95,
  brightCyan = 96,
  brightWhite = 97,
  clear = 0,
}
export enum EnumBgColor {
  bgBlack = 40,
  bgRed = 41,
  bgGreen = 42,
  bgYellow = 43,
  bgBlue = 44,
  bgMagenta = 45,
  bgCyan = 46,
  bgWhite = 47,
  bgBrightBlack = 100,
  bgBrightRed = 101,
  bgBrightGreen = 102,
  bgBrightYellow = 103,
  bgBrightBlue = 104,
  bgBrightMagenta = 105,
  bgBrightCyan = 106,
  bgBrightWhite = 107,
}
export enum EnumEmphasis {
  bold = 1,
  italic = 2,
  dim = 3,
  underline = 4,
  inverse = 7,
  hidden = 8,
  strikethrough = 9,
  clear = 0,
}
export enum EnumSuffix {
  bold = 22,
  italic = 22,
  dim = 23,
  underline = 24,
  inverse = 27,
  hidden = 28,
  strikethrough = 29,
  clear = 0,
  color = 39,
  bgColor = 49,
}
export const styleEnum = {
  color: EnumColor,
  bgColor: EnumBgColor,
  emphasis: EnumEmphasis,
  suffix: EnumSuffix,
};
