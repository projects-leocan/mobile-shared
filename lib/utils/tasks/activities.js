import {
  white,
  taskActionColors
} from 'rc-mobile-base/lib/styles';
import moment from 'moment';

const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
const nextWeek = moment().add(1, 'week').format('YYYY-MM-DD');
const backlog = null;

const activityIcons = {
  finish: 'check',
  start: 'check',
  accept: 'check',
  acknowledge: 'check',
  start_today: 'check',
  pause: 'pause',
  resume: 'play',
  reset: 'refresh',
  reject: 'ban',
  close: 'check',
  convert: 'edit',
  delay: 'arrow-right',
  'delay:0': 'arrow-right',
  'delay:1': 'forward',
  'delay:2': 'arrow-left',
}

const updateStatuses = {
  finish: 'completed',
  pause: 'paused',
  resume: 'resume',
  start: 'started',
  accept: 'claimed',
  reject: 'rejected',
  acknowledge: 'completed',
  close: 'completed',
  convert: { update_type: "convert" },
  start_today: { update_type: "start_scheduled" },
  delay: { is_reschedule: true, due_date: backlog },
  'delay:0': { is_reschedule: true, due_date: tomorrow },
  'delay:1': { is_reschedule: true, due_date: nextWeek },
  'delay:2': { is_reschedule: true, due_date: backlog },
}

const buildActivity = (type, children) => ({
  type,
  text: type.replace('_', ' ').toUpperCase(),
  translation: type.replace('_', '-'),
  icon: activityIcons[type] || 'check',
  status: updateStatuses[type] || 'completed',
  ...(taskActionColors[type] || {}).bg,
  ...white.text,

  children: children && children.map((child, index) => ({
    ...child,
    icon: activityIcons[`${type}:${index}`] || 'check',
    status: updateStatuses[`${type}:${index}`] || 'completed',
  }))
})

const buildChild = (text, icon) => ({
  text,
})

export const getActivityType = (task) => {
  const type = task.type;
  const isMandatory = task.assigned.is_mandatory;
  const isScheduled = !!task.schedule_id;

  if (isScheduled) {
    return 'scheduled'
  }
  if (isMandatory) {
    return 'mandatory'
  }
  return type
}

export const getActivityState = (task) => {
  const isRejected = task.is_rejected;
  const isCompleted = task.is_completed;
  const isClaimed = task.is_claimed;
  const isStarted = task.is_started;
  const isPaused = task.is_paused;
  const isInitial = !isClaimed && !isStarted && !isPaused;

  if (isCompleted) {
    return 'completed'
  }
  if (isRejected) {
    return 'rejected'
  }
  if (isPaused) {
    return 'paused'
  }
  if (isStarted) {
    return 'started'
  }
  if (isClaimed) {
    return 'claimed'
  }
  if (isInitial) {
    return 'initial'
  }
}

const reset = {
  type: "claimed",
  text: 'reset-entry',
  translation: 'reset-entry',
  icon: 'refresh',
  status: 'claimed',
  ...(taskActionColors['convert'] || {}).bg,
  ...white.text,
  children: []
};
const accept = buildActivity('accept')
const reject = buildActivity('reject')
const start = buildActivity('start')
const delay = buildActivity('delay', [
  buildChild('Until tomorrow'),
  buildChild('Until next week'),
  buildChild('Move to backlog'),
]);
const finish = buildActivity('finish')
const pause = buildActivity('pause')
const resume = buildActivity('resume')
const close = buildActivity('close')
const convert = buildActivity('convert')
const acknowledge = buildActivity('acknowledge')
const startToday = buildActivity('start_today')

export const basicStates = {
  initial: [
    accept,
    reject
  ],
  claimed: [
    start,
    // delay
    pause
  ],
  started: [
    finish,
    pause
  ],
  paused: [
    resume
  ],
  rejected: [
    accept,
    reject
  ],
  completed: [
    reset,
  ]
}

export const quickStates = { 
  initial: [
    accept,
    reject
  ],
  claimed: [
    finish,
    pause
  ],
  paused: [
    resume
  ],
  started: [
    finish,
    pause
  ],
  rejected: [
    accept,
    reject
  ],
  completed: [
    reset,
  ]
}

const liteStates = {
  initial: [
    close,
    convert
  ],
}

const mandatoryStates = {
  initial: [
    accept,
  ],
  claimed: [
    start,
    delay
  ],
  started: [
    finish,
    pause
  ],
  paused: [
    resume
  ]
}

const notificationStates = {
  initial: [
    acknowledge,
  ],
}

const scheduledStates = {
  initial: [
    startToday,
  ],
}

export const taskActivities = {
  action: basicStates,
  quick: quickStates,
  lite: liteStates,
  mandatory: mandatoryStates,
  notification: notificationStates,
  confirmation: quickStates,
  scheduled: scheduledStates
}

export const getTaskActivities = (task) => {
  const activityType = getActivityType(task);
  const activityState = getActivityState(task);
  const states = taskActivities[activityType] || basicStates;
  const activities = states[activityState] || states['initial'];

  return activities;
}

export default {
  get: getTaskActivities,
  getType: getActivityType,
  getState: getActivityState,
}
