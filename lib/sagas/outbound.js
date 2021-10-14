import { delay, take } from 'redux-saga';
import { takeLatest, throttle, put, call, select, fork } from 'redux-saga/effects';
import { get, keys, has, extend } from 'lodash/object';
import { filter, includes, find } from 'lodash/collection';
import moment from 'moment';
import digestAssignment from '../utils/digest-assignment';

import OutboundTypes from '../constants/outbound';
import OutboundActions from '../actions/outbound';
import UpdatesTypes from '../constants/updates';
import UpdatesActions from '../actions/updates';
import AssetsActions from '../actions/assets';
import RoomsActions from '../actions/rooms';
import OverlayActions from '../actions/overlay';

import { userIdSelector, userSelector } from '../selectors/auth';
import { tasksSelector } from '../selectors/rooms';
import { photosSelector } from '../selectors/updates';

import request, { authRequest } from '../utils/request';
import { forkWatchers } from '../utils/sagas';
import { roomUpdate as ruHash } from '../utils/hashes';
import { offlineable } from '../offline';
// import bugsnagClient from '../utils/bugsnag';

export default function({ apiUrl }) {  
  
  function * roomCleanFailure({ meta, payload }) {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_ROOM_CLEAN_FAILURE'
    //     }
    //   }
    // });
  }
  
  function * watchRoomCleanFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, roomCleanFailure);
  }

  function * roomResetFailure({ meta, payload }) {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_ROOM_RESET_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchRoomResetFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_ROOM_RESET_FAILURE, roomResetFailure);
  }

  function * logFailure({ meta, payload }) {
    // bugsnagClient.notify(payload,report =>  {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_LOG_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchLogFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_LOG_FAILURE, logFailure);
  }

  function * roomUpdateFailure({ meta, payload }) {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_ROOM_UPDATE_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchRoomUpdateFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_ROOM_UPDATE_FAILURE, roomUpdateFailure);
  }

  function * taskCreateFailure({ meta, payload }) {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_TASK_CREATE_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchTaskCreateFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_TASK_CREATE_FAILURE, taskCreateFailure);
  }

  function * taskUpdateFailure({ meta, payload }) {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_TASK_UPDATE_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchTaskUpdateFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_TASK_UPDATE_FAILURE, taskUpdateFailure);
  }

  function * taskUpdateBatchFailure() {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_TASK_UPDATE_BATCH_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchTaskUpdateBatchFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH_FAILURE, taskUpdateBatchFailure);
  }

  function * taskReassignFailure() {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_TASK_REASSIGN_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchTaskReassignFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_TASK_REASSIGN_FAILURE, taskReassignFailure);
  }

  function * taskConvertFailure() {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_TASK_CONVERT_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchTaskConvertFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_TASK_CONVERT_FAILURE, taskConvertFailure);
  }

  function * notificationCreateFailure() {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_NOTIFICATION_CREATE_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchNotificationCreateFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_NOTIFICATION_CREATE_FAILURE, notificationCreateFailure);
  }

  function * glitchUpdateFailure() {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_GLITCH_UPDATE_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchGlitchUpdateFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_GLITCH_UPDATE_FAILURE, glitchUpdateFailure);
  }

  function * taskPhotoFailure() {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_TASK_PHOTO_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchTaskPhotoFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_TASK_PHOTO_FAILURE, taskPhotoFailure);
  }

  function * notificationPhotoFailure() {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_NOTIFICATION_PHOTO_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchNotificationPhotoFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_NOTIFICATION_PHOTO_FAILURE, notificationPhotoFailure);
  }

  function * lfPhotoFailure() {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_LF_PHOTO_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchLfPhotoFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_LF_PHOTO_FAILURE, lfPhotoFailure);
  }

  function * lfSubmitFailure() {
    // bugsnagClient.notify(payload, report => {
    //   report.context = 'offline';
    //   report.metadata = {
    //     info: {
    //       payload,
    //       meta,
    //       type: 'OUTBOUND_LF_SUBMIT_FAILURE'
    //     }
    //   }
    // });
  }

  function * watchLfSubmitFailure() {
    yield takeLatest(OutboundTypes.OUTBOUND_LF_SUBMIT_FAILURE, lfSubmitFailure);
  }

  function * retryFailureFlow({ data }) {
    if (data.type === "OUTBOUND_ROOM_CLEAN_FAILURE") {
      yield put(OutboundActions.roomUpdate(data.meta.roomId, 'attendantStatus', data.meta.status));
    } else if (data.type === "OUTBOUND_ROOM_UPDATE_FAILURE") {
      yield put(OutboundActions.roomUpdate(data.meta.roomId, data.meta.field, data.meta.value));
    }
  }

  function * watchRetryFailed() {
    yield takeLatest(OutboundTypes.OUTBOUND_RETRY_FAILED, retryFailureFlow);
  }
  
  const watchers = {
    watchRoomCleanFailure,
    watchRoomResetFailure,
    watchLogFailure,
    watchRoomUpdateFailure,
    watchTaskCreateFailure,
    watchTaskUpdateFailure,
    watchTaskUpdateBatchFailure,
    watchTaskReassignFailure,
    watchTaskConvertFailure,
    watchNotificationCreateFailure,
    watchGlitchUpdateFailure,
    watchTaskPhotoFailure,
    watchNotificationPhotoFailure,
    watchLfPhotoFailure,
    watchLfSubmitFailure,
    watchRetryFailed
  };

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas: {
      roomCleanFailure,
      roomResetFailure,
      logFailure,
      roomUpdateFailure,
      taskCreateFailure,
      taskUpdateFailure,
      taskUpdateBatchFailure,
      taskReassignFailure,
      taskConvertFailure,
      notificationCreateFailure,
      glitchUpdateFailure,
      taskPhotoFailure,
      notificationPhotoFailure,
      lfPhotoFailure,
      lfSubmitFailure,
      retryFailureFlow
    }
  }
}