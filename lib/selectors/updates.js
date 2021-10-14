import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { keyBy, map, find, filter } from 'lodash/collection';
import { uniq } from 'lodash/array';
import { get, extend } from 'lodash/object';
import { map as fpMap, uniq as fpUniq, fpUniqWith, compose, flow } from 'lodash/fp';

const updatesSelector = state => state.updates;
const roomsSelector = createSelector(
  [updatesSelector],
  (updates) => updates.rooms
);
const activeRoomSelector = state => state.rooms.activeRoom;

const getActiveRoomUpdate = (roomsUpdates, roomId) => {
  return roomsUpdates && get(roomsUpdates, roomId, null);
}

export const computedActiveRoomUpdate = createSelector(
  [roomsSelector, activeRoomSelector],
  getActiveRoomUpdate
);

export const getRoomUpdateById = (id) => createSelector(
  [roomsSelector],
  (roomsUpdates) => {
    return roomsUpdates && get(roomsUpdates, id, null);
  }
);

export const photosSelector = createSelector(
  [updatesSelector],
  (updates) => updates.photos
)
