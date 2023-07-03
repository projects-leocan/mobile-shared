import { createSelector } from 'reselect';
import I18n from 'react-native-i18n';
import { find, sortBy } from 'lodash/collection';
import { get } from 'lodash/object';
import { isPlainObject } from 'lodash/lang';

import { computedIndexedUsers, usersMapped, groupsSelector } from 'rc-mobile-base/lib/selectors/users';
import { durableAssetsSelector } from 'rc-mobile-base/lib/selectors/assets';
import { userIdSelector } from 'rc-mobile-base/lib/selectors/auth';

import { assignedTasks, backlogTasks, closedTasks, sentAssignedTasks, sentTasks } from 'rc-mobile-base/lib/layouts/Tasks/selectors';
import { Category, Filtering } from 'rc-mobile-base/lib/utils/tasks';
import { createSingleTruthSelector } from 'rc-mobile-base/lib/utils/redux-tools/selectors';
import { map, keyBy } from 'lodash';

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
    if (screenprops?.isAttendantApp) {
      totalUsers = users
        .filter(user => user.isAttendant);
    }
    if (screenprops?.isRunnerApp) {
      totalUsers = users
        .filter(user => user.isRoomRunner);
    }


    return [
      {
        title:screenprops?.isAttendantApp? I18n.t('runner.components.assignment-select.attendants') : I18n.t('runner.components.assignment-select.runners'),
        data: totalUsers
      },
      // {
      //   title: 'Groups',
      //   data: groups.map(group => ({ ...group, isGroup: true }))
      // }
    ]
  }
)

export const taskAssetSelector = (task) => createSelector(
  [durableAssetsSelector],
  (assets) => {
    return task && find(assets, asset => asset.name === task.asset || (asset.aliases || []).includes(task.asset)) || null;
  }
)