import Immutable from 'seamless-immutable';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { keyBy, groupBy, map, find, filter, sortBy, includes, each } from 'lodash/collection';
import { uniq, flatten, first, uniqBy, concat } from 'lodash/array';
import { get, extend, values, mapKeys, keys, assign, merge, pick } from 'lodash/object';
import { isEmpty, clone, isEqual } from 'lodash/lang';
import compact from 'lodash/compact';
import _ from 'lodash';
import { map as fpMap, uniq as fpUniq, fpUniqWith, flow, sortBy as fpSortBy, filter as fpFilter } from 'lodash/fp';
import moment from 'moment';

import { calculateGuest, calculateGuestCode } from '../utils/calendar';
import { roomsSorting, floorsSorting } from '../utils/sorting';
import makeProfile from '../utils/make-profile';
import createDeepEqualSelector from '../utils/create-deep-equal-selector';
import { createSingleTruthSelector } from '../utils/redux-tools/selectors';

export const userSelector = state => state.auth.user;
export const userIdSelector = state => state.auth.userId;
export const roomsSelector = state => state.rooms.hotelRooms;
export const messagesSelector = state => state.rooms.hotelMessages;
export const floorsSelector = state => state.rooms.hotelFloors;
export const roomStatusesSelector = state => state.rooms.hotelRoomStatuses;
export const roomHousekeepingsSelector = state => state.rooms.hotelRoomHousekeepings;
export const roomCategoriesSelector = state => state.rooms.hotelRoomCategories;
export const calendarSelector = state => state.rooms.hotelCalendar;
export const planningsSelector = state => state.rooms.hotelPlannings || [];
export const inspectionCleanSelector = state => state.rooms.hotelInspectionRoom || [];
export const planningsNightSelector = state => state.rooms.hotelPlanningsNight;
export const planningsRunnerSelector = state => state.rooms.hotelPlanningsRunner;
export const selectPlanningsUpdates = state => state.planningUpdates.items;
export const selectRoomsUpdates = state => state.roomUpdates.items;
export const usersSelector = state => state.users.users;
export const roomNotesSelector = state => state.rooms.hotelRoomNotes;
export const catalogSelector = state => state.rooms.hotelCatalogs;
export const tasksSelector = state => state.rooms.hotelTasks;
export const historySelector = state => state.rooms.hotelHistory;
export const activeRoomSelector = state => state.rooms.activeRoom;
export const roomsUpdatesSelector = state => state.updates.rooms;
export const filtersSelector = state => state.filters;
export const inspectorFiltersSelector = state => state.inspectorFilters;
export const isRoomUpdatedSelector = state => state.rooms.updatesCount;

export const userPlannings = createSelector(
  [userSelector, planningsSelector, planningsRunnerSelector],
  (user, plannings, runnerPlannings) => {
    const { id: userId } = user;

    if (user.isAttendant) {
      return plannings.filter(p => p.planning_user_id == userId);
    } else if (user.isRoomRunner) {
      return runnerPlannings.filter(p => p.planning_user_id == userId);
    }

    return [];
  }
)

export const getIndexRooms = (hotelRooms) => keyBy(hotelRooms || [], 'id');
export const getIndexFloors = (hotelFloors) => keyBy(hotelFloors || [], 'id');
export const getIndexRoomStatuses = (hotelRoomStatuses) => keyBy(hotelRoomStatuses || [], 'id');
export const getIndexRoomHousekeepings = (hotelRoomHousekeepings) => keyBy(hotelRoomHousekeepings || [], 'roomId');
export const getIndexRoomCategories = (hotelRoomCategories) => keyBy(hotelRoomCategories || [], 'id');
export const getIndexRoomCategoriesByName = (hotelRoomCategories) => keyBy(hotelRoomCategories || [], 'label');
export const getGroupCalendar = (hotelCalendar) => groupBy(hotelCalendar || [], 'room_id');
export const getIndexPlanning = (hotelPlannings) => keyBy(hotelPlannings || [], 'room_id');
export const getIndexInspectionPlanning = (hotelInspectionRoom) => keyBy(hotelInspectionRoom || [], 'room_id');
export const getIndexUsers = (hotelUsers) => keyBy(hotelUsers || [], 'id');
export const getGroupHistory = (hotelHistory) => groupBy(hotelHistory || [], 'room_id');
export const getGroupNotes = (hotelRoomNotes, indexedHotelUsers) => {
  if (!hotelRoomNotes || !hotelRoomNotes.length) {
    return [];
  }
  const notesWithUsers = hotelRoomNotes.map(note => {
    return extend({}, note, { user: get(indexedHotelUsers, note.user_id) });
  })

  return groupBy(notesWithUsers || [], 'room_id');
}
export const getGroupTasks = (hotelTasks) => groupBy(hotelTasks, 'meta.room_id');
export const getIsPlanned = (hotelPlannings) => filter(hotelPlannings, p => get(p, 'planning_user_id.length', 0) > 0).length > 0;
export const getIndexReservations = (hotelCalendar, messages) => {
  const groupCalendar = groupBy(hotelCalendar || [], 'room_id');
  const messagesForReservation = filter(messages || [], ['isMessageForReservation', true]);
  const data = map(groupCalendar, roomCalendar => {
    const guests = calculateGuest(roomCalendar, messagesForReservation);
    const guestStatus = calculateGuestCode(roomCalendar, guests);

    return { roomCalendar, guests, ...guestStatus };
  });

  return keyBy(data, arr => get(arr, ['roomCalendar', 0, 'room_id']))
}

