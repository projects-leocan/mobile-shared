import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import moment from 'moment';
import { get, extend } from 'lodash/object';
import { concat, uniq } from 'lodash/array';
import { map } from 'lodash/collection';

import RoomsTypes from '../constants/rooms';
import DifferencesTypes from '../constants/differences';

// export const INITIAL_STATE = Immutable({
//   changes: [],
//   ignores: []
// });

const getInitialState = () => ({
  changes: [],
  ignores: []
});

function extractDifferences(changes, ignores, updates, type, field = '_id') {
  // console.log('updates', updates);
  if (!updates) {
    return [changes, ignores];
  }

  const updateIds = updates.map(update => { return `${update[field]}:${type}` });

  const previous = changes.filter(change => {
    const changeId = `${get(change, 'changeId')}`;
    return !updateIds.includes(changeId);
  });

  const filteredUpdates = updates
    .map(update => extend({}, update, { changeId: `${update[field]}:${type}` }))
    .filter(change => {
      const changeId = get(change, 'changeId');
      return !ignores.includes(changeId);
    });

  const updatedChanges = concat(previous, filteredUpdates);
  // console.log(updatedChanges);
  const changeIds = map(updatedChanges, 'changeId');
  const updatedIgnores = ignores
    .filter(ignoreId => !changeIds.includes(ignoreId));

  return [updatedChanges, updatedIgnores];
}

function removeDifference(changes, updateId) {
  return changes.filter(change => {
    const changeId = get(change, 'changeId');
    return changeId !== updateId;
  });
}

function updateIgnores(ignores, updateId) {
  let updatedIngores = ignores.asMutable ?
    ignores.asMutable() : ignores;

  updatedIngores.push(updateId);

  return updatedIngores;
}

const ACTION_HANDLERS = {
  [DifferencesTypes.RESET_DIFFERENCES]: (state) => {
    return getInitialState();
  },
  [DifferencesTypes.ROOM_CLEAN_DIFFERENCE]: (state, { rooms }) => {
    const [changes, ignores] = extractDifferences(state.changes, state.ignores, rooms, 'clean');

    // return state
    //   .set('changes', changes)
    //   .set('ignores', ignores);

    return {
      ...state,
      changes,
      ignores
    }
  },
  [DifferencesTypes.ROOM_CLEAN_DIFFERENCE_READ]: (state, { roomId }) => {
    // return state
    //   .set('changes', removeDifference(state.changes, `${roomId}:clean`));
    return {
      ...state,
      changes: removeDifference(state.changes, `${roomId}:clean`)
    }
  },
  [DifferencesTypes.ROOM_CLEAN_DIFFERENCE_IGNORE]: (state, { roomId }) => {
    // return state
    //   .set('ignores', updateIgnores(state.ignores, `${roomId}:clean`));
    return {
      ...state,
      changes: updateIgnores(state.ignores, `${roomId}:clean`)
    }
  },
  [DifferencesTypes.ROOM_MESSAGE_DIFFERENCE]: (state, { rooms }) => {
    const [changes, ignores] = extractDifferences(state.changes, state.ignores, rooms, 'message');

    // return state
    //   .set('changes', changes)
    //   .set('ignores', ignores);

    return {
      ...state,
      changes,
      ignores
    }
  },
  [DifferencesTypes.ROOM_MESSAGE_DIFFERENCE_READ]: (state, { roomId }) => {
    // return state
    //   .set('changes', removeDifference(state.changes, `${roomId}:message`));
    return {
      ...state,
      changes: removeDifference(state.changes, `${roomId}:message`)
    }
  },
  [DifferencesTypes.ROOM_MESSAGE_DIFFERENCE_IGNORE]: (state, { roomId }) => {
    // return state
    //   .set('ignores', updateIgnores(state.ignores, `${roomId}:message`));
    return {
      ...state,
      ignores: updateIgnores(state.ignores, `${roomId}:message`)
    }
  },
  [DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE]: (state, { rooms }) => {
    const [changes, ignores] = extractDifferences(state.changes, state.ignores, rooms, 'unblock');

    // return state
    //   .set('changes', changes)
    //   .set('ignores', ignores);
    return {
      ...state,
      changes,
      ignores
    }
  },
  [DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE_READ]: (state, { roomId }) => {
    // return state
    //   .set('changes', removeDifference(state.changes, `${roomId}:unblock`));

    return {
      ...state,
      changes: removeDifference(state.changes, `${roomId}:unblock`)
    }
  },
  [DifferencesTypes.ROOM_UNBLOCK_DIFFERENCE_IGNORE]: (state, { roomId }) => {
    // return state
    //   .set('ignores', updateIgnores(state.ignores, `${roomId}:unblock`));
    return {
      ...state,
      ignores: updateIgnores(state.ignores, `${roomId}:unblock`)
    }
  },
  [DifferencesTypes.ROOM_RESTOCK_DIFFERENCE]: (state, { rooms }) => {
    const [changes, ignores] = extractDifferences(state.changes, state.ignores, rooms, 'restock');

    // return state
    //   .set('changes', changes)
    //   .set('ignores', ignores);

    return {
      ...state,
      changes,
      ignores
    }
  },
  [DifferencesTypes.ROOM_RESTOCK_DIFFERENCE_READ]: (state, { roomId }) => {
    // return state
    //   .set('changes', removeDifference(state.changes, `${roomId}:restock`));

    return {
      ...state,
      changes: removeDifference(state.changes, `${roomId}:restock`)
    }
  },
  [DifferencesTypes.ROOM_RESTOCK_DIFFERENCE_IGNORE]: (state, { roomId }) => {
    // return state
    //   .set('ignores', updateIgnores(state.ignores, `${roomId}:restock`));

    return {
      ...state,
      ignore: updateIgnores(state.ignores, `${roomId}:restock`)
    }
  },
  [DifferencesTypes.PLANNING_PRIORITY_DIFFERENCE]: (state, { rooms }) => {
    const [changes, ignores] = extractDifferences(state.changes, state.ignores, rooms, 'priority', 'room_id');
    // console.log(changes);

    // return state
    //   .set('changes', changes)
    //   .set('ignores', ignores);

    return {
      ...state,
      changes,
      ignores
    }
  },
  [DifferencesTypes.PLANNING_PRIORITY_DIFFERENCE_READ]: (state, { roomId }) => {
    // return state
    //   .set('changes', removeDifference(state.changes, `${roomId}:priority`));

    return {
      ...state,
      changes: removeDifference(state.changes, `${roomId}:priority`)
    }
  },
  [DifferencesTypes.PLANNING_PRIORITY_DIFFERENCE_IGNORE]: (state, { roomId }) => {
    // return state
    //   .set('ignores', updateIgnores(state.ignores, `${roomId}:priority`));

    return {
      ...state,
      ignores: updateIgnores(state.ignores, `${roomId}:priority`)
    }
  },
  [DifferencesTypes.CALENDAR_CHECKIN_DIFFERENCE]: (state, { rooms }) => {
    const [changes, ignores] = extractDifferences(state.changes, state.ignores, rooms, 'checkin', 'room_id');

    // return state
    //   .set('changes', changes)
    //   .set('ignores', ignores);

    return {
      ...state,
      changes,
      ignores
    }
  },
  [DifferencesTypes.CALENDAR_CHECKIN_DIFFERENCE_READ]: (state, { roomId }) => {
    // return state
    //   .set('changes', removeDifference(state.changes, `${roomId}:checkin`));

    return {
      ...state,
      changes: removeDifference(state.changes, `${roomId}:checkin`)
    }
  },
  [DifferencesTypes.CALENDAR_CHECKIN_DIFFERENCE_IGNORE]: (state, { roomId }) => {
    // return state
    //   .set('ignores', updateIgnores(state.ignores, `${roomId}:checkin`));

    return {
      ...state,
      ignores: updateIgnores(state.ignores, `${roomId}:checkin`)
    }
  },
  [DifferencesTypes.CALENDAR_CHECKOUT_DIFFERENCE]: (state, { rooms }) => {
    const [changes, ignores] = extractDifferences(state.changes, state.ignores, rooms, 'checkout', 'room_id');

    // return state
    //   .set('changes', changes)
    //   .set('ignores', ignores);

    return {
      ...state,
      changes,
      ignores
    }
  },
  [DifferencesTypes.CALENDAR_CHECKOUT_DIFFERENCE_READ]: (state, { roomId }) => {
    // return state
    //   .set('changes', removeDifference(state.changes, `${roomId}:checkout`));
    return {
      ...state,
      changes: removeDifference(state.changes, `${roomId}:checkout`)
    }
  },
  [DifferencesTypes.CALENDAR_CHECKOUT_DIFFERENCE_IGNORE]: (state, { roomId }) => {
    // return state
    //   .set('ignores', updateIgnores(state.ignores, `${roomId}:checkout`));

    return {
      ...state,
      ignores: updateIgnores(state.ignores, `${roomId}:checkout`)
    }
  }
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
