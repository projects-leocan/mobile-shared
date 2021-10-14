import { range } from 'lodash/util';
import { flatMap } from 'lodash/collection';
import { camelCase } from 'lodash/string';

const steps = range(0, 3);
const directions = [
  {
    l: 'x'
  },
  {
    l: 'y'
  },
  {
    l: 'a'
  },
  {
    l :'l',
    v: 'left'
  },
  {
    v: 'right',
    l: 'r'
  },
  {
    v: 'top',
    l :'t'
  },
  {
    v: 'bottom',
    l: 'b'
  }
];

const calcBorder = (dir, step) => {
  if (dir.l === 'x') {
    return {
      borderLeftWidth: step,
      borderRightWidth: step
    }
  }
  if (dir.l === 'y') {
    return {
      borderTopWidth: step,
      borderBottomWidth: step,
    }
  }
  if (dir.l === 'a') {
    return {
      borderWidth: step
    }
  }
  return {
    [camelCase(`border ${dir.v} width`)]: step
  }
}

const buildBorder = () =>
  flatMap(directions, dir => steps.map(step => ({ [camelCase(`${dir.l}${step}`)]: calcBorder(dir, step) })))
  .reduce((acc, n) => ({ ...acc, ...n }), {})

export const b0 = {
  borderWidth: 0
}

export const border = buildBorder();
