import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { isEqual } from 'lodash/lang';

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

export default createDeepEqualSelector;