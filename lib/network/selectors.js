import { createSelector } from 'reselect';

export const network = state => state.network;

export const status = createSelector(
  [network],
  (network) => network.isOnline
);

export default {
  network,
  status
}
