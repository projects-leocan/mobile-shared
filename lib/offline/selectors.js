import { createSelector } from 'reselect';
import { head } from 'lodash/array';

export const offlineSelector = state => state.customOffline;

export const offlineQueueSelector = createSelector(
  [offlineSelector],
  (offline) => offline.queue
);

export const offlineMetaSelector = createSelector(
  [offlineSelector],
  (offline) => offline.meta
);

export const nextOfflineQueueSelector = createSelector(
  [offlineQueueSelector],
  (queue) => head(queue)
);

export const sizeOfflineQueueSelector = createSelector(
  [offlineQueueSelector],
  (queue) => queue.length
);

export const isRunningOfflineQueueSelector = createSelector(
  [offlineMetaSelector],
  (meta) => meta.isRunning
);

export const totalAttemptsOfflineQueueSelector = createSelector(
  [offlineMetaSelector],
  (meta) => meta.attempts
);

export const delayOfflineQueueSelector = createSelector(
  [offlineMetaSelector],
  (meta) => meta.delay
);

export const currentAttemptOfflineQueueSelector = createSelector(
  [offlineMetaSelector],
  (meta) => meta.currentAttempt
);

export const currentRunningOfflineQueueSelector = createSelector(
  [offlineMetaSelector],
  (meta) => meta.currentRunning
);

export default {
  currentAttemptOfflineQueueSelector,
  currentRunningOfflineQueueSelector,
  delayOfflineQueueSelector,
  totalAttemptsOfflineQueueSelector,
  isRunningOfflineQueueSelector,
  nextOfflineQueueSelector,
  sizeOfflineQueueSelector,
  offlineMetaSelector,
  offlineQueueSelector,
}
