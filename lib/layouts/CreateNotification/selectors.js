import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';
import { sortBy } from 'lodash/collection';

import { sort } from '../../utils/immutable';
import { floorsSorting, roomsSorting } from '../../utils/sorting';

import { usersMapped, sortedGroups } from '../../selectors/users';
import { allHotelRooms } from 'rc-mobile-base/lib/selectors/rooms';

const quickSelects = [
  { name: 'Planned Attendant', translation: 'planned-attendant', value: 'planned', type: 'quick' },
  { name: 'Maintenance Team (All)', translation: 'maintenance-team', value: 'maintenance', type: 'quick' },
  { name: 'Runners (All)', translation: 'all-runners', value: 'runners', type: 'quick' },
  { name: 'Inspectors (All)', translation: 'all-inspectors', value: 'inspectors', type: 'quick' },
]

export const userSelects = createSelector(
  [usersMapped],
  (users) => {
    const mapped = users.map(user => ({
      ...user,
      image: user.thumbnail || user.image || null,
      name: user.fullName,
      value: user._id,
      type: 'people'
    }))
    const sorted = sortBy(mapped, 'name')
    return sorted
  }
)

export const groupSelects = createSelector(
  [sortedGroups],
  (groups) => groups.map(group => ({
    ...group,
    name: group.name,
    value: group._id,
    type: 'group',
    isGroup: true
  }))
)

export const allUsersSelector = createSelector(
  [userSelects, groupSelects],
  (users, groups) => quickSelects.concat(users).concat(groups)
)

export const defaultUserSelector = createSelector(
  [allUsersSelector],
  (users) => users[0]
)

export const defaultAttendantSelector = createSelector(
  [allUsersSelector],
  (users) => users[3]
)

const userSearchForm = getFormValues('userSearch')

export const usersSelector = createSelector(
  [allUsersSelector, userSearchForm],
  (users, userSearch) => {
    if (!userSearch) {
      return users
    }
    const regex = new RegExp(userSearch.search, 'i')
    return users.filter(user => user.name.match(regex))
  }
)

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

const createNotificationForm = getFormValues('createNotificationForm')

export const allLocationsSelector = createSelector(
  [sortedRooms, createNotificationForm],
  (rooms, form) => {
    if (!form || !form.locations) {
      return rooms
    }
    const selected = form.locations.map(location => location._id)
    return rooms.map(room => ({
      ...room,
      isSelected: selected.includes(room._id)
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
