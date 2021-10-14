import I18n from 'react-native-i18n'
import { get } from 'lodash/object';

import {
  taskCompleted,
  taskStarted,
  taskAccepted,
  taskWaiting,
  taskPending,
  taskCancelled,
} from 'rc-mobile-base/lib/styles';

export function taskOptions(task) {
  let options = [];

  if (task.is_completed || task.is_cancelled) {
    return options;
  }

  if (!task.is_claimed) {
    options.push({ label: I18n.t('base.tasktable.utils.start'), status: 'claimed', color: taskCompleted });

    if (!get(task, 'assigned.is_mandatory')) {
      options.push({ label: I18n.t('base.tasktable.utils.reject'), status: 'rejected', color: taskCancelled });
    }
  } else if (task.is_claimed && !task.is_started) {
    if (get(task, 'type') === 'action') {
      options.push({ label: I18n.t('base.tasktable.utils.start'), status: 'started', color: taskStarted });
    } else {
      options.push({ label: I18n.t('base.tasktable.utils.finish'), status: 'completed', color: taskCompleted });
    }
  } else if (task.is_started && !task.is_paused) {
    options.push({ label: I18n.t('base.tasktable.utils.finish'), status: 'completed', color: taskCompleted });
    options.push({ label: I18n.t('base.tasktable.utils.pause'), status: 'paused', color: taskWaiting });
  } else if (task.is_paused) {
    options.push({ label: I18n.t('base.tasktable.utils.resume'), status: 'resume', color: taskStarted });
  }

  return options;
}


export function userType(user) {
  if (!user) {
    return '';
  }
  if (user.isAdministrator) {
    return I18n.t('base.ubiquitous.management');
  }
  if (user.isReceptionist) {
    return I18n.t('base.ubiquitous.front-office');
  }
  if (user.isInspector) {
    return I18n.t('base.ubiquitous.inspector');
  }
  if (user.isMaintenance) {
    return I18n.t('base.ubiquitous.maintenance');
  }
  if (user.isAttendant) {
    return I18n.t('base.ubiquitous.attendant');
  }
  if (user.isRoomRunner) {
    return I18n.t('base.ubiquitous.runner');
  }
}
