import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';

const rehydrationSelector = state => state.rehydration;

export const isRehydrated = createSelector(
  [rehydrationSelector],
  (rehydration) => rehydration.isRehydrated
);
