import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import moment from 'moment';
import { find, findIndex } from 'lodash/collection';
import { get, omit } from 'lodash/object';
import { isArray, isObject } from 'lodash/lang';

import UpdatesTypes from '../constants/updates';
const OUTGOING_HASHES_LIMIT = 3;

// export const INITIAL_STATE = Immutable({
//   date: moment().format('YYYY-MM-DD'),
//   rooms: {},
//   inventory: {},
//   rejections: {},
//   tasks: [],
//   photos: {},
//   isSendingTask: false,
//   taskError: null
// });

const getInitialState = () => ({
  date: moment().format('YYYY-MM-DD'),
  rooms: {},
  inventory: {},
  rejections: {},
  tasks: [],
  photos: {},
  isSendingTask: false,
  taskError: null,
  outgoingHashes: {
    room: {},
    task: {}
  },
})

const ACTION_HANDLERS = {
  [UpdatesTypes.UPDATES_RESET]: (state) => {
    return getInitialState();
  },
  [UpdatesTypes.INVENTORY_ADJUST]: (state, { assetRoomId, roomId }) => {
    if (!get(state, ['inventory', roomId], false)) {
      let inventory = {};
      inventory[assetRoomId] = 1
      // return state.setIn(['inventory', roomId], Immutable(inventory));
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [roomId]: inventory
        }
      }
    }

    if (!get(state, ['inventory', roomId, assetRoomId], false)) {
      // return state.setIn(['inventory', roomId, assetRoomId], 1);
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [roomId]: {
            ...get(state, ['inventory', roomId]),
            [assetRoomId]: 1
          }
        }
      }
    }

    // return state.updateIn(['inventory', roomId, assetRoomId], (x) => x + 1);
    return {
      ...state,
      inventory: {
        ...state.inventory,
        [roomId]: {
          ...get(state, ['inventory', roomId]),
          [assetRoomId]: get(state, ['inventory', roomId, assetRoomId], 0) + 1
        }
      }
    }
  },
  [UpdatesTypes.INVENTORY_REJECT]: (state, { assetRoomId, roomId }) => {
    if (!get(state, ['rejections', roomId], false)) {
      let rejections = {};
      rejections[assetRoomId] = 1
      // return state.setIn(['rejections', roomId], Immutable(rejections));
      return {
        ...state,
        rejections: {
          ...state.rejections,
          [roomId]: rejections
        }
      }
    }

    if (!get(state, ['rejections', roomId, assetRoomId], false)) {
      // return state.setIn(['rejections', roomId, assetRoomId], 1);
      return {
        ...state,
        rejections: {
          ...state.rejections,
          [roomId]: {
            ...get(state, ['rejections', roomId]),
            [assetRoomId]: 1
          }
        }
      }
    }

    // return state.updateIn(['rejections', roomId, assetRoomId], (x) => x + 1);
    return {
      ...state,
      rejections: {
        ...state.rejections,
        [roomId]: {
          ...get(state, ['rejections', roomId]),
          [assetRoomId]: get(state, ['rejections', roomId, assetRoomId], 0) + 1
        }
      }
    }
  },
  [UpdatesTypes.INVENTORY_RESET]: (state, { assetRoomId, roomId }) => {
    // if (!get(state, ['inventory', roomId, assetRoomId], false)) {
    //   return state;
    // }

    const roomInventory = get(state, ['inventory', roomId], {});
    const roomRejections = get(state, ['rejections', roomId], {});
    
    // return state
    //   .setIn(['inventory', roomId], roomInventory.without(assetRoomId))
    //   .setIn(['rejections', roomId], roomInventory.without(assetRoomId));
    return {
      ...state,
      inventory: {
        ...state.inventory,
        [roomId]: omit(get(state, ['inventory', roomId]), assetRoomId),
      },
      rejections: {
        ...state.rejections,
        [roomId]: omit(get(state, ['rejections', roomId]), assetRoomId),
      }
    }
  },
  [UpdatesTypes.ROOM_CLEAN_START]: (state, { roomId }) => {
    const { rooms } = state;
    const newEntry = {
      roomId,
      startTime: moment().unix(),
      endTime: null,
      pauseTime: 0,
      lastPauseTs: null,
      isPaused: false
    }

    // return state.setIn(['rooms', roomId], Immutable(newEntry));
    return {
      ...state,
      rooms: {
        ...state.rooms,
        [roomId]: newEntry
      }
    }
  },
  [UpdatesTypes.ROOM_CLEAN_RESTART]: (state, { roomId }) => {
    const { rooms } = state;
    const newEntry = {
      roomId,
      startTime: moment().unix(),
      endTime: null,
      pauseTime: 0,
      lastPauseTs: null,
      isPaused: false
    }

    // return state.setIn(['rooms', roomId], Immutable(newEntry));
    return {
      ...state,
      rooms: {
        ...state.rooms,
        [roomId]: newEntry
      }
    }
  },
  [UpdatesTypes.ROOM_CLEAN_PAUSE]: (state, { roomId }) => {
    // return state
    //   .setIn(['rooms', roomId, 'lastPauseTs'], moment().unix())
    //   .setIn(['rooms', roomId, 'isPaused'], true);

    return {
      ...state,
      rooms: {
        ...state.rooms,
        [roomId]: {
          ...get(state, ['rooms', roomId]),
          lastPauseTs: moment().unix(),

        }
      }
    }
  },
  [UpdatesTypes.ROOM_CLEAN_UNPAUSE]: (state, { roomId}) => {
    const lastPauseTs = get(state, ['rooms', roomId, 'lastPauseTs']);
    const pauseTime = get(state, ['rooms', roomId, 'pauseTime'], 0);

    // return state
    //   .setIn(['rooms', roomId, 'lastPauseTs'], 0)
    //   .setIn(['rooms', roomId, 'pauseTime'], pauseTime + (moment().unix() - lastPauseTs))
    //   .setIn(['rooms', roomId, 'isPaused'], false);

    return {
      ...state,
      rooms: {
        ...state.rooms,
        [roomId]: {
          ...get(state, ['rooms', roomId]),
          lastPauseTs: 0,
          pauseTime: pauseTime + (moment().unix() - lastPauseTs),
          isPaused: false
        }
      }
    }
  },
  [UpdatesTypes.ROOM_CLEAN_FLUSH]: (state, { roomId }) => {
    const { rooms } = state;
    // console.log("ROOM_CLEAN_FLUSH", roomId)
    // return state.set('rooms', rooms.without(roomId));
    return {
      ...state,
      rooms: omit(state.rooms, roomId)
    }
  },
  [UpdatesTypes.ROOM_CANCEL]: (state, { roomId }) => {
    const { rooms } = state;
    // return state.set('rooms', rooms.without(roomId));
    return {
      ...state,
      rooms: omit(state.rooms, roomId)
    }
  },
  [UpdatesTypes.PHOTO_UPLOAD]: (state, { path, id }) => {
    // return state.setIn(['photos', id], Immutable({ path, loading: true }));
    return {
      ...state,
      photos: {
        ...state.photos,
        [id]: { path, loading: true }
      }
    }
  },
  [UpdatesTypes.PHOTO_STORE]: (state, { id, url }) => {
    // return state.setIn(['photos', id, 'url'], url).setIn(['photos', id, 'loading'], false);

    // console.log(state);
    // debugger;
    return {
      ...state,
      photos: {
        ...state.photos,
        [id]: {
          ...get(state, ['photos', id]),
          url,
          loading: false
        }
      }
    }
  },
  [UpdatesTypes.PHOTO_UPLOAD_FAILURE]: (state, { id }) => {
    // return state.setIn(['photos', id, 'loading'], false);
    return {
      ...state,
      photos: {
        ...state.photos,
        [id]: {
          ...get(state, ['photos', id]),
          loading: false
        }
      }
    }
  },
  [UpdatesTypes.PHOTO_REMOVE]: (state, { id }) => {
    const { photos } = state;
    // return state.set('photos', photos.without(id));
    return {
      ...state,
      photos: omit(photos, id)
    }
  },
  [UpdatesTypes.TASK_SENDING]: (state) => {
    // return state.set('isSendingTask', true);
    return {
      ...state,
      isSendingTask: true
    }
  },
  [UpdatesTypes.TASK_SENDING]: (state) => {
    // return state
    //   .set('taskError', null)
    //   .set('isSendingTask', true);
    return {
      ...state,
      taskError: null,
      isSendingTask: true
    }
  },
  [UpdatesTypes.TASK_SENDING_SUCCESS]: (state) => {
    // return state.set('isSendingTask', false);
    return {
      ...state,
      isSendingTask: false
    }
  },
  [UpdatesTypes.TASK_SENDING_FAILURE]: (state, { error }) => {
    // return state
    //   .set('taskError', error)
    //   .set('isSendingTask', false);
    return {
      ...state,
      taskError: error,
      isSendingTask: false
    }
  },
  [UpdatesTypes.TASK_SENDING_RESET]: (state) => {
    // return state
    //   .set('taskError', null)
    //   .set('isSendingTask', false);
    return {
      ...state,
      taskError: null,
      isSendingTask: false
    }
  },
  [UpdatesTypes.SAVE_OUTGOING_HASH]: (state, { group, id, hash }) => {
    let currentHashes = state.outgoingHashes;
    if (!isObject(currentHashes)) {
      currentHashes = { room: {}, task: {} };
    }
    
    const outgoingHashes = {
      ...currentHashes,
      [group]: {
        ...currentHashes[group],
        [id]: hash
      }
    }

    return {
      ...state,
      outgoingHashes
    }
  }
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