export const hotelMessageSelector = createSelector(
  [messagesSelector],
  (hotelMessages) => hotelMessages
);

export const getIndexRoomMessage = (hotelMessages, room) => {
  const groupRoom = groupBy(room || [], 'id');

  const messagesForRoom = filter(hotelMessages || [], ['isMessageForReservation', false]);
  const data = map(groupRoom, roomItem => {
    const roomData = first(roomItem)
    const messageForCurrent = filter(messagesForRoom, function (item) {
      const messagesRoomId = flatten(get(item, 'messageRooms', []).map(el => el.roomId));
      return messagesRoomId.includes(get(roomData, 'id', ''));
    })

    return { room_id: get(roomData, 'id', ''), messageHolder: isEmpty(messageForCurrent) ? null : flatten(messageForCurrent.map(item => get(item, 'message', ''))) }
  });

  return data;
}

export const getUserTasks = (hotelTasks, userId) => {
  if (!hotelTasks || !hotelTasks.length) {
    return [];
  }

  // console.time('getUserTasks')

  const filtered = filter(hotelTasks, task => {
    if (get(task, 'is_completed') || get(task, 'is_cancelled')) {
      return false;
    }

    if (!get(task, 'is_claimed') && includes(get(task, 'assigned.user_ids'), userId)) {
      return true;
    }

    return get(task, 'responsible_id') === userId;
  });

  // console.timeEnd('getUserTasks')
  return filtered;
}

export const getMutableRooms = (
  hotelRooms
) => map(hotelRooms, room => ({ ...room }))

export const getBasicRooms = (
  hotelRooms,
  indexFloors,
  indexRoomStatuses,
  indexRoomHousekeepings,
  indexRoomCategories,
  indexReservations,
  indexPlanning,
) => {
  if (!hotelRooms || !hotelRooms.length || isEmpty(indexFloors)) {
    return [];
  }

  let mappedRooms = []
  each(hotelRooms, room => {
    const roomId = get(room, 'id');
    const roomPlanning = get(indexPlanning, roomId, {});

    const {
      floor: floorId,
      roomStatus: roomStatusId,
      roomHousekeeping: roomHousekeepingId,
      roomCategory: roomCategoryId
    } = room;

    mappedRooms.push({
      ...room,
      floor: get(indexFloors, floorId, {}),
      roomStatus: get(indexRoomStatuses, roomStatusId, {}),
      roomHousekeeping: get(indexRoomHousekeepings, roomId, {}),
      roomCategory: get(indexRoomCategories, roomCategoryId, {}),
      roomPlanning,
      roomCalendar: get(indexReservations, [roomId, 'roomCalendar'], []),
      guests: get(indexReservations, [roomId, 'guests'], null),
      guestStatus: get(roomPlanning, 'guest_status') || get(indexReservations, [roomId, 'guestStatus'], null),
      sortValue: get(room, 'sortValue') || roomsSorting(get(room, 'name')),
    });
  });

  return mappedRooms;
}

export const getAllRooms = (
  hotelRooms,
  indexFloors,
  indexRoomStatuses,
  indexRoomHousekeepings,
  groupedCalendar,
  indexPlanning,
  groupedNotes,
  groupedTasks,
  isPlanned,
  roomsUpdates,
  userId
) => {
  if (!hotelRooms || !hotelRooms.length || isEmpty(indexFloors)) {
    return [];
  }

  let mappedRooms = []
  each(hotelRooms, room => {
    const roomId = get(room, 'id');
    const roomPlanning = get(indexPlanning, roomId, {});

    const {
      floor: floorId,
      roomStatus: roomStatusId,
      roomHousekeeping: roomHousekeepingId,
      roomCategory: roomCategoryId
    } = room;

    mappedRooms.push({
      ...room,
      floor: get(indexFloors, floorId, {}),
      roomStatus: get(indexRoomStatuses, roomStatusId, {}),
      roomHousekeeping: get(indexRoomHousekeepings, roomHousekeepingId, {}),
      roomCategory: get(indexRoomCategories, roomCategoryId, {}),
      roomPlanning,
      roomCalendar: get(indexReservations, [roomId, 'roomCalendar'], []),
      roomNotes: get(groupedNotes, roomId, []),
      roomTasks: get(groupedTasks, roomId, []),
      guests: get(indexReservations, [roomId, 'guests'], null),
      guestStatus: get(roomPlanning, 'guest_status') || get(indexReservations, [roomId, 'guestStatus'], null),
      roomCredits: get(roomPlanning, 'credits') || get(room, 'overwriteCredits') || get(room.roomCategory, 'credts') || 1,
      sortValue: get(room, 'sortValue') || roomsSorting(get(room, 'name')),
      update: get(roomsUpdates, roomId, null),
    });
  });

  return sortBy(mappedRooms, 'sortValue');
}

export const getComputedRooms = (
  hotelRooms,
  indexMessage,
  indexFloors,
  indexRoomStatuses,
  indexRoomHousekeepings,
  indexRoomCategories,
  indexReservations,
  indexPlanning,
  groupedNotes,
  groupedTasks,
  isPlanned,
  roomsUpdates,
  userId,
  roomsUpdatesCount
) => {
  if (!hotelRooms || !hotelRooms.length || isEmpty(indexFloors)) {
    return [];
  }

  // console.log('running update', roomsUpdatesCount)

  let mappedRooms = []
  each(hotelRooms, room => {
    const roomId = get(room, 'id');
    const roomPlanning = get(indexPlanning, roomId, {});

    const messageForCurrent = find(indexMessage, function (o) { return o.room_id === roomId; })

    if (isPlanned && get(roomPlanning, 'planning_user_id') !== userId) {
      return;
    }

    const roomCategoryId = get(room, 'roomCategoryName');
    const roomCategory = get(indexRoomCategories, roomCategoryId, {});

    const {
      floorId: floorId,
      roomStatusId: roomStatusId,
      roomHousekeepingId: roomHousekeepingId,
      // roomCategoryId: roomCategoryId
    } = room;

    mappedRooms.push({
      ...room,
      floor: get(indexFloors, floorId, {}),
      roomStatus: get(indexRoomStatuses, roomStatusId, {}),
      roomHousekeeping: get(indexRoomHousekeepings, roomId, {}),
      // roomCategory: get(indexRoomCategories, roomCategoryId, {}),
      roomCategory,
      roomPlanning,
      roomCalendar: get(indexReservations, [roomId, 'roomCalendar'], []),
      roomNotes: get(groupedNotes, roomId, []),
      roomTasks: get(groupedTasks, roomId, []),
      guests: get(indexReservations, [roomId, 'guests'], null),
      guestStatus: get(roomPlanning, 'guest_status') || get(indexReservations, [roomId, 'guestStatus'], null),
      guestExactStatus: get(roomPlanning, 'guestExactStatus') || get(indexReservations, [roomId, 'guestExactStatus'], null),
      roomCredits: get(roomPlanning, 'credits') || get(room, 'overwriteCredits') || get(room.roomCategory, 'credts') || 1,
      sortValue: get(room, 'sortValue') || roomsSorting(get(room, 'name')),
      update: get(roomsUpdates, roomId, null),
      roomMessage: get(messageForCurrent, 'messageHolder', null)
    });
  });

  return sortBy(mappedRooms, 'sortValue');
}

export const getComputedRoomsIndex = (hotelRooms) => keyBy(hotelRooms, 'id')

export const getAvailableFloors = (hotelRooms, indexFloors) => {
  if (!hotelRooms || !hotelRooms.length || isEmpty(indexFloors)) {
    return [];
  }

  const usedFloors = groupBy(hotelRooms, 'floorId');
  const usedFloorIds = keys(usedFloors);
  const mapped = map(usedFloorIds, (floorId, index) => {
    const floor = get(indexFloors, floorId);
    if (!get(floor, 'number')) {
      return null;
    }

    const { number, sortValue } = floor;
    const rooms = usedFloors[floorId];
    const floorName = first(uniq(compact(flatten(map(rooms, 'floorName'))), true))
    const floorSection = uniq(compact(flatten(map(rooms, 'section'))), true);
    const floorTasks = flatten(map(rooms, 'roomTasks'));
    const stats = rooms.reduce((pv, room) => {
      const guestStatus = get(room, 'guestStatus') || 'vac';
      pv[guestStatus] = pv[guestStatus] + 1;
      return pv;
    }, { da: 0, arr: 0, dep: 0, stay: 0, vac: 0 });
    const sorting = floorsSorting(number, sortValue);

    return {
      id: floorId,
      floorName,
      floor,
      rooms,
      floorSection,
      floorTasks,
      sorting,
      stats
    }
  }).filter(Boolean);

  return sortBy(mapped, 'sorting');
}

export const getActiveRoom = (hotelRooms, activeRoom) => {
  if (!hotelRooms || !hotelRooms.length) {
    return null;
  }

  return find(hotelRooms, { id: activeRoom }) || null;
}

export const getCatalogByActiveRoom = (hotelCatalog, activeRoom) => {
  if (!hotelCatalog || !hotelCatalog.length) {
    return [];
  }

  return filter(hotelCatalog, { roomId: activeRoom });
}

export const getTasks = (hotelTasks, indexUsers) => {
  if (!hotelTasks || !hotelTasks.length) {
    return [];
  }

  return hotelTasks.map(task => {
    return extend({}, task, {
      creator: task.creator_id && get(indexUsers, task.creator_id),
      responsible: task.responsible_id && get(indexUsers, task.responsible_id),
    });
  })
}

export const getAllNotificationTasks = (hotelTasks) => {
  const today = moment().format('YYYY-MM-DD');
  return filter(hotelTasks, task => get(task, 'type') === 'notification' && today === get(task, 'due_date'));
}

export const getNotificationTasks = (hotelTasks, userId) => {
  const today = moment().format('YYYY-MM-DD');
  return filter(hotelTasks, task => get(task, 'type') === 'notification' && get(task, 'assigned.user_ids', []).includes(userId) && today === get(task, 'due_date'));
}

export const getPopupNotificationTasks = (notificationTasks) => {
  return filter(notificationTasks, n => !n.is_completed);
}

export const getOpenTasks = (hotelTasks, userId) => {
  if (!hotelTasks || !hotelTasks.length) {
    return [];
  }

  return filter(hotelTasks, task => get(task, 'type') !== 'notification' && !get(task, 'is_completed') && !get(task, 'is_cancelled') && get(task, 'type') !== 'notification' && !get(task, 'is_rejected') && !includes(get(task, 'assigned.rejected_ids', []), userId));
}

export const getPopupTasks = (hotelTasks, hotelRooms, userId) => {
  if (!hotelTasks || !hotelTasks.length) {
    return [];
  }

  const today = moment().format('YYYY-MM-DD');

  // return filter(hotelTasks, task => get(task, 'type') !== 'notification' && today === get(task, 'due_date') && !get(task, 'is_claimed') && !includes(get(task, 'assigned.rejected_ids', []), userId));
  const filteredTask = filter(hotelTasks, task => get(task, 'type') !== 'notification' && today === get(task, 'due_date') && !get(task, 'is_claimed') && !includes(get(task, 'assigned.rejected_ids', []), userId));

  const taskArray = filteredTask.map(item => ({
    ...item,
    roomName: get(find(hotelRooms, ['id', get(item, 'meta.room_id', '')], {}), 'name', '')
  }))
  return taskArray;
}

export const getFilteredRooms = (hotelRooms, filters) => {
  if (!hotelRooms || !hotelRooms.length) {
    return [];
  }

  if (!filters.isActiveFilter) {
    return hotelRooms;
  }

  console.log('getFilteredRooms running')

  let filtered = hotelRooms;
  if (filters.roomsSearchQuery) {
    const cleanQuery = filters.roomsSearchQuery.toLowerCase();
    filtered = filtered.filter(room => {
      const matchesGuest = get(room, 'roomCalendar', []).reduce((pv, entry) => {
        if (get(entry, 'guest_name', '').toLowerCase().includes(cleanQuery)) {
          pv = true;
        }
        return pv;
      }, false);

      return matchesGuest || room.name.toLowerCase().includes(cleanQuery);
    });
  }
  if (filters.activeFloor) {
    filtered = filtered.filter(room => {
      return room.floor.id === filters.activeFloor;
    });
  }
  if (filters.activeSection) {
    filtered = filtered.filter(room => {
      return room.section === filters.section;
    });
  }
  if (filters.activeRooms && filters.activeRooms.length) {
    filtered = filtered.filter(room => {
      return filters.activeRooms.includes(room.id);
    });
  } else if (filters.activeRooms.length <= 0) {
    const cleanQuery = filters.roomsSearchQuery.toLowerCase();
    if (!cleanQuery) {
      filtered = [];
    }
  }

  return filtered;
}

const handleRoomTypeData = (roomType, filtered) => {
  switch (roomType) {
    case 'All':
      return filtered;

    case 'Public':
      const publicRoom = filter(filtered, function (o) {
        return get(o, 'roomCategory.isBedroomSpace', false) === false
      })
      return publicRoom;

    case 'Private':
      const privateRoom = filter(filtered, function (o) {
        return get(o, 'roomCategory.isBedroomSpace', false) === true
      })
      return privateRoom;

    default:
      break;
  }
}

const generateFilterArrays = (rooms) => {
  let filter1Status = [
    "departure", "departed", "arrivals", "arrived"
  ].reduce((pv, i) => { pv[i] = { rooms: [] }; return pv }, {});

  let filter2Status = [
    "stay", "sheet"
  ].reduce((pv, i) => { pv[i] = { rooms: [] }; return pv }, {});

  let filter3Status = [
    "occupied", "vacant", "arrived", "arrivals"
  ].reduce((pv, i) => { pv[i] = { rooms: [] }; return pv }, {});

  let filter4Status = [
    "HouseUse", "OOO/OOS"
  ].reduce((pv, i) => { pv[i] = { rooms: [] }; return pv }, {});

  let filter5Status = [
    "Dirty", "Clean", "Inspected", "Pick Up"
  ].reduce((pv, i) => { pv[i] = { rooms: [] }; return pv }, {});

  let filter6Status = [
    "DND", "Refuse", "Later", "Finished", "inProgress"
  ].reduce((pv, i) => { pv[i] = { rooms: [] }; return pv }, {});

  const result = rooms.map((room, index) => {
    let status = "OTH";
    let hk = "O";

    const roomGuestStatus = get(room, 'guestExactStatus');
    // const dueInGuest = includes(map(get(room, 'guests', []), 'status'), 'arrival');
    const dueInGuest = map(get(room, 'guests', []), 'status');

    if (!isEmpty(dueInGuest)) {
      dueInGuest.forEach(item => {
        if (item === 'arrival') {
          filter1Status['arrivals'].rooms.push(room);
          filter3Status['arrivals'].rooms.push(room);
        } else if (item === 'stay') {
          filter2Status['stay'].rooms.push(room);
          filter3Status['arrivals'].rooms.push(room);
          filter3Status['occupied'].rooms.push(room);
        } else if (item === 'departure') {
          filter1Status['departure'].rooms.push(room);
        } else if (item === 'departed') {
          filter1Status['departed'].rooms.push(room);
        } else if (item === 'arrived') {
          filter1Status['arrived'].rooms.push(room);
          filter3Status['arrived'].rooms.push(room);
        }
      })
    } else {
      if (roomGuestStatus === 'stay') {
        filter1Status['arrivals'].rooms.push(room);
        filter2Status['stay'].rooms.push(room);
        filter3Status['arrivals'].rooms.push(room);
        filter3Status['occupied'].rooms.push(room);
      } else if (roomGuestStatus === 'departure') {
        filter1Status['departure'].rooms.push(room);
      } else if (roomGuestStatus === 'departed') {
        filter1Status['departed'].rooms.push(room);
      } else if (roomGuestStatus === 'arrived') {
        filter1Status['arrived'].rooms.push(room);
        filter3Status['arrived'].rooms.push(room);
      }
    }

    // const roomFilter2Status = get(room, 'guests.status')
    if (get(room, 'isChangeSheets') === true) {
      filter2Status['sheet'].rooms.push(room);
    }

    const roomStatusCode = get(room, 'roomStatus.code')
    if (roomStatusCode === 'OCC') {
      filter3Status['occupied'].rooms.push(room);
    } else if (roomStatusCode === 'VAC') {
      filter3Status['vacant'].rooms.push(room);
    }

    const guests = get(room, 'guests') || [];
    if (["OOO", "OOS"].includes(get(room, 'roomHousekeeping.code'))) {
      filter4Status['OOO/OOS'].rooms.push(room);
    } if (guests.length > 0) {
      const houseUseRoom = guests.filter(item => String(item.name).toLowerCase() === 'HouseUse'.toLowerCase());
      if (houseUseRoom.length > 0) {
        filter4Status['HouseUse'].rooms.push(room);
      }
    }

    if (get(room, 'roomHousekeeping.code', '').indexOf("HCI") !== -1) {
      filter5Status['Inspected'].rooms.push(room);
    } else if (get(room, 'roomHousekeeping.code', '').indexOf("HC") !== -1) {
      filter5Status['Clean'].rooms.push(room);
    } else if (get(room, 'roomHousekeeping.code', '').indexOf("HD") !== -1) {
      filter5Status['Dirty'].rooms.push(room);
    }

    const roomAttendantStatus = get(room, 'attendantStatus').toLowerCase();
    const plannedUser = get(room, 'plannedUser');

    if (roomAttendantStatus === 'dnd') {
      filter6Status['DND'].rooms.push(room);
    } else if (roomAttendantStatus === 'refuse') {
      filter6Status['Refuse'].rooms.push(room);
    } else if (roomAttendantStatus === 'delay') {
      filter6Status['Later'].rooms.push(room);
    } else if (roomAttendantStatus === 'finish') {
      filter6Status['Finished'].rooms.push(room);
    } else if (roomAttendantStatus === 'finish') {
      filter6Status['paused'].rooms.push(room);
    } else if (roomAttendantStatus === 'cleaning') {
      filter6Status['inProgress'].rooms.push(room);
    }

    if (rooms.length === (index + 1)) {
      const allFilterStatus = {
        filter1Status,
        filter2Status,
        filter3Status,
        filter4Status,
        filter5Status,
        filter6Status
      }

      return allFilterStatus;
    }
  })

  return compact(result)
}

export const getInspectorFilteredRooms = (hotelRooms, filters) => {
  if (!hotelRooms || !hotelRooms.length) {
    return [];
  }

  const privateRoom = filter(hotelRooms, ['isBedroomSpace', true]);
  let roomFilterData = first(generateFilterArrays(privateRoom));

  if (!filters.isActiveFilter) {
    const resultPayload = {
      filteredRoom: privateRoom,
      roomFilteredData: roomFilterData
    }
    return resultPayload;
  }

  const filterOperation = get(filters, 'filterOperation', []);
  const roomTypeOperation = get(filterOperation, 'roomTypeOperation', []);
  const floorOperation = get(filterOperation, 'floorOperation', []);
  const floorSectionOperation = get(filterOperation, 'floorSectionOperation', []);
  const roomOperation = get(filterOperation, 'roomOperation', []);
  const isroomTypeAll = includes(roomTypeOperation, 'All');

  let filtered = privateRoom;
  if (isroomTypeAll) {
    filtered = hotelRooms
  } else {
    filtered = uniqBy(flatten(roomTypeOperation.map((roomType) => handleRoomTypeData(roomType, filtered)), ''), 'id');
  }

  let roomTypeRoom = filtered;
  console.log('getFilteredRooms running')

  if (get(filters, 'isHeaderFilter', false)) {
    filtered = filtered.filter(room => {
      return filters.activeRooms.includes(room.id);
    });
  }
  if (filters.roomsSearchQuery) {
    const cleanQuery = filters.roomsSearchQuery.toLowerCase();
    filtered = filtered.filter(room => {
      const matchesGuest = get(room, 'roomCalendar', []).reduce((pv, entry) => {
        if (get(entry, 'guest_name', '').toLowerCase().includes(cleanQuery)) {
          pv = true;
        }
        return pv;
      }, false);

      return matchesGuest || room.name.toLowerCase().includes(cleanQuery);
    });
  }
  if (get(floorOperation, 'length') > 0) {
    filtered = roomTypeRoom.filter(room => {
      return includes(floorOperation, room.floor.id)
    });
  }
  if (get(floorSectionOperation, 'length') > 0) {
    const filteredBySection = roomTypeRoom.filter(room => {
      const mapFloorId = map(floorSectionOperation, 'floorId');
      if (includes(mapFloorId, room.floor.id)) {
        const mapSectionData = get(first(filter(floorSectionOperation, function (o) { return o.floorId === room.floor.id })), 'roomSection');
        if (mapSectionData) {
          if (includes(mapSectionData, room.section)) {
            return true
          }
        }
      }
    })

    if (get(floorOperation, 'length') > 0) {
      filtered = uniqBy(concat(filtered, filteredBySection), 'id');
    } else {
      filtered = filteredBySection;
    }
  }
  if (get(roomOperation, 'length') > 0) {
    try {
      roomFilterData = first(generateFilterArrays(filtered));
      const selectedData = map(roomOperation, function (obj) {
        if (get(obj, 'rootType') === 1) {
          const selectFilterType = roomFilterData[Object.keys(roomFilterData)[get(obj, 'filterType') - 1]];
          const selectedFilterIndex = selectFilterType[Object.keys(selectFilterType)[get(obj, 'selectedIndex')]];

          const selectionRooms = uniqBy(get(selectedFilterIndex, 'rooms'), 'id');
          return selectionRooms;
        } else if (get(obj, 'rootType') === 2) {
          const selectFilterType = roomFilterData[Object.keys(roomFilterData)[get(obj, 'filterType') - 1]];
          const selectedFilterIndex = selectFilterType[Object.keys(selectFilterType)[get(obj, 'selectedIndex')]];

          const selectionRooms = uniqBy(get(selectedFilterIndex, 'rooms'), 'id');
          return selectionRooms;
        }
      })

      filtered = _.intersection.apply(_, selectedData);
    } catch (error) {

    }

  }

  roomFilterData = first(generateFilterArrays(filtered));

  const resultPayload = {
    filteredRoom: filtered,
    roomFilteredData: roomFilterData
  }

  return resultPayload;
}

export const computedIndexRooms = createDeepEqualSelector([roomsSelector], getIndexRooms);
export const computedIndexFloors = createDeepEqualSelector([floorsSelector], getIndexFloors);
export const computedIndexRoomStatuses = createDeepEqualSelector([roomStatusesSelector], getIndexRoomStatuses);
export const computedIndexRoomHousekeepings = createDeepEqualSelector([roomHousekeepingsSelector], getIndexRoomHousekeepings);
export const computedIndexRoomCategories = createDeepEqualSelector([roomCategoriesSelector], getIndexRoomCategories);
export const computedIndexRoomCategoriesByName = createDeepEqualSelector([roomCategoriesSelector], getIndexRoomCategoriesByName);
export const computedGroupCalendar = createDeepEqualSelector([calendarSelector], getGroupCalendar);
export const computedIndexUsers = createDeepEqualSelector([usersSelector], getIndexUsers);
export const computedGroupNotes = createDeepEqualSelector([roomNotesSelector, computedIndexUsers], getGroupNotes);
export const computedGroupHistory = createDeepEqualSelector([historySelector], getGroupHistory);
export const computedIndexReservations = createDeepEqualSelector([calendarSelector, messagesSelector], getIndexReservations);
export const computedIndexRoomMessage = createDeepEqualSelector([messagesSelector, roomsSelector], getIndexRoomMessage);

export const computedTasks = createDeepEqualSelector(
  [tasksSelector, computedIndexUsers],
  // makeProfile(getTasks, 'getTasks')
  getTasks
);

export const computedAllNotifications = createSelector(
  [computedTasks],
  getAllNotificationTasks
);

export const computedNotifications = createSelector(
  [computedTasks, userIdSelector],
  getNotificationTasks
);

export const computedPopupNotifications = createSelector(
  [computedNotifications],
  getPopupNotificationTasks
)

export const computedUserTasks = createSelector(
  [computedTasks, userIdSelector],
  getUserTasks
);

export const computedPopupTasks = createSelector(
  [computedUserTasks, roomsSelector, userIdSelector],
  getPopupTasks
);

export const computedGroupTasks = createDeepEqualSelector([computedTasks], getGroupTasks);

export const computedIndexPlanning = createDeepEqualSelector([planningsSelector], getIndexPlanning);
export const computedIndexInspectionPlanning = createDeepEqualSelector([inspectionCleanSelector], getIndexInspectionPlanning);

export const computedIndexRunnerPlanning = createDeepEqualSelector([planningsRunnerSelector], getIndexPlanning);
export const computedIndexNightPlanning = createDeepEqualSelector([planningsNightSelector], getIndexPlanning);

export const computedIsPlanned = createDeepEqualSelector([planningsSelector], getIsPlanned);
export const computedIsRunnerPlanned = createDeepEqualSelector([planningsRunnerSelector], getIsPlanned);
export const computedIsNightPlanned = createDeepEqualSelector([planningsNightSelector], getIsPlanned);

export const computedMutableRooms = createSelector(
  [roomsSelector],
  // makeProfile(getMutableRooms, 'getMutableRooms')
  getMutableRooms
)

export const computedHotelRooms = createSelector(
  [
    roomsSelector,
    computedIndexRoomMessage,
    computedIndexFloors,
    computedIndexRoomStatuses,
    computedIndexRoomHousekeepings,
    computedIndexRoomCategories,
    computedIndexReservations,
    computedIndexPlanning,
    computedGroupNotes,
    computedGroupTasks,
    computedIsPlanned,
    roomsUpdatesSelector,
    userIdSelector
  ],
  getComputedRooms
);

export const allHotelRooms = createSelector(
  [
    roomsSelector,
    computedIndexRoomMessage,
    computedIndexFloors,
    computedIndexRoomStatuses,
    computedIndexRoomHousekeepings,
    // computedIndexRoomCategories,
    computedIndexRoomCategoriesByName,
    computedIndexReservations,
    computedIndexPlanning,
    computedGroupNotes,
    computedGroupTasks,
    () => false,
    roomsUpdatesSelector,
    userIdSelector
  ],
  getComputedRooms
);

// export const basicHotelRooms = createSelector(
//   [
//     roomsSelector,
//     computedIndexFloors,
//     computedIndexRoomStatuses,
//     computedIndexRoomHousekeepings,
//     computedIndexRoomCategories,
//     computedIndexReservations,
//     computedIndexPlanning
//   ],
//   getBasicRooms
// )

export const basicHotelRooms = createSingleTruthSelector(
  [
    roomsSelector,
    computedIndexFloors,
    computedIndexRoomStatuses,
    computedIndexRoomHousekeepings,
    computedIndexRoomCategories,
    computedIndexReservations,
    computedIndexPlanning,
    isRoomUpdatedSelector
  ],
  getBasicRooms
)

export const hotelRoomsIndex = createSelector(
  [roomsSelector],
  (rooms) => keyBy(rooms, 'id')
);

export const computedHotelRoomsIndex = createSelector(
  [computedHotelRooms],
  // makeProfile(getComputedRoomsIndex, 'getComputedRoomsIndex')
  getComputedRoomsIndex
)

export const allHotelRoomsIndex = createSelector(
  [allHotelRooms],
  // makeProfile(getComputedRoomsIndex, 'getComputedRoomsIndex')
  getComputedRoomsIndex
)

export const basicHotelRoomsIndex = createSelector(
  [basicHotelRooms],
  // makeProfile(getComputedRoomsIndex, 'getComputedRoomsIndex')
  getComputedRoomsIndex
)

export const computedActiveRoom = createSelector(
  [computedHotelRooms, activeRoomSelector],
  // makeProfile(getActiveRoom, 'getActiveRoom')
  getActiveRoom
);


export const getRoomById = (id) => createSelector(
  [allHotelRoomsIndex],
  (hotelRoomsIndex) => {
    return get(hotelRoomsIndex, id, null)
  }
);

export const computedAvailableFloors = createSelector(
  [computedHotelRooms, computedIndexFloors],
  // makeProfile(getAvailableFloors, 'getAvailableFloors')
  getAvailableFloors
);

export const computedAllFloors = createSelector(
  [allHotelRooms, computedIndexFloors],
  // makeProfile(getAvailableFloors, 'getAvailableFloors')
  getAvailableFloors
)

export const computedCatalogByActiveRoom = createSelector(
  [catalogSelector, activeRoomSelector],
  // makeProfile(getCatalogByActiveRoom, 'getCatalogByActiveRoom')
  getCatalogByActiveRoom
);

export const getCatalogByRoomId = (id) => createSelector(
  [catalogSelector],
  (hotelCatalog) => {
    if (!hotelCatalog || !hotelCatalog.length) {
      return [];
    }

    return filter(hotelCatalog, { roomId: id });
  }
);

export const planningsForUser = createSelector(
  [planningsSelector, userIdSelector],
  (plannings, userId) => plannings.filter(p => p.planning_user_id === userId)
)

export const attendantRooms = createSelector(
  [planningsForUser, roomsSelector],
  (plannings, rooms) => {
    if (!plannings.length) {
      return []
    }
    return plannings.map(p => rooms.find(room => room.id === p.room_id)).filter(r => !!r)
  }
)

export const planningsUpdatesSelector = createSelector(
  [selectPlanningsUpdates],
  (updates) => {
    const plannings = values(updates)
    return plannings.filter(p => !p.alertWasRead)
  }
)

export const roomMessageUpdatesSelector = createSelector(
  [selectRoomsUpdates],
  (updates) => {
    const rooms = values(updates)
    return rooms.filter(p => !p.alertWasRead)
  }
)
