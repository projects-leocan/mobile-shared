import I18n from 'react-native-i18n';
import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';
import { sortBy, filter, map } from 'lodash/collection';

import { sort } from 'rc-mobile-base/lib/utils/immutable';
import { floorsSorting, roomsSorting } from 'rc-mobile-base/lib/utils/sorting';

import { allHotelRooms } from 'rc-mobile-base/lib/selectors/rooms';
import { usersSelector, groupsSelector } from 'rc-mobile-base/lib/selectors/users';
import userType from 'rc-mobile-base/lib/utils/user-type';

const userSelector = state => state.auth.user;
const configSelector = state => state.auth.config;

const roomsByFloor = (a, b) => {
  const aFloorSorting = floorsSorting(a.floor.number, a.floor.sortValue)
  const bFloorSorting = floorsSorting(b.floor.number, b.floor.sortValue)
  const aSorting = roomsSorting(a.name, a.sortValue)
  const bSorting = roomsSorting(b.name, b.sortValue)

  if (aFloorSorting > bFloorSorting) {
    return 1
  }

  if (aFloorSorting < bFloorSorting) {
    return -1
  }

  if (aFloorSorting === bFloorSorting) {
    if (aSorting > bSorting) {
      return 1
    }
    if (aSorting < bSorting) {
      return -1
    }
    if (aSorting === bSorting) {
      return 0
    }
  }
}

const sortRooms = sort(roomsByFloor)

const sortedRooms = createSelector(
  [allHotelRooms],
  (rooms) => sortRooms(rooms)
)

const taskLocationsForm = getFormValues('taskLocations')

export const allLocationsSelector = createSelector(
  [sortedRooms, taskLocationsForm],
  (rooms, form) => {
    if (!form || !form.locations) {
      return rooms
    }
    const selected = form.locations.map(location => location.id)
    return rooms.map(room => ({
      ...room,
      isSelected: selected.includes(room.id)
    }))
  }
)

const roomSearchForm = getFormValues('roomSearch')

export const locationsSelector = createSelector(
  [allLocationsSelector, roomSearchForm],
  (locations, roomSearch) => {
    if (!roomSearch) {
      return locations
    }
    const regex = new RegExp(roomSearch.search, 'i')
    return locations.filter(location => location.name.match(regex))
  }
)

const assignmentSearchForm = getFormValues('assignmentSearch')
const mapUser = (user) => ({
  name: `${user.first_name} ${user.last_name}`,
  type: userType(user, true),
  value: user.id,
  image: user.thumbnail || user.image
})

export const assignmentSelector = (type) => createSelector(
  [usersSelector, groupsSelector, assignmentSearchForm],
  (users, groups, assignmentSearch) => {
    let options = [];

    const maintenance = map(sortBy(filter(users, 'isMaintenance'), 'first_name', 'last_name'), mapUser);
    const inspectors = map(sortBy(filter(users, 'isInspector'), 'first_name', 'last_name'), mapUser);
    const attendants = map(sortBy(filter(users, 'isAttendant'), 'first_name', 'last_name'), mapUser);
    const runners = map(sortBy(filter(users, 'isRoomRunner'), 'first_name', 'last_name'), mapUser);

    options = [
      ...maintenance,
      ...attendants,
      ...runners,
      ...inspectors
    ];
  
    options = [
      ...options.map(user => ({
        ...user,
        type: 'User',
      })),
      ...groups.map(group => ({
        name: group.name,
        value: group.id,
        type: 'group',
        typeKey: group.typeKey
      }))
    ]

    if (assignmentSearch && assignmentSearch.search) {
      const cleanSearch = assignmentSearch.search.toLowerCase();
      options = options.filter(option => option.name.toLowerCase().includes(cleanSearch))
    }

    return options;
  }
)

export const enableRecentTasksSelector = createSelector(
  [userSelector, configSelector],
  (user, config) => {
    try {
      return user.isRoomRunner && config.isEnableRunnerRecentTasks
        || user.isAttendant && config.isEnableAttendantRecentTasks;

    } catch (error) {
      return false;
    }
  }
)