import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { keyBy, map, find, filter } from 'lodash/collection';
import { uniq } from 'lodash/array';
import { get, extend } from 'lodash/object';
import { map as fpMap, uniq as fpUniq, fpUniqWith, compose, flow } from 'lodash/fp';
import moment from 'moment';

import { userIdSelector } from 'rc-mobile-base/lib/selectors/rooms';
const glitchesSelector = state => state.glitches.hotelGlitches;
const activeGlitchSelector = state => state.glitches.activeGlitch;
const groupsSelector = state => state.users.hotelGroups;

const getActiveGlitch = (hotelGlitches, activeGlitch) => {
  if (!hotelGlitches || !hotelGlitches.length) {
    return null;
  }

  return find(hotelGlitches, { uuid: activeGlitch });
}

export const computedActiveGlitch = createSelector(
  [glitchesSelector, activeGlitchSelector],
  getActiveGlitch
);

const getAvailableGlitches = (hotelGlitches, hotelGroups, userId) => {
  console.log('---- getAvailableGlitches ----');
  console.log(hotelGlitches)
  console.log(hotelGroups)
  console.log(userId)

  if (!hotelGlitches || !hotelGlitches.length || !userId) {
    return [];
  }
  
  // return hotelGlitches;

  const myGroups = hotelGroups.filter(group => {
    return get(group, 'users', []).includes(userId);
  }).map(group => group._id);

  if (!myGroups || !myGroups.length) {
    return [];
  }

  const filteredGlitches = hotelGlitches.filter(glitch => myGroups.includes(get(glitch, 'assignment.id')));
  // console.log(filteredGlitches) 
  return filteredGlitches;
}

const getPopupGlitches = (availableGlitches, userId) => {
  const today = moment().format('YYYY-MM-DD');

  return availableGlitches.filter(glitch => {
    if (get(glitch, 'date') !== today) {
      return false;
    }

    return !get(glitch, 'assignment.acknowledged', []).includes(userId);
    // return !get(glitch, 'history.length', 0);
  });
}

export const computedAvailableGlitches = createSelector(
  [glitchesSelector, groupsSelector, userIdSelector],
  getAvailableGlitches
)

export const computedPopupGlitches = createSelector(
  [computedAvailableGlitches, userIdSelector],
  getPopupGlitches
)
