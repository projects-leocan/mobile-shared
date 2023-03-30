import { createSelector } from 'reselect';
import I18n from 'react-native-i18n';
import { find, sortBy } from 'lodash/collection';
import { get } from 'lodash/object';
import { isPlainObject } from 'lodash/lang';

import { computedIndexedUsers, usersMapped, groupsSelector } from 'rc-mobile-base/lib/selectors/users';
import { durableAssetsSelector } from 'rc-mobile-base/lib/selectors/assets';
import { userIdSelector } from 'rc-mobile-base/lib/selectors/auth';

import { assignedTasks, sentAssignedTasks } from 'rc-mobile-base/lib/layouts/Tasks/selectors';
import { Category, Filtering } from 'rc-mobile-base/lib/utils/tasks';
import { createSingleTruthSelector } from 'rc-mobile-base/lib/utils/redux-tools/selectors';
import { map, keyBy } from 'lodash';

const roomsUpdatesCountSelector = state => state.rooms.updatesCount;

export const tasksForDisplayIndex = createSelector(
  [assignedTasks],
  (tasks) => keyBy(tasks, 'uuid')
)

export const tasksSendForDisplayIndex = createSelector(
  [sentAssignedTasks],
  (tasks) => keyBy(tasks, 'uuid')
)

export const currentTask = (id) => createSingleTruthSelector(
  [tasksForDisplayIndex, computedIndexedUsers, userIdSelector, roomsUpdatesCountSelector],
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

// console.log('1.2', usersMapped, groupsSelector)
export const assignmentOptionsSelector = (screenprops) => createSelector(
  [usersMapped, groupsSelector],
  (users, groups) => {
    let maintenanceUsers = []

    if (screenprops?.screenProps?.isRunnerApp) {
      maintenanceUsers = users
        .filter(user => user.isAttendant);
    }

    return [
      // {
      //   title: I18n.t('base.ubiquitous.maintenance-team'),
      //   data: [
      //     {
      //       _id: "Maintenance Team",
      //       username: "Maintenance",
      //       fullName: I18n.t('base.ubiquitous.maintenance-team'),
      //       isTeam: true
      //     }
      //   ]
      // },
      {
        title: I18n.t('runner.components.assignment-select.maintenance'),
        data: maintenanceUsers
      },
      // {
      //   title: 'Groups',
      //   data: groups.map(group => ({ ...group, isGroup: true }))
      // }
    ]
  }
)

// console.log('1.3', durableAssetsSelector)
export const taskAssetSelector = (task) => createSelector(
  [durableAssetsSelector],
  (assets) => {
    return task && find(assets, asset => asset.name === task.asset || (asset.aliases || []).includes(task.asset)) || null;
  }
)