import { range } from 'lodash/util';

const step = 16;
const defaultSizes = [6.0, 5.0, 3.0, 2.25, 1.5, 1.25, 1.0, 0.875];
const _bodySizes = [1.15, 1.0, 0.86];

const buildFontSizes = (sizes, abbr, step = 16) => {
  return sizes.map(size => ({
    fontSize: Math.floor(size * step)
  })).reduce((acc, item, index) => ({
    ...acc,
    [`${abbr}${index+1}`]: item
  }), {});
}

export const headerSizes = buildFontSizes(defaultSizes, 'h');
export const bodySizes = buildFontSizes(_bodySizes, 'b', 14);

const weights = range(100, 900, 100);
export const fontWeights = weights.reduce((acc, item) => ({ ...acc, [`fw${item}`]: { fontWeight: item.toString() } }), {});

export const underline = { textDecorationLine: "underline" };
export const center = { textAlign: "center" };

export const text = {
  ...headerSizes,
  ...bodySizes,
  ...fontWeights,
  underline,
  center
};
