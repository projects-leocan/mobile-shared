import I18n from 'react-native-i18n';
import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';
import { sortBy, filter, map, groupBy, includes } from 'lodash/collection';
import { get, omit } from 'lodash/object';

import { sort } from 'rc-mobile-base/lib/utils/immutable';
import { floorsSorting, roomsSorting } from 'rc-mobile-base/lib/utils/sorting';

import { allHotelRooms } from 'rc-mobile-base/lib/selectors/rooms';
import { usersSelector, groupsSelector } from 'rc-mobile-base/lib/selectors/users';
import userType from 'rc-mobile-base/lib/utils/user-type';
import { first, flatten, uniqBy, intersection, compact } from 'lodash/array';
import { isEmpty } from 'lodash/lang';

const userSelector = state => state.auth.user;
const configSelector = state => state.auth.config;
const assigneeGroupSelector = state => state.filters.activeAssigneeGroup;
const originalAssigneeGroupSelector = state => state.filters.assigneeGroup;

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

export const assigneeBySearch = createSelector(
  [usersSelector, assigneeGroupSelector, originalAssigneeGroupSelector, assignmentSearchForm],
  (users, assigneeGroup, originalAssigneeGroup,  assignmentSearch) => {
    let validateUser = users;
    let validateUsersId = []
    let isSearchEnable = assignmentSearch && assignmentSearch.search;
    let trueResultHolder = [];

    if (isSearchEnable) {
      const cleanSearch = assignmentSearch.search.toLowerCase();
      validateUser = users.filter(obj => get(obj, 'first_name', '').toLowerCase().includes(cleanSearch) || get(obj, 'last_name', '').toLowerCase().includes(cleanSearch));
      validateUsersId = map(validateUser, 'id');

      const resultHolder = map(originalAssigneeGroup, function (assignee) {
        const validateGroupUsers = filter(get(assignee, 'groupUsers', []), function (groupUser) { return includes(validateUsersId, get(groupUser, 'value', null)); });

        const mapSubGroup = compact(map(get(assignee, 'userSubGroup', []), function (subGroup) {
          const validateSubGroupUsers = filter(get(subGroup, 'subGroupUsers', []), function (subGroupUser) { return includes(validateUsersId, get(subGroupUser, 'value', null)); });

          if (!isEmpty(validateSubGroupUsers)) {
            return {
              ...subGroup,
              subGroupUsers: validateSubGroupUsers
            }
          } else {
            return null
          }
        }))

        if (isSearchEnable) {
          const isUserAvailableForSubGroup = get(compact(flatten(map(mapSubGroup, 'subGroupUsers'))), 'length') > 0
          if (get(validateGroupUsers, 'length') > 0 || isUserAvailableForSubGroup) {
            return {
              ...assignee,
              groupUsers: validateGroupUsers,
              userSubGroup: mapSubGroup
            }
          } else {
            return null
          }
        }
      })

      return compact(resultHolder)
    } else {
      return originalAssigneeGroup
    }

  }
)

export const assignmentSelectorForModal = (type) => createSelector(
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

    let validateUser = users;
    let isSearchEnable = assignmentSearch && assignmentSearch.search;
    if (isSearchEnable) {
      const cleanSearch = assignmentSearch.search.toLowerCase();
      validateUser = users.filter(obj => get(obj, 'first_name', '').toLowerCase().includes(cleanSearch) || get(obj, 'last_name', '').toLowerCase().includes(cleanSearch))
    }

    const groupUserById = groupBy(validateUser, 'id');
    const userGroupByType = groupBy(groups, 'typeKey');
    const TrueSubGroup = get(userGroupByType, 'USER_SUB_GROUP');

    const groupSubGroup = groupBy(TrueSubGroup, 'userGroupId');
    const TrueGroup = map(get(userGroupByType, 'USER_GROUP'), function (o) {
      return {
        ...o,
        userSubGroup: groupSubGroup[get(o, 'userGroupId', null)]
      }
    });

    options = map(TrueGroup, function (group) {
      const groupUsers = compact(map(get(group, 'userIds', []), function (userId) {
        const userData = first(groupUserById[userId]);
        if (userData) {
          return {
            username: get(userData, 'username'),
            name: get(userData, 'first_name', '') + ' ' + get(userData, 'last_name', ''),
            value: userId,
            type: 'User',
            groupId: get(group, 'id'),
          }
        }
      }))

      const userSubGroup = compact(map(get(group, 'userSubGroup', []), function (subGroup) {
        const subGroupUsers = compact(map(get(subGroup, 'userIds', []), function (userId) {
          const userData = first(groupUserById[userId])
          if (userData) {
            return {
              username: get(userData, 'username'),
              name: get(userData, 'first_name', '') + ' ' + get(userData, 'last_name', ''),
              value: userId,
              type: 'User',
              groupId: get(group, 'id'),
              subGroupId: get(subGroup, 'id')
            }
          }
        }))

        if (isSearchEnable) {
          if (get(subGroupUsers, 'length') > 0) {
            return {
              name: get(subGroup, 'name'),
              value: get(subGroup, 'id'),
              groupId: get(group, 'id'),
              type: 'sub group',
              typeKey: subGroup.typeKey,
              subGroupUsers: subGroupUsers
            }
          }
        } else {
          return {
            name: get(subGroup, 'name'),
            value: get(subGroup, 'id'),
            groupId: get(group, 'id'),
            type: 'sub group',
            typeKey: subGroup.typeKey,
            subGroupUsers: subGroupUsers
          }
        }


      }))

      if (isSearchEnable) {
        const isUserAvailableForSubGroup = get(compact(flatten(map(userSubGroup, 'subGroupUsers'))), 'length') > 0
        if (get(groupUsers, 'length') > 0 || isUserAvailableForSubGroup) {
          return {
            name: get(group, 'name'),
            value: get(group, 'id'),
            type: 'group',
            typeKey: group.typeKey,
            groupUsers: groupUsers,
            userSubGroup: userSubGroup
          }
        } else {
          return null
        }
      } else {
        return {
          name: get(group, 'name'),
          value: get(group, 'id'),
          type: 'group',
          typeKey: group.typeKey,
          groupUsers: groupUsers,
          userSubGroup: userSubGroup
        }
      }


    })

    return compact(options);
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