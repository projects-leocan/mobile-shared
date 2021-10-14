import { createSelector } from 'reselect';
import keyBy from 'lodash/keyBy';
import get from 'lodash/get';
import moment from 'moment';

import { prettyLabel, prepItem } from './utils';

export const customOfflineSelector = state => state.customOffline;
export const offlineSelector = state => state.offline;
export const outboundSelector = state => state.outbound;
export const roomsSelector = state => state.rooms.hotelRooms;
export const roomHousekeepingsSelector = state => state.rooms.hotelRoomHousekeepings;
export const networkMessageSelector = state => state.auth.config.networkMessage;

export const offlineOutboxSelector = createSelector(
  [offlineSelector],
  (offline) => offline.outbox
);

export const offlineRetrySelector = createSelector(
  [offlineSelector],
  (offline) => offline.retryCount
)

export const outboundFailedSelector = createSelector(
  [outboundSelector],
  (outbound) => outbound.failedRequests
)

export const roomsIndexSelector = createSelector(
  [roomsSelector],
  (rooms) => keyBy(rooms, '_id')
)

export const roomHousekeepingsIndexSelector = createSelector(
  [roomHousekeepingsSelector],
  (roomHousekeepings) => keyBy(roomHousekeepings, '_id')
)

export const offlineListSelector = createSelector(
  [offlineOutboxSelector, outboundFailedSelector, roomsIndexSelector, roomHousekeepingsIndexSelector],
  (outbox, failed, roomsIndex, roomHousekeepingsIndex) => {
    let items = [];

    if (outbox && outbox.length) {
      items.push({
        data: outbox.map((item, index) => prepItem(item, index, roomsIndex, roomHousekeepingsIndex)),
        title: 'Pending',
        key: 'pending'
      });
    }
    if (failed && failed.length) {
      items.push({
        data: failed.map((item, index) => prepItem(item, index, roomsIndex, roomHousekeepingsIndex, false)),
        title: 'Failed',
        key: 'failed'
      });
    }

    return items;
  }
)