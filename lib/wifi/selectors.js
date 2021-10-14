import { createSelector } from 'reselect';

export const wifi = state => state.wifi;

export const status = createSelector(
  [wifi],
  (wifi) => wifi.on
);

export default {
  wifi,
  status
}
