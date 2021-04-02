import type {
  EnumBgColor,
  EnumColor,
  EnumEmphasis,
  styleEnum,
} from "trailmix/color/enum.ts";

export type StyleType = Exclude<keyof typeof styleEnum, "suffix">;
// list of all style strings
export type Style =
  | keyof typeof EnumColor
  | keyof typeof EnumBgColor
  | keyof typeof EnumEmphasis;

// generic style function string return string
export type StyleFn = (str: string) => string;

// for each style type use the styleEnum to get each name
export type StyleTypeMap = {
  [key in StyleType]: {
    [e in keyof typeof styleEnum[key] as Style]: StyleFn;
  };
};

// map of all styles to a function
export type StyleMap = Record<Style, StyleFn>;

// options by string
export type StyleOptions = {
  [key in StyleType]?: keyof typeof styleEnum[key];
};
// random options bools
export type RandomStyleOptions = {
  [key in StyleType]?: boolean | Style;
};
