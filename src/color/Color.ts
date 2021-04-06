import { colors } from "trailmix/deps.ts";

import {
  EnumBgColor,
  EnumColor,
  EnumEmphasis,
  EnumSuffix,
} from "trailmix/color/enum.ts";
import type {
  RandomStyleOptions,
  Style,
  StyleFn,
  StyleMap,
  StyleType,
  StyleTypeMap,
} from "trailmix/color/Color.d.ts";
export const styleEnum = {
  color: EnumColor,
  bgColor: EnumBgColor,
  emphasis: EnumEmphasis,
  suffix: EnumSuffix,
};

export default class Color {
  public static styleTypeMap: StyleTypeMap = {
    color: Color._get_style_map(EnumColor),
    bgColor: Color._get_style_map(EnumBgColor),
    emphasis: Color._get_style_map(EnumEmphasis),
  };
  public static styleMap: StyleMap = {
    ...Color.styleTypeMap.color,
    ...Color.styleTypeMap.bgColor,
    ...Color.styleTypeMap.emphasis,
  };
  // list of style strings
  private static _styleList: Record<StyleType, Style[]> = {
    color: Object.keys(Color.styleTypeMap.color) as Style[],
    bgColor: Object.keys(Color.styleTypeMap.bgColor) as Style[],
    emphasis: Object.keys(Color.styleTypeMap.emphasis) as Style[],
  };
  private static _styleNames: Style[] = [
    ...Color._styleList.color,
    ...Color._styleList.bgColor,
    ...Color._styleList.emphasis,
  ];
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
  public static messageByFn(
    str: string,
    styles?: (StyleFn | undefined)[],
  ): string {
    let msg = str;
    if (styles !== undefined) {
      styles.forEach((style) => {
        if (style !== undefined) msg = style(msg);
      });
    }
    return msg;
  }
  public static messageByFnSpread(
    str: string,
    ...styles: (StyleFn | undefined)[]
  ): string {
    let msg = str;
    if (styles !== undefined) {
      styles.forEach((style) => {
        if (style !== undefined) msg = style(msg);
      });
    }
    return msg;
  }
  public static messageByString(
    str: string,
    styles: (Style | undefined)[],
  ): string {
    let msg = str;
    if (styles !== undefined) {
      styles.forEach((style) => {
        if (style !== undefined) msg = Color.styleMap[style](msg);
      });
    }
    return msg;
  }
  public static messageByStringSpread(
    str: string,
    ...styles: (Style | undefined)[]
  ): string {
    let msg = str;
    if (styles !== undefined) {
      styles.forEach((style) => {
        if (style !== undefined) msg = Color.styleMap[style](msg);
      });
    }
    return msg;
  }

  public static random(
    str: string,
    { color, bgColor, emphasis }: RandomStyleOptions = Color.randomOpts(),
  ): string {
    const c = Color._styleNames.includes(color as Style)
      ? Color.styleMap[color as Style]
      : Color.randomStyleFn();
    const bgC = Color._styleNames.includes(bgColor as Style)
      ? Color.styleMap[bgColor as Style]
      : Color.randomStyleFn("bgColor");
    const e = Color._styleNames.includes(emphasis as Style)
      ? Color.styleMap[emphasis as Style]
      : Color.randomStyleFn("emphasis");
    return Color.messageByFn(str, [c, bgC, e]);
  }
  public static randomOpts(
    { color, bgColor, emphasis }: RandomStyleOptions = {},
  ): RandomStyleOptions {
    return {
      color: color ?? (Math.random() >= 0.5 ? true : false),
      bgColor: bgColor ?? (Math.random() >= 0.5 ? true : false),
      emphasis: emphasis ?? (Math.random() >= 0.5 ? true : false),
    };
  }
  /**
   *
   * @param type pass in a string type of style
   * @returns {StyleFn} random function of type EnumColor|EnumBgColor|EnumEmphasis
   */
  public static randomStyleFn(type: StyleType = "color"): StyleFn {
    return Color.styleMap[Color.randomStyleString(type)];
  }
  public static randomStyleString(type: StyleType = "color"): Style {
    const styleNum = Color._randomNumber(Color._styleList[type].length);
    return Color._styleList[type][styleNum];
  }
  // get map of name, style function
  private static _get_style_map(s: Record<string, string | number>): StyleMap {
    return Object.fromEntries(
      Object.entries(colors)
        .concat([["clear", (str: string) => colors.stripColor(str)], [
          "none",
          (str: string) => str,
        ]])
        .flatMap(([style, fn]) => {
          return [
            ...(s !== undefined &&
                Object.values(s).filter((_style) => _style === style).length > 0
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
export const stylesMap: StyleTypeMap = Color.styleTypeMap;
export const styles: StyleMap = Color.styleMap;
