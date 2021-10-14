import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';
import { sortBy } from 'lodash/collection';

import { sort } from 'rc-mobile-base/lib/utils/immutable';
import { floorsSorting, roomsSorting } from 'rc-mobile-base/lib/utils/sorting';

import { allHotelRooms } from 'rc-mobile-base/lib/selectors/rooms';

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
