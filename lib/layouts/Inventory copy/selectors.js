import { createSelector } from 'reselect';
import { filter, keyBy, groupBy } from 'lodash';

export const withdrawalsSelector = state => state.assets.hotelInventoryWithdrawals;

export const getWithdrawalsIndexById = roomId => createSelector(
  [withdrawalsSelector,],
  (hotelWithdrawals) => groupBy(filter(hotelWithdrawals, { room_id: roomId }), 'asset_id')
)