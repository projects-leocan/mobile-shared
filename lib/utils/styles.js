import { isArray } from 'lodash/lang';
import { StyleSheet } from 'react-native';

const _mergeStyles = (x, y) => StyleSheet.flatten(x.concat(y));

export const mergeStyles = (first, second) => {
  if (!first && !second) {
    return [];
  }
  if (!first && second) {
    return second;
  }
  if (first && !second) {
    return first;
  }

  if (isArray(first) && isArray(second)) {
    return _mergeStyles(first, second);
  }
  if (isArray(first) && !isArray(second)) {
    return _mergeStyles(first, [second]);
  }
  if (!isArray(first) && isArray(second)) {
    return _mergeStyles([first], second);
  }
  if (!isArray(first) && !isArray(second)) {
    return _mergeStyles([first], [second]);
  }
};
