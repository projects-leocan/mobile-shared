import OutboundTypes from '../constants/outbound';
import UpdatesTypes from '../constants/updates';
import { RESET_STATE } from '@redux-offline/redux-offline/lib/constants';
import moment from 'moment';
import get from 'lodash/get';

const ROOM_UPDATE_API = `/room_update`;
const TASK_API = `/tasks`;
const TASK_BATCH_API = `/tasks/batch`;
const GLITCHES_API = `/glitches`;
// const IMAGE_UPLOAD_API = 'https://upload.roomchecking.com/image-upload';
const IMAGE_UPLOAD_API = 'https://www.filestackapi.com/api/store/S3?key=AwMlkjOdcTp2fmqSd0KPDz';
const LOST_ITEM_API = `/lost_found/founds`;
const ROOM_MESSAGE_API = `/room_message`;
const EXTRA_OPTION_API = `/room_extra`;
const INVENTORY_API = `/hotel_inventory`;
const PLANNING_NIGHT_API = `/attendant_planning_nights`;
const TASKS_SOMEDAY_API = `/tasks_someday`;

export function roomCleanStart(roomId) {
  const status = 'cleaning';
  const tapTs = moment().unix();
  const outboundLabel = "Room start cleaning";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_CLEAN_START,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel } }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomCleanPause(roomId) {
  const status = 'paused';
  const tapTs = moment().unix();
  const outboundLabel = "Room paused";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_CLEAN_PAUSE,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    },
  }
}

export function roomCleanFinish(roomId) {
  const status = 'finish';
  const tapTs = moment().unix();
  const outboundLabel = "Room cleaning finished";

  return {
    type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FINISH,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomCleanRestart(roomId) {
  const status = 'cleaning';
  const tapTs = moment().unix();
  const outboundLabel = "Room start cleaning";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_CLEAN_RESTART,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomCleanUnpause(roomId) {
  const status = 'cleaning';
  const tapTs = moment().unix();
  const outboundLabel = "Room unpaused";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_CLEAN_UNPAUSE,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomDelay(roomId) {
  const status = 'delay';
  const tapTs = moment().unix();
  const outboundLabel = "Room delay";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_DELAY,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomDND(roomId) {
  const status = 'dnd';
  const tapTs = moment().unix();
  const outboundLabel = "Room dnd";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_DND,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomRefuse(roomId) {
  const status = 'refuse';
  const tapTs = moment().unix();
  const outboundLabel = "Room refuse";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_REFUSE,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomVoucher(roomId) {
  const status = 'voucher';
  const tapTs = moment().unix();
  const outboundLabel = "Room voucher";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_VOUCHER,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomInspect(roomId) {
  const status = 'finish';
  const tapTs = moment().unix();
  const outboundLabel = "Room inspected";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_INSPECT,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomNoCheck(roomId) {
  const status = 'no-check';
  const tapTs = moment().unix();
  const outboundLabel = "Room no check";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_NO_CHECK,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomConfirmDND(roomId) {
  const status = 'confirm-dnd';
  const tapTs = moment().unix();
  const outboundLabel = "Room confirm dnd";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_CONFIRM_DND,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomReset(roomId) {
  const tapTs = moment().unix();
  const outboundLabel = "Room reset";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_RESET,
    payload: {
      roomId
    },
    meta: {
      offline: {
        effect: {
          url: `/room_reset/${roomId}`,
          options: {
            method: 'POST',
            body: { platform: 'inspector', tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_RESET_FAILURE, meta: { roomId, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomCancel(roomId) {
  const status = '';
  const tapTs = moment().unix();
  const outboundLabel = "Room cancel";

  return {
    type: OutboundTypes.OUTBOUND_ROOM_CANCEL,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { attendantStatus: status, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, outboundLabel }  }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function logOther(room, user, status) {
  const data = {
    date_ts: moment().unix(),
    hotel_id: user.hotel,
    room_id: room._id,
    room_name: room.name,
    user_id: user._id,
    user_username: user.username,
    user_email: user.email,
    user_firstname: user.first_name,
    user_lastname: user.last_name,
    attendant_status: status,
    image: '',
  };
  const outboundLabel = "Cleaning logged";

  return {
    type: OutboundTypes.OUTBOUND_LOG_OTHER,
    payload: { room, user, status },
    meta: {
      offline: {
        effect: {
          url: `/attendant/${room._id}/${user._id}/log_other`,
          options: {
            method: 'POST',
            body: data
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_LOG_COMPLETED },
        rollback: { type: OutboundTypes.OUTBOUND_LOG_FAILURE, meta: { data, outboundLabel } }
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function logClean(room, user, roomUpdate) {
  const data = {
    id: null,
    hotel_id: user.hotel,
    room_id: room._id,
    room_name: room.name,
    start_ts: get(roomUpdate, 'startTime') || moment().unix(),
    end_ts: moment().unix(),
    start_user_id: user._id,
    start_username: user.username,
    start_email: user.email,
    start_firstname: user.first_name,
    start_lastname: user.last_name,
    end_user_id: user._id,
    end_username: user.username,
    end_email: user.email,
    end_firstname: user.first_name,
    end_lastname: user.last_name,
    paused_time: get(roomUpdate, 'pauseTime'),
  }
  const outboundLabel = "Cleaning logged";

  return {
    type: OutboundTypes.OUTBOUND_LOG_CLEAN,
    payload: { room, user, roomUpdate },
    meta: {
      offline: {
        effect: {
          url: `/attendant/${room._id}/${user._id}/cleaned`,
          options: {
            method: 'POST',
            body: data
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_LOG_COMPLETED },
        rollback: { type: OutboundTypes.OUTBOUND_LOG_FAILURE, meta: { data, outboundLabel } }
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function roomUpdate(roomId, field, value) {
  const tapTs = moment().unix();
  const outboundLabel = `Room update: ${field}`;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_MODEL_UPDATE,
    payload: {
      roomId,
      field,
      value
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { [field]: value, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_FAILURE, meta: { roomId, field, value, tapTs, outboundLabel } }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  } 
}

export function roomAttendantInspect(roomId, roomHousekeeping, attendantStatus) {
  const tapTs = moment().unix();
  const outboundLabel = "Room inspected";

  return {
    type: OutboundTypes.OUTBOUND_ROOM_ATTENDANT_INSPECT,
    payload: {
      roomId,
      roomHousekeeping,
      attendantStatus
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { roomHousekeeping, forceAttendant: attendantStatus, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_FAILURE, meta: { roomId, field: 'roomHousekeeping', value: roomHousekeeping, tapTs, outboundLabel } }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  } 
}

export function taskCreate(task) {
  const tapTs = moment().unix();
  const outboundLabel = `Task created: ${task.task}`;

  return {
    type: OutboundTypes.OUTBOUND_TASK_CREATE,
    payload: {
      task
    },
    meta: {
      offline: {
        effect: {
          url: TASK_API,
          options: {
            method: 'POST',
            body: { ...task, tapTs }
          }
        },
        commit: { type: UpdatesTypes.TASK_CREATE_SUCCESS, meta: { task } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_CREATE_FAILURE, meta: { task, tapTs, outboundLabel } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function tasksCreate(task) {
  const tapTs = moment().unix();
  const outboundLabel = `Task(s) created: ${task.task}`;

  return {
    type: OutboundTypes.OUTBOUND_TASKS_CREATE,
    payload: {
      task
    },
    meta: {
      offline: {
        effect: {
          url: `${TASK_BATCH_API}`,
          options: {
            method: 'POST',
            body: { ...task, tapTs }
          }
        },
        commit: { type: UpdatesTypes.TASK_CREATE_SUCCESS, meta: { task } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_CREATE_FAILURE, meta: { task, tapTs, outboundLabel } }, 
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function taskUpdate(uuid, data) {
  const tapTs = moment().unix();
  const outboundLabel = `Task updated`;

  return {
    type: OutboundTypes.OUTBOUND_TASK_UPDATE,
    payload: {
      uuid,
      data
    },
    meta: {
      offline: {
        effect: {
          url: `${TASK_API}/${uuid}`,
          options: {
            method: 'PUT',
            body: { ...data, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASK_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_UPDATE_FAILURE, meta: { uuid, data, tapTs, outboundLabel } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function taskUpdateBatch(tasks, userId) {
  const tapTs = moment().unix();
  const outboundLabel = `Task(s) updated`
  
  return {
    type: OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH,
    payload: {
      userId,
      tasks
    },
    meta: {
      offline: {
        effect: {
          url: `${TASK_API}/batch`,
          options: {
            method: 'PUT',
            body: { tasks, user_id: userId, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH_FAILURE, meta: { userId, tasks, tapTs, outboundLabel } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function taskReassign(uuid, data) {
  const tapTs = moment().unix();
  const outboundLabel = 'Task reassigned';
  
  return {
    type: OutboundTypes.OUTBOUND_TASK_REASSIGN,
    payload: {
      uuid,
      data
    },
    meta: {
      offline: {
        effect: {
          url: `${TASK_API}/${uuid}/reassign`,
          options: {
            method: 'PUT',
            body: { ...data, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASK_REASSIGN_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_REASSIGN_FAILURE, meta: { uuid, data, tapTs, outboundLabel } }
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function taskEdit(uuid, data) {
  const tapTs = moment().unix();
  const outboundLabel = 'Task edit';

  return {
    type: OutboundTypes.OUTBOUND_TASK_EDIT,
    payload: {
      uuid,
      data
    },
    meta: {
      offline: {
        effect: {
          url: `${TASK_API}/${uuid}/edit`,
          options: {
            method: 'PUT',
            body: { ...data, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASK_EDIT_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_EDIT_FAILURE, meta: { uuid, data, tapTs, outboundLabel } }
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function taskConvert(uuid, data) {
  const tapTs = moment().unix();
  const outboundLabel = 'Task converted';

  return {
    type: OutboundTypes.OUTBOUND_TASK_CONVERT,
    payload: {
      uuid,
      data
    },
    meta: {
      offline: {
        effect: {
          url: `${TASK_API}/${uuid}`,
          options: {
            method: 'PUT',
            body: { ...data, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASK_CONVERT_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_CONVERT_FAILURE, meta: { uuid, data, tapTs, outboundLabel } }
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function notificationCreate(task) {
  const tapTs = moment().unix();
  const outboundLabel = 'Notification sent';

  return {
    type: OutboundTypes.OUTBOUND_NOTIFICATION_CREATE,
    payload: {
      task
    },
    meta: {
      offline: {
        effect: {
          url: TASK_API,
          options: {
            method: 'POST',
            body: { ...task, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_NOTIFICATION_CREATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_NOTIFICATION_CREATE_FAILURE, meta: { task, tapTs, outboundLabel } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function updateGlitch(glitchId, task_id, user_id) {
  const outboundLabel = `Experience updated`;
  
  return {
    type: OutboundTypes.OUTBOUND_GLITCH_UPDATE,
    payload: {
      glitchId,
      task_id,
      user_id
    },
    meta: {
      offline: {
        effect: {
          url: `${GLITCHES_API}/${glitchId}/task`,
          options: {
            method: 'PUT',
            body: { task_id, user_id }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_GLITCH_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_GLITCH_UPDATE_FAILURE, meta: { glitchId, task_id, user_id, outboundLabel } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function uploadTaskPhoto(path, task) {
  const outboundLabel = 'Photo for task';

  return {
    type: UpdatesTypes.TASK_CREATE_UPLOADING_PHOTO,
    payload: {
      path,
      task
    },
    meta: {
      offline: {
        effect: {
          url: IMAGE_UPLOAD_API,
          options: {
            photo: path
          }
        },
        commit: { type: UpdatesTypes.TASK_CREATE_APPLY_PHOTO, meta: { task } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_PHOTO_FAILURE, meta: { path, task, outboundLabel } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function uploadNotificationPhoto(path, task) {
  const outboundLabel = 'Photo for notification';

  return {
    type: UpdatesTypes.NOTIFICATION_CREATE_UPLOADING_PHOTO,
    payload: {
      path,
      task
    },
    meta: {
      offline: {
        effect: {
          url: IMAGE_UPLOAD_API,
          options: {
            photo: path
          }
        },
        commit: { type: UpdatesTypes.NOTIFICATION_CREATE_APPLY_PHOTO, meta: { task } },
        rollback: { type: OutboundTypes.OUTBOUND_NOTIFICATION_PHOTO_FAILURE, meta: { path, task, outboundLabel } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function uploadLFPhoto(path, photoId, desc, roomId) {
  const outboundLabel = 'Photo for found item';

  return {
    type: UpdatesTypes.LOST_ITEM_UPLOADING_PHOTO,
    payload: {
      path,
      photoId,
      desc,
      roomId
    },
    meta: {
      offline: {
        effect: {
          url: IMAGE_UPLOAD_API,
          options: {
            photo: path
          }
        },
        commit: { type: UpdatesTypes.LOST_ITEM_APPLY_PHOTO, meta: { photoId, desc, roomId } },
        rollback: { type: OutboundTypes.OUTBOUND_LF_PHOTO_FAILURE, meta: { path, photoId, desc, roomId, outboundLabel } },
      },
      auth: {
        enable: true
      }
    },
    outboundLabel
  }
}

export function submitLostItem(nameOrDescription, roomId, image) {
  const outboundLabel = "Found item";
  
  return {
    type: UpdatesTypes.LOST_ITEM_SUBMIT,
    payload: {
      nameOrDescription,
      roomId,
      image
    },
    meta: {
      offline: {
        effect: {
          url: `${LOST_ITEM_API}/${roomId}`,
          options: {
            method: 'POST',
            body: { nameOrDescription, image }
          }
        },
        commit: { type: UpdatesTypes.LOST_ITEM_SUBMIT_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_LF_SUBMIT_FAILURE, meta: { roomId, nameOrDescription, image, outboundLabel } },
      },
      auth: {
        enable: true,
        useUserId: true
      },
      outboundLabel
    }
  }
}

export function uploadLFPhotoExtra(id, field, path) {
  const outboundLabel = 'Extra photo for found item';
  console.log(field, path)

  return {
    type: OutboundTypes.OUTBOUND_FOUND_PHOTO_EXTRA_ITEM,
    payload: {
      id,
      field,
      path
    },
    meta: {
      offline: {
        effect: {
          url: IMAGE_UPLOAD_API,
          options: {
            photo: path
          }
        },
        commit: { type: UpdatesTypes.LOST_FOUND_EXTRA_APPLY_PHOTO, meta: { id, field, path } },
        rollback: { type: OutboundTypes.OUTBOUND_FOUND_PHOTO_EXTRA_ITEM_FAILURE, meta: { id, field, path, outboundLabel } },
      },
      auth: {
        enable: true
      }
    },
    outboundLabel
  }
}

export function updateFoundPhoto(id, field, photoUrl) {
  const outboundLabel = "Upload found item for photo";

  return {
    type: OutboundTypes.OUTBOUND_FOUND_UPDATE_PHOTO,
    payload: {
      field,
      photoUrl
    },
    meta: {
      offline: {
        effect: {
          url: `${LOST_ITEM_API}/${id}/photo`,
          options: {
            method: 'PUT',
            body: {
              field,
              photoUrl
            }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_FOUND_UPDATE_PHOTO_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_FOUND_UPDATE_PHOTO_FAILURE, meta: { id, field, photoUrl, outboundLabel } },
      },
      auth: {
        enable: true,
        useUserId: true
      },
      outboundLabel
    }
  }
}

export function messageAdd(roomId, message) {
  const tapTs = moment().unix();
  const outboundLabel = "Room message add";
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_MESSAGE_ADD,
    payload: {
      message,
      tapTs
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_MESSAGE_API}/${roomId}`,
          options: {
            method: 'POST',
            body: { message, tapTs }
          }
        },
        commit: { type: UpdatesTypes.ROOM_MESSAGE_ADD_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_MESSAGE_ADD_FAILURE, meta: { roomId, message } },
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function messageRemove(roomId, messageIds) {
  const tapTs = moment().unix();
  const outboundLabel = "Room message remove";

  return {
    type: OutboundTypes.OUTBOUND_ROOM_MESSAGE_REMOVE,
    payload: {
      messageIds,
      tapTs
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_MESSAGE_API}/${roomId}`,
          options: {
            method: 'DELETE',
            body: { messageIds, tapTs }
          }
        },
        commit: { type: UpdatesTypes.ROOM_MESSAGE_REMOVE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_MESSAGE_REMOVE_FAILURE, meta: { roomId, messageIds } },
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function messageUpdate(roomId, messageIds, message) {
  const tapTs = moment().unix();
  const outboundLabel = "Room message update";

  return {
    type: OutboundTypes.OUTBOUND_ROOM_MESSAGE_UPDATE,
    payload: {
      messageIds,
      message,
      tapTs
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_MESSAGE_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { messageIds, message, tapTs }
          }
        },
        commit: { type: UpdatesTypes.ROOM_MESSAGE_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_MESSAGE_UPDATE_FAILURE, meta: { roomId, messageIds, message } },
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function inventoryWithdrawal(asset, withdrawal, roomId) {
  const tapTs = moment().unix();
  const outboundLabel = "Inventory withdrawal update";

  return {
    type: OutboundTypes.OUTBOUND_INVENTORY_WITHDRAWAL,
    payload: {
      roomId,
      withdrawal
    },
    meta: {
      offline: {
        effect: {
          url: `${INVENTORY_API}/${asset._id}/withdrawal`,
          options: {
            method: 'POST',
            body: { roomId, withdrawal, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_INVENTORY_WITHDRAWAL_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_INVENTORY_WITHDRAWAL_FAILURE, meta: { roomId, withdrawal, asset } },
      },
      auth: {
        enable: true,
        useUserId: true
      },
      outboundLabel
    }
  }
}

export function inventoryRejection(asset, rejected) {
  const tapTs = moment().unix();
  const outboundLabel = "Inventory rejection update";

  return {
    type: OutboundTypes.OUTBOUND_INVENTORY_REJECT,
    payload: {
      asset: asset.asset,
      rejected
    },
    meta: {
      offline: {
        effect: {
          url: `${INVENTORY_API}/${asset.asset}/deposit/reject`,
          options: {
            method: 'POST',
            body: { rejected, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_INVENTORY_REJECTION_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_INVENTORY_REJECTION_FAILURE, meta: { rejected, asset } },
      },
      auth: {
        enable: true,
        useUserId: true
      },
      outboundLabel
    }
  }
}

export function updateFoundItem(id, item) {
  const tapTs = moment().unix();
  const outboundLabel = "Found item update";

  return {
    type: OutboundTypes.OUTBOUND_UPDATE_FOUND_ITEM,
    payload: {
      id,
      item
    },
    meta: {
      offline: {
        effect: {
          url: `${LOST_ITEM_API}/${id}`,
          options: {
            method: 'PUT',
            body: { ...item, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_UPDATE_FOUND_ITEM_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_UPDATE_FOUND_ITEM_FAILURE, meta: { id, item } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function updateExtraOption(roomId, label, isCompleted) {
  const tapTs = moment().unix();
  const outboundLabel = "Extra option update";

  return {
    type: OutboundTypes.OUTBOUND_UPDATE_EXTRA_OPTION,
    payload: {
      roomId,
      label,
      isCompleted
    },
    meta: {
      offline: {
        effect: {
          url: `${EXTRA_OPTION_API}/${roomId}`,
          options: {
            method: 'PUT',
            body: { label, isCompleted, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_UPDATE_EXTRA_OPTION_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_UPDATE_EXTRA_OPTION_FAILURE, meta: { roomId, label, isCompleted } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function nightPlanningBulk(plannings) {
  const tapTs = moment().unix();
  const outboundLabel = "Night planning";

  return {
    type: OutboundTypes.OUTBOUND_NIGHT_PLANNING_BULK,
    payload: {
      plannings
    },
    meta: {
      offline: {
        effect: {
          url: PLANNING_NIGHT_API,
          options: {
            method: 'PUT',
            body: { plannings, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_NIGHT_PLANNING_BULK_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_NIGHT_PLANNING_BULK_FAILURE, meta: { plannings, tapTs } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function nightPlanningUpdate(planning) {
  const tapTs = moment().unix();
  const outboundLabel = "Night planning update";

  return {
    type: OutboundTypes.OUTBOUND_NIGHT_PLANNING_UPDATE,
    payload: {
      planning
    },
    meta: {
      offline: {
        effect: {
          url: `${PLANNING_NIGHT_API}/${planning.room_id}`,
          options: {
            method: 'PUT',
            body: { ...planning, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_NIGHT_PLANNING_UPDATE_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_NIGHT_PLANNING_UPDATE_FAILURE, meta: { planning, tapTs } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function uploadTaskAddPhoto(uuid, path) {
  const tapTs = moment().unix();
  const outboundLabel = "Upload task added photo";

  return {
    type: OutboundTypes.OUTBOUND_TASK_UPLOAD_ADD_PHOTO,
    payload: {
      uuid,
      path
    },
    meta: {
      offline: {
        effect: {
          url: IMAGE_UPLOAD_API,
          options: {
            photo: path,
          }
        },
        commit: { type: UpdatesTypes.TASK_SUBMIT_PHOTO, meta: { uuid, path } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_SUBMIT_ADD_PHOTO_FAILURE, meta: { path, uuid, outboundLabel } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function uploadTaskSubmitAddPhoto(uuid, url) {
  const tapTs = moment().unix();
  const outboundLabel = "Upload task submit added photo";

  return {
    type: OutboundTypes.OUTBOUND_TASK_SUBMIT_ADD_PHOTO,
    payload: {
      uuid,
      url
    },
    meta: {
      offline: {
        effect: {
          url: `${TASK_API}/${uuid}/photo`,
          options: {
            method: 'PUT',
            body: { url, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASK_SUBMIT_ADD_PHOTO_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_SUBMIT_ADD_PHOTO_FAILURE, meta: { uuid, url, tapTs } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function tasksToSomeday(uuids) {
  const tapTs = moment().unix();
  const outboundLabel = "Moving tasks to someday";

  return {
    type: OutboundTypes.OUTBOUND_TASKS_TO_SOMEDAY,
    payload: {
      uuids,
    },
    meta: {
      offline: {
        effect: {
          url: `${TASKS_SOMEDAY_API}/to_someday`,
          options: {
            method: 'PUT',
            body: { uuids }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASKS_TO_SOMEDAY_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_TASKS_TO_SOMEDAY_FAILURE, meta: { uuids, tapTs } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function tasksFromSomeday(uuids) {
  const tapTs = moment().unix();
  const outboundLabel = "Moving tasks from someday";

  return {
    type: OutboundTypes.OUTBOUND_TASKS_FROM_SOMEDAY,
    payload: {
      uuids
    },
    meta: {
      offline: {
        effect: {
          url: `${TASKS_SOMEDAY_API}/from_someday`,
          options: {
            method: 'PUT',
            body: { uuids }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASKS_FROM_SOMEDAY_SUCCESS },
        rollback: { type: OutboundTypes.OUTBOUND_TASKS_FROM_SOMEDAY_FAILURE, meta: { uuids, tapTs } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function removeFailed(data) {
  return {
    type: OutboundTypes.OUTBOUND_REMOVE_FAILED,
    data
  }
}

export function retryFailed(data) {
  return {
    type: OutboundTypes.OUTBOUND_RETRY_FAILED,
    data
  }
}

export function resetOffline() {
  return {
    type: RESET_STATE
  }
}

export default {
  roomCleanStart,
  roomCleanRestart,
  roomCleanPause,
  roomCleanUnpause,
  roomCleanFinish,
  roomDelay,
  roomDND,
  roomRefuse,
  roomVoucher,
  roomInspect,
  roomNoCheck,
  roomConfirmDND,
  roomReset,
  roomCancel,
  logOther,
  logClean,
  roomUpdate,
  roomAttendantInspect,
  taskCreate,
  tasksCreate,
  taskUpdate,
  taskUpdateBatch,
  taskReassign,
  taskEdit,
  taskConvert,
  notificationCreate,
  updateGlitch,
  uploadTaskPhoto,
  uploadNotificationPhoto,
  uploadLFPhoto,
  uploadLFPhotoExtra,
  updateFoundPhoto,
  submitLostItem,
  messageAdd,
  messageRemove,
  messageUpdate,
  inventoryWithdrawal,
  inventoryRejection,
  updateFoundItem,
  updateExtraOption,
  nightPlanningBulk,
  nightPlanningUpdate,
  uploadTaskAddPhoto,
  uploadTaskSubmitAddPhoto,
  tasksToSomeday,
  tasksFromSomeday,
  removeFailed,
  retryFailed,
  resetOffline
}