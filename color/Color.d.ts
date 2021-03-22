import type { styleEnum, EnumColor, EnumBgColor, EnumEmphasis } from 'trailmix/color/enum.ts';

export type StyleTypes = Exclude<keyof typeof styleEnum, 'suffix'>;
// list of all style strings
export type Styles = keyof typeof EnumColor | keyof typeof EnumBgColor | keyof typeof EnumEmphasis;

// generic style function string return string
export type StyleFn = (str: string) => string;

// for each style type use the styleEnum to get each name
export type StylesMap = {
  [key in StyleTypes]: {
    [e in keyof typeof styleEnum[key] as Styles]: StyleFn;
  };
};

// map of all styles to a function
export type StyleMap = Record<Styles, StyleFn>;

// options by string
export type StyleOptions = {
  [key in StyleTypes]?: keyof typeof styleEnum[key];
};
// random options bools
export type RandomStyleOptions = {
  [key in StyleTypes]?: boolean;
};
