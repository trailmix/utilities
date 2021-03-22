import * as colors from 'fmt/colors.ts';
import type { StylesMap, StyleMap, StyleFn, Styles, StyleTypes, RandomStyleOptions } from 'trailmix/color/Color.d.ts';
import { EnumColor, EnumBgColor, EnumEmphasis } from 'trailmix/color/enum.ts';

export default class Color {
  public static stylesMap: StylesMap = {
    color: Color._get_style_map(EnumColor),
    bgColor: Color._get_style_map(EnumBgColor),
    emphasis: Color._get_style_map(EnumEmphasis),
  };
  public static styles: StyleMap = {
    ...Color.stylesMap.color,
    ...Color.stylesMap.bgColor,
    ...Color.stylesMap.emphasis,
  };
  // list of style strings
  private static _styleList: Record<StyleTypes, Styles[]> = {
    color: Object.keys(Color.stylesMap.color) as Styles[],
    bgColor: Object.keys(Color.stylesMap.bgColor) as Styles[],
    emphasis: Object.keys(Color.stylesMap.emphasis) as Styles[],
  };

  /**
   * pass in string and formatting fns to format string with color and style
  //  * @public
  //  * @static
  //  * @param str string to format
  //  * @param fns functions to use
  //  * @returns formatted string
  //  * @example
  //  * console.log(Color.messageByFn('hello', [Color.color.cyan, Color.bgColor.bgRed]))
  //  */
  public static messageByFn(str: string, styles?: (StyleFn | undefined)[]): string {
    let msg = str;
    if (styles !== undefined)
      styles.forEach((style) => {
        if (style !== undefined) msg = style(msg);
      });
    return msg;
  }
  public static messageByFnSpread(str: string, ...styles: (StyleFn | undefined)[]): string {
    let msg = str;
    if (styles !== undefined)
      styles.forEach((style) => {
        if (style !== undefined) msg = style(msg);
      });
    return msg;
  }
  public static messageByString(str: string, styles: (Styles | undefined)[]): string {
    let msg = str;
    if (styles !== undefined)
      styles.forEach((style) => {
        if (style !== undefined) msg = Color.styles[style](msg);
      });
    return msg;
  }
  public static messageByStringSpread(str: string, ...styles: (Styles | undefined)[]): string {
    let msg = str;
    if (styles !== undefined)
      styles.forEach((style) => {
        if (style !== undefined) msg = Color.styles[style](msg);
      });
    return msg;
  }

  public static random(str: string, { color, bgColor, emphasis }: RandomStyleOptions = Color.randomOpts()): string {
    const c = [undefined, false].includes(color) ? undefined : Color.randomStyleFn();
    const bgC = [undefined, false].includes(bgColor) ? undefined : Color.randomStyleFn('bgColor');
    const e = [undefined, false].includes(emphasis) ? undefined : Color.randomStyleFn('emphasis');
    const r: Array<StyleFn | undefined> = new Array(c ?? undefined, bgC ?? undefined, e ?? undefined);
    return Color.messageByFn(str, r);
  }
  public static randomOpts({ color, bgColor, emphasis }: RandomStyleOptions = {}): RandomStyleOptions {
    const ret: RandomStyleOptions = {
      color: color ?? Math.random() >= 0.5 ? true : false,
      bgColor: bgColor ?? Math.random() >= 0.5 ? true : false,
      emphasis: emphasis ?? Math.random() >= 0.5 ? true : false,
    };
    return ret;
  }
  /**
   *
   * @param type pass in a string type of style
   * @returns {StyleFn} random function of type EnumColor|EnumBgColor|EnumEmphasis
   */
  public static randomStyleFn(type: StyleTypes = 'color'): StyleFn {
    return Color.styles[Color.randomStyleString(type)];
  }
  public static randomStyleString(type: StyleTypes = 'color'): Styles {
    const styleNum = Color._randomNumber(Color._styleList[type].length);
    return Color._styleList[type][styleNum];
  }
  // get map of name, style function
  private static _get_style_map(s: Object): StyleMap {
    return Object.fromEntries(
      Object.entries(colors)
        .concat([['clear', (str: string) => str]])
        .flatMap(([style, fn]) => {
          return [
            ...(s !== undefined && Object.values(s).filter((_style) => _style === style).length > 0
              ? [[String(style), fn]]
              : []),
          ];
        }),
    );
  }
  /**
   * @param max max number to find random number (min is 0)
   * @returns random number within len
   */
  private static _randomNumber(max = 1): number {
    return Number(((max - 1) * Number(Math.random())).toFixed(0));
  }
}
export const messageByFn = Color.messageByFn;
export const messageByFnSpread = Color.messageByFnSpread;
export const messageByString = Color.messageByString;
export const messageByStringSpread = Color.messageByStringSpread;
export const random = Color.random;
export const randomOpts = Color.randomOpts;
export const randomStyleFn = Color.randomStyleFn;
export const randomStyleString = Color.randomStyleString;
export const stylesMap: StylesMap = Color.stylesMap;
export const styles: StyleMap = Color.styles;
