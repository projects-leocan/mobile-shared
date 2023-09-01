import { createSelector } from 'reselect';
import I18n from 'react-native-i18n';
import { find, sortBy,groupBy } from 'lodash/collection';
import { get } from 'lodash/object';
import { isPlainObject } from 'lodash/lang';

import { computedIndexedUsers, usersMapped, groupsSelector } from 'rc-mobile-base/lib/selectors/users';
import { durableAssetsSelector } from 'rc-mobile-base/lib/selectors/assets';
import { userIdSelector } from 'rc-mobile-base/lib/selectors/auth';

import { assignedTasks, backlogTasks, closedTasks, sentAssignedTasks, sentTasks } from 'rc-mobile-base/lib/layouts/Tasks/selectors';
import { Category, Filtering } from 'rc-mobile-base/lib/utils/tasks';
import { createSingleTruthSelector } from 'rc-mobile-base/lib/utils/redux-tools/selectors';
import { map, keyBy } from 'lodash';
import { first, flatten, uniqBy, intersection, compact } from 'lodash/array';

const roomsUpdatesCountSelector = state => state.rooms.updatesCount;

export const tasksForDisplayIndex = createSelector(
  [assignedTasks],
  (tasks) => keyBy(tasks, 'uuid')
)

export const taskForBacklogIndex = createSelector(
  [backlogTasks],
  (tasks) => keyBy(tasks, 'uuid')
)


export const getClosedTaskIndex = createSelector(
  [closedTasks],
  (tasks) => keyBy(tasks, 'uuid')
)


export const tasksSendForDisplayIndex = createSelector(
  [sentAssignedTasks],
  (tasks) => keyBy(tasks, 'uuid')
)

export const currentTask = (id, activeTab) => createSingleTruthSelector(
  [activeTab === 0 ? tasksForDisplayIndex : activeTab === 1 ? taskForBacklogIndex : activeTab === 3 ? getClosedTaskIndex : tasksForDisplayIndex, computedIndexedUsers, userIdSelector, roomsUpdatesCountSelector],
  (tasks, users, userId) => {
    const task = tasks[id]

    if (!task) {
      return null
    }

    const messages = get(task, 'messages', []);
    const mapTaskList = get(task, 'task', '').split(',');
    const mapTasksName = map(mapTaskList, function (obj) { return String(obj).trim() });
    const mapTaskNameArray = map(mapTaskList, function (obj) {
      const [asset, action = ''] = String(obj).trim()
        .split(/\s+(?:x)\s+/)
        .map(v => v.trim())

      return {
        asset: asset,
        action: action
      }
    })

    const mapAsset = map(mapTaskNameArray, 'asset');
    const mapAction = map(mapTaskNameArray, 'action');

    const fullMessages = isPlainObject(messages) ? [] : messages.map(message => {
      const user = users[message.user_id] || {};
      return {
        ...message,
        user
      }
    })
    const messagesSorted = sortBy(fullMessages, 'date_ts').reverse();
    const category = Category.get(task, userId);
    const isClosed = Filtering.isClosed(task);

    return {
      ...task,
      fullMessages: messagesSorted,
      category,
      isClosed,
      mapTasksName: mapTasksName,
      asset: mapAsset,
      action: mapAction
    }
  }
)

export const userSentTask = (id) => createSingleTruthSelector(
  [tasksSendForDisplayIndex, computedIndexedUsers, userIdSelector, roomsUpdatesCountSelector],
  (tasks, users, userId) => {
    const task = tasks[id]

    if (!task) {
      return null
    }

    const messages = get(task, 'messages', []);
    const mapTaskList = get(task, 'task', '').split(',');
    const mapTasksName = map(mapTaskList, function (obj) { return String(obj).trim() });
    const mapTaskNameArray = map(mapTaskList, function (obj) {
      const [asset, action = ''] = String(obj).trim()
        .split(/\s+(?:x)\s+/)
        .map(v => v.trim())

      return {
        asset: asset,
        action: action
      }
    })

    const mapAsset = map(mapTaskNameArray, 'asset');
    const mapAction = map(mapTaskNameArray, 'action');

    const fullMessages = isPlainObject(messages) ? [] : messages.map(message => {
      const user = users[message.user_id] || {};
      return {
        ...message,
        user
      }
    })
    const messagesSorted = sortBy(fullMessages, 'date_ts').reverse();
    const category = Category.get(task, userId);
    const isClosed = Filtering.isClosed(task);

    return {
      ...task,
      fullMessages: messagesSorted,
      category,
      isClosed,
      mapTasksName: mapTasksName,
      asset: mapAsset,
      action: mapAction
    }
  }
)

export const assignmentOptionsSelector = (screenprops) => createSelector(
  [usersMapped, groupsSelector],
  (users, groups) => {

    let totalUsers = []
    let temp = []
    let options = []

    if (screenprops?.isAttendantApp) {
      totalUsers = users
        .filter(user => user.isAttendant);
    }
    if (screenprops?.isRunnerApp) {
      totalUsers = users
        .filter(user => user);
      const groupUserById = groupBy(totalUsers, 'id');
      //console.log(groupUserById,'grouping user by id')
      const userGroupByType = groupBy(groups, 'typeKey');
      const TrueSubGroup = get(userGroupByType, 'USER_SUB_GROUP');

      const groupSubGroup = groupBy(TrueSubGroup, 'userGroupId');
      const TrueGroup = map(get(userGroupByType, 'USER_GROUP'), function (o) {
        return {
          ...o,
          userSubGroup: groupSubGroup[get(o, 'userGroupId', null)]
        }
      });
      //console.log(TrueGroup,'truegroup')
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
        //console.log(groupUsers,'groupuser')
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
          //console.log(userSubGroup,'usersubgroup')
          //console.log(subGroupUsers,'subgroupuser')
          
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
           else {
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
          } 
          else{
            return{
              name: get(group,'name'),
              value: get(group,'id'),
              type: 'group',
              typeKey:group.typeKey,
              groupUsers:groupUsers,
              userSubGroup:userSubGroup
            }
          }
        //  console.log(isUserAvailableForSubGroup,'isuseravailableforsubgroup')
  
      })
      //console.log(options,'options')
      
  
    }
    return(options)

    // return [
    //   {
    //     title: screenprops?.isAttendantApp ? I18n.t('runner.components.assignment-select.attendants') : I18n.t('runner.components.assignment-select.runners'),
    //     data: options,
    //   },
      
    // ]
  }
)

export const taskAssetSelector = (task) => createSelector(
  [durableAssetsSelector],
  (assets) => {
    return task && find(assets, asset => asset.name === task.asset || (asset.aliases || []).includes(task.asset)) || null;
  }
)