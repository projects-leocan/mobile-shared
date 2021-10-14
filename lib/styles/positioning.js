import { range } from 'lodash/util';
import { camelCase } from 'lodash/string';
import { flatMap } from 'lodash/collection';

const _layoutStep = 5;

const steps = range(0, 16).map(i => i * _layoutStep);
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

const calcPositioning = (property, dir, step) => {
  if (dir.l === 'x') {
    return {
      [camelCase(`${property}Left`)]: step,
      [camelCase(`${property}Right`)]: step
    }
  }
  if (dir.l === 'y') {
    return {
      [camelCase(`${property}Top`)]: step,
      [camelCase(`${property}Bottom`)]: step,
    }
  }
  if (dir.l === 'a') {
    return {
      [property]: step
    }
  }
  return {
    [camelCase(`${property} ${dir.v}`)]: step
  }
}

const calcPositioningGlobal = (dir, step) => {
  if (dir.l === 'x') {
    return {
      left: step,
      right: step
    }
  }
  if (dir.l === 'y') {
    return {
      top: step,
      bottom: step
    }
  }
  if (dir.l === 'a') {
    return {
      top: step,
      bottom: step,
      left: step,
      right: step
    }
  }
  return {
    [dir.v]: step
  }
}

const buildPositioning = (property) =>
  flatMap(directions, dir => steps.map(step => ({ [camelCase(`${dir.l}${step}`)]: property ? calcPositioning(property, dir, step) : calcPositioningGlobal(dir, step) })))
  .reduce((acc, n) => ({ ...acc, ...n }), {})

export const padding = buildPositioning('padding');
export const margin = buildPositioning('margin');
export const positioning = buildPositioning();
