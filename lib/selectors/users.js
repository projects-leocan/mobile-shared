import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { keyBy, map, find, filter, sortBy } from 'lodash/collection';
import { uniq } from 'lodash/array';
import { get, extend } from 'lodash/object';
import { map as fpMap, uniq as fpUniq, fpUniqWith, compose, flow } from 'lodash/fp';
import { userType } from '../utils';

import { transform } from '../utils/users';

export const usersSelector = state => state.users.users;
export const groupsSelector = state => state.users.hotelGroups;

export const usersMapped = createSelector(
  [usersSelector],
  (users) => {
    console.log('running usersMapped')
    return users.map(transform);
  }
)

export const sortedGroups = createSelector(
  [groupsSelector],
  groups => sortBy(groups, 'name')
);

const getIndexedUsers = (hotelUsers) => {
  if (!hotelUsers || !hotelUsers.length) {
    return {};
  }

  return keyBy(hotelUsers, '_id');
}

const getAttendantUsers = (hotelUsers) => {
  if (!hotelUsers || !hotelUsers.length) {
    return [];
  }

  return hotelUsers.filter(user => user.isAttendant);
}

const getRunnerUsers = (hotelUsers) => {
  if (!hotelUsers || !hotelUsers.length) {
    return [];
  }

  return hotelUsers.filter(user => user.isRoomRunner);
}

const getInspectorUsers = (hotelUsers) => {
  if (!hotelUsers || !hotelUsers.length) {
    return [];
  }

  return hotelUsers.filter(user => user.isInspector);
}

export const computedIndexedUsers = createSelector(
  [usersMapped],
  getIndexedUsers
);

export const computedAttendantUsers = createSelector(
  [usersMapped],
  getAttendantUsers
)

export const computedIndexedAttendants = createSelector(
  [computedAttendantUsers],
  getIndexedUsers
)

export const computedRunnerUsers = createSelector(
  [usersSelector],
  getRunnerUsers
)

export const computedIndexedRunners = createSelector(
  [computedRunnerUsers],
  getIndexedUsers
)

export const computedInspectorUsers = createSelector(
  [usersSelector],
  getInspectorUsers
)

export const computedIndexedInspectors = createSelector(
  [computedInspectorUsers],
  getIndexedUsers
)

export const computedIndexedGroups = createSelector(
  [groupsSelector],
  groups => keyBy(groups || [], '_id')
)