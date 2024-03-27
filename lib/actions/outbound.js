import OutboundTypes from '../constants/outbound';
import UpdatesTypes from '../constants/updates';
import RoomsTypes from '../constants/rooms'
import { RESET_STATE } from '@redux-offline/redux-offline/lib/constants';
import moment from 'moment';
import get from 'lodash/get';
import _ from 'lodash';

const ROOM_UPDATE_API = `/Cleaning/UpdateCleaningStatus`;
const ROOM_INSPECTION_UPDATE_API = `/Cleaning/UpdateInspectionStatus`;
const ROOM_INSPECTION_NIGHTY_UPDATE_API = `Cleaning/UpdateNightlyInspectionStatus`
const NIGHTLY_CLEANING_UPDATE_API = `/Cleaning/UpdateNightlyCleaningStatus`;
const CREATE_ROOM_MESSAGE = '/Room/SendMessage';
const ROOM_INSERT_CLEANING = `/Cleaning/InsertCleaning`;
const ROOM_UPDATE_PRIORITY = `/Room/UpdateCleaningPriority`;
const TASK_API = `/tasks`;
const INSERT_TASK = '/Task/InsertTask';
const TASK_REASSIGN = '/Task/ReassignTask';
const TASK_DEPARTURE = '/Task/MoveTaskToDeparture';
const TASK_UPDATE_API = `/Task/UpdateTaskStatus`;
const CREATE_TASK_MESSAGE_API = `/Task/SendMessage`;
const TASK_ADDITIONAL_IMAGE = `/Task/UpdateTaskImages`;
const TASK_BATCH_API = `/Task/UpdateMultipleTaskStatuses`;
const GLITCHES_API = `/glitches`;
// const IMAGE_UPLOAD_API = 'https://upload.roomchecking.com/image-upload';
const IMAGE_UPLOAD_API = 'https://www.filestackapi.com/api/store/S3?key=AwMlkjOdcTp2fmqSd0KPDz';
const LOST_ITEM_API = `/lost_found/founds`;
const INSERT_FOUND_ITEM_API = `/FoundItem/InsertFoundItem`;
const ROOM_MESSAGE_API = `/room_message`;
const EXTRA_OPTION_API = `/room_extra`;
const INVENTORY_API = `/hotel_inventory`;
const PLANNING_NIGHT_API = `/attendant_planning_nights`;
const PLANNING_API = `/attendant_plannings`;
const TASKS_SOMEDAY_API = `/tasks_someday`;
const AUDIT_INSERT_ROUTE_API = `/Audit/InsertAudit`;
const AUDIT_API = `/audits`
const AUDIT_UPDATE_API = `/Audit/UpdateAudit`;
const DELETE_AUDIT_API = `/Audit/DeleteAudit`
const INSPECTION_API = `/inspections`
const INVENTORY_SCHEDULE_ASSET_CONSUMATION = `/Room/ScheduleAssetConsumation`;
const INVENTORY_SCHEDULE_GROUPED_ASSET_CONSUMATION = `/InventoryReview/InsertInventoryReview`
// const INVENTORY_CONFIRM_ASSET_CONSUMATION = `/Room/ConfirmAssetConsumation`;
const INVENTORY_CONFIRM_ASSET_CONSUMATION = `/Minibar/Restock`;
const UPDATE_LOST_IMAGE = "/FoundItem/UpdateFoundItemImage"
const UPDATE_GUEST_LOCATOR_STATUS = "/Room/UpdateIsGuestCurrentlyIn"
//assign cleaning
const ASSIGN_NEW_CLEANING = "/Cleaning/AssignCleaning"
const RE_ASSIGN_CLEANING = "/Cleaning/ReassignCleaning"
const CENCLE_CLEANING = "/Cleaning/UnassignCleaning"
const CAME_TO_BREAKFAST = "/Breakfast/ReservationCameToBreakfast"


//assign new Cleaning
export function cencleCleaning(Cleaning) {

  const tapTs = moment().unix();
  const outboundLabel = `cencle cleaning : ${JSON.stringify(Cleaning)}
  `;

  return {
    type: OutboundTypes.OUTBOUND_CENCLE_CLEANING,
    payload: {
      Cleaning
    },
    meta: {
      offline: {
        effect: {
          url: CENCLE_CLEANING,
          options: {
            method: 'POST',
            body: Cleaning
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_CENCLE_CLEANING_SUCCESS, meta: { endpoint: CENCLE_CLEANING } },
        rollback: { type: OutboundTypes.OUTBOUND_CENCLE_CLEANING_FAILED, meta: { Cleaning, tapTs, outboundLabel, endpoint: CENCLE_CLEANING } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

//assign new Cleaning
export function assignNewCleaning(Cleaning) {
  const tapTs = moment().unix();
  const outboundLabel = `Assign new Cleaning:
  Cleaning: ${JSON.stringify(Cleaning)}
  `;

  return {
    type: OutboundTypes.OUTBOUND_ASSIGN_CLEANING,
    payload: {
      Cleaning
    },
    meta: {
      offline: {
        effect: {
          url: ASSIGN_NEW_CLEANING,
          options: {
            method: 'POST',
            body: Cleaning
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ASSIGN_CLEANING_SUCCESS, meta: { Cleaning, endpoint: ASSIGN_NEW_CLEANING } },
        rollback: { type: OutboundTypes.OUTBOUND_ASSIGN_CLEANING_FAILED, meta: { Cleaning, tapTs, outboundLabel, endpoint: ASSIGN_NEW_CLEANING } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function reAssignNewCleaning(Cleaning) {
  const tapTs = moment().unix();
  const outboundLabel = `Re Assign new Cleaning:
  ${JSON.stringify(Cleaning)}
  `;

  return {
    type: OutboundTypes.OUTBOUND_RE_ASSIGN_CLEANING,
    payload: {
      Cleaning
    },
    meta: {
      offline: {
        effect: {
          url: RE_ASSIGN_CLEANING,
          options: {
            method: 'POST',
            body: Cleaning
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_RE_ASSIGN_CLEANING_SUCCESS, meta: { endpoint: RE_ASSIGN_CLEANING } },
        rollback: { type: OutboundTypes.OUTBOUND_RE_ASSIGN_CLEANING_FAILED, meta: { Cleaning, tapTs, outboundLabel, endpoint: RE_ASSIGN_CLEANING } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}


export function updateNightlyInspectionStatusFu(roomId, turnDownPayload) {
  const tapTs = moment().unix();
  const outboundLabel = `Night Inspection update:
  turnDownPayload: ${JSON.stringify(turnDownPayload)}
  roomId:${roomId}
  `;
  // const outboundLabel = `Create cleaning: ${cleanPayload.roomId}`;

  return {
    type: OutboundTypes.UPDATE_NIGHTY_INSPECTION_STATUS,
    payload: {
      turnDownPayload
    },
    meta: {
      offline: {
        effect: {
          url: NIGHTLY_CLEANING_UPDATE_API,
          options: {
            method: 'POST',
            body: { status: turnDownPayload.status, timestamp: turnDownPayload.timestamp, cleaningId: turnDownPayload.cleaningId, roomId: turnDownPayload.cleaningId == null ? roomId : null }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_NIGHTLY_PLANNING_STATUS_UPDATE_SUCCESS, meta: { turnDownPayload, endpoint: NIGHTLY_CLEANING_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_NIGHTLY_PLANNING_STATUS_UPDATE_FAILURE, meta: { turnDownPayload, tapTs, outboundLabel, endpoint: NIGHTLY_CLEANING_UPDATE_API } },
        // commit: { type: OutboundTypes.UPDATE_NIGHTY_INSPECTION_STATUS_SUCCESS, meta: { turnDownPayload, endpoint: NIGHTLY_CLEANING_UPDATE_API } },
        // rollback: { type: OutboundTypes.UPDATE_NIGHTY_INSPECTION_STATUS_FAILED, meta: { turnDownPayload, tapTs, outboundLabel, endpoint: NIGHTLY_CLEANING_UPDATE_API } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

//update isGuestIn status
export function updateGuestCurrentlyIn(guestArray) {
  const tapTs = "0";
  const outboundLabel = `update guest currently in status: 
 ${JSON.stringify(guestArray)}`;
  return {
    type: OutboundTypes.OUTBOUND_LOCATOR_STATUS,
    meta: {
      offline: {
        effect: {
          url: `${UPDATE_GUEST_LOCATOR_STATUS}`,
          options: {
            method: 'POST',
            body: guestArray
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_LOCATOR_STATUS_SUCCESS, meta: { guestArray: guestArray, endpoint: UPDATE_GUEST_LOCATOR_STATUS } },
        rollback: { type: OutboundTypes.OUTBOUND_LOCATOR_STATUS_FAILURE, meta: { guestArray, outboundLabel, endpoint: UPDATE_GUEST_LOCATOR_STATUS } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

//api call for delete audit
export function deleteAuditApi(AuditId) {
  const tapTs = "0";
  const outboundLabel = `audit delete: 
  AuditId:${AuditId}`;

  return {
    type: OutboundTypes.OUTBOUND_AUDIT_DELETE,
    meta: {
      offline: {
        effect: {
          url: `${DELETE_AUDIT_API}?AuditId=${AuditId}`,
          options: {
            method: 'DELETE',
            body: {}
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_AUDIT_DELETE_SCCESS, meta: { endpoint: `${DELETE_AUDIT_API}?AuditId=${AuditId}` } },
        rollback: { type: OutboundTypes.OUTBOUND_AUDIT_DELETE_REQUEST_FAILURE, meta: { AuditId, tapTs, outboundLabel, endpoint: `${DELETE_AUDIT_API}?AuditId=${AuditId}` } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomCleanStart(roomId, cleanListRoom, roomName) {
  const status = 'cleaning';
  const tapTs = moment().unix();
  const name = !_.isEmpty(roomName) ?  roomName : ""
  const { id: cleaningId } = cleanListRoom;

  const outboundLabel = `Room start cleaning: 
  roomId:${roomId}
  roomName:${name}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_CLEAN_START,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomCleanPause(roomId, cleanListRoom, roomName) {
  const status = 'paused';
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const name = !_.isEmpty(roomName) ? roomName : ""

  const outboundLabel = `Room paused: 
  roomId:${roomId}
  roomName: ${name}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;
  return {
    type: OutboundTypes.OUTBOUND_ROOM_CLEAN_PAUSE,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    },
  }
}

export function roomCleanFinish(roomId, cleanListRoom, roomName) {
  const status = 'finish';
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const name = !_.isEmpty(roomName) ? roomName : ""

  const outboundLabel = `Room cleaning finished: 
  roomId:${roomId}
  roomName: ${name}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FINISH,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomCleanRestart(roomId, cleanListRoom) {
  const status = 'cleaning';
  const tapTs = moment().unix();

  const { id: cleaningId } = cleanListRoom;
  const outboundLabel = `Room start cleaning: 
  roomId:${roomId}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;
  return {
    type: OutboundTypes.OUTBOUND_ROOM_CLEAN_RESTART,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomCleanUnpause(roomId, cleanListRoom) {
  const status = 'cleaning';
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const outboundLabel = `Room unpaused: 
  roomId:${roomId}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_CLEAN_UNPAUSE,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomDelay(roomId, cleanListRoom, roomName) {
  const status = 'delay';
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const name = !_.isEmpty(roomName) ? roomName : ""

  const outboundLabel = `Room delay: 
  roomId:${roomId}
  roomName:${name}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_DELAY,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomDND(roomId, cleanListRoom, roomName) {
  const status = 'dnd';
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const name = !_.isEmpty(roomName) ? roomName : ""


  const outboundLabel = `Room dnd: 
  roomId:${roomId}
  roomName:${name}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_DND,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomRefuse(roomId, cleanListRoom, roomName) {
  const status = 'refuse';
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const name = !_.isEmpty(roomName) ? roomName : ""

  const outboundLabel = `Room refuse: 
  roomId:${roomId}
  roomName:${name}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_REFUSE,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomVoucher(roomId, cleanListRoom,roomName) {
  const status = 'voucher';
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const name = !_.isEmpty(roomName) ? roomName : ""

  const outboundLabel = `Room voucher: 
  roomId:${roomId}
  roomName:${name}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_VOUCHER,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomInspect(roomId, cleanListRoom) {
  const status = 'finish';
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;

  const outboundLabel = `Room inspected: 
  roomId:${roomId}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_INSPECT,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomNoCheck(roomId, cleanListRoom, roomName) {
  const status = 'no-check';
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const name = !_.isEmpty(roomName) ? roomName : ""


  const outboundLabel = `Room no check: 
  roomId:${roomId}
  roomName:${name}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_NO_CHECK,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomConfirmDND(roomId, cleanListRoom,roomName) {
  const status = 'confirm-dnd';
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const name = !_.isEmpty(roomName) ? roomName : ""

  const outboundLabel = `Room confirm dnd: 
  roomId:${roomId}
  roomName:${name}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_CONFIRM_DND,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomReset(roomId) {
  const tapTs = moment().unix();
  const outboundLabel = `Room reset: 
  roomId:${roomId}
  timestamp:${tapTs}
  `;

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
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { endpoint: `/room_reset/${roomId}` } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_RESET_FAILURE, meta: { roomId, tapTs, outboundLabel, endpoint: `/room_reset/${roomId}` } }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomCancelStatus(roomId, cleanListRoom, cancelStatus, roomName) {
  const status = cancelStatus;
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const name = !_.isEmpty(roomName) ? roomName : ""

  const outboundLabel = `Room cancel: 
  roomId:${roomId}
  roomName: ${name}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;
  return {
    type: OutboundTypes.OUTBOUND_ROOM_CANCEL,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomCancel(roomId, cleanListRoom, roomName) {
  const status = '';
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const name = !_.isEmpty(roomName) ? roomName : ""

  const outboundLabel = `Room cancel: 
  roomId:${roomId}
  roomName:${name}
  cleaningId:${cleaningId}
  status:${status}
  timestamp:${tapTs}
  `;
  
  return {
    type: OutboundTypes.OUTBOUND_ROOM_CANCEL,
    payload: {
      roomId,
      status
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE, meta: { roomId, status, tapTs, cleaningId, outboundLabel, endpoint: ROOM_UPDATE_API } }
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
        commit: { type: OutboundTypes.OUTBOUND_LOG_COMPLETED, meta: { endpoint: `/attendant/${room._id}/${user._id}/log_other` } },
        rollback: { type: OutboundTypes.OUTBOUND_LOG_FAILURE, meta: { data, outboundLabel, endpoint: `/attendant/${room._id}/${user._id}/log_other` } }
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
        commit: { type: OutboundTypes.OUTBOUND_LOG_COMPLETED, meta: { endpoint: `/attendant/${room._id}/${user._id}/cleaned` } },
        rollback: { type: OutboundTypes.OUTBOUND_LOG_FAILURE, meta: { data, outboundLabel, endpoint: `/attendant/${room._id}/${user._id}/cleaned` } }
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function roomHousekeepingUpdate(roomId, status, cleanListRoom, roomName, codeName) {
  const tapTs = moment().unix();
  const code = !_.isEmpty(codeName) ? codeName : ""
  const outboundLabel = `Room Housekeeping update: 
Room Id: ${roomId}
Room No.: ${roomName}
Cleaning Id: ${cleanListRoom.id}   
Status Is:  ${status}
Status Title: ${code}
Time: ${tapTs}
`;

  const { id: cleaningId } = cleanListRoom;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_MODEL_UPDATE,
    payload: {
      roomId,
      status,
      cleanListRoom
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_INSPECTION_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId: cleaningId, roomId: cleaningId == null ? roomId : null }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_HOUSEKEEPING_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_INSPECTION_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_FAILURE, meta: { roomId, status, cleanListRoom, tapTs, outboundLabel, endpoint: ROOM_INSPECTION_UPDATE_API } }
      },
      auth: {
        enable: true,
        useUserSession: false
      },
      outboundLabel
    }
  }
}

export function roomUpdate(roomId, status, cleanListRoom) {
  const tapTs = moment().unix();
  const { id: cleaningId } = cleanListRoom;
  const outboundLabel = `Room update:
  Room Id: ${roomId}
  Cleaning Id: ${cleaningId}   
  Status Is:  ${status}
  `;
  return {
    type: OutboundTypes.OUTBOUND_ROOM_MODEL_UPDATE,
    payload: {
      roomId,
      status,
      cleanListRoom
    },
    meta: {
      offline: {
        effect: {
          url: `${ROOM_UPDATE_API}`,
          options: {
            method: 'POST',
            body: { status: status, timestamp: tapTs, cleaningId }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, meta: { attendantStatus: status, endpoint: ROOM_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_FAILURE, meta: { roomId, status, cleanListRoom, tapTs, outboundLabel, endpoint: ROOM_UPDATE_API } }
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

  const outboundLabel = `Room inspected:
  roomId: ${roomId}
  roomHousekeeping: ${roomHousekeeping}   
  attendantStatus:  ${attendantStatus}
  `;

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
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_SUCCESS, endpoint: `${ROOM_UPDATE_API}/${roomId}` },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_FAILURE, meta: { roomId, field: 'roomHousekeeping', value: roomHousekeeping, tapTs, outboundLabel, endpoint: `${ROOM_UPDATE_API}/${roomId}` } }
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function roomMessageCreate(message) {
  const tapTs = moment().unix();
  const outboundLabel = `Send message: ${JSON.stringify(message)}`;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_COMMENT_ADD,
    payload: {
      message
    },
    meta: {
      offline: {
        effect: {
          url: CREATE_ROOM_MESSAGE,
          options: {
            method: 'POST',
            body: message
          }
        },
        commit: { type: UpdatesTypes.OUTBOUND_ROOM_COMMENT_ADD_SUCESS, meta: { message, endpoint: CREATE_ROOM_MESSAGE } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_COMMENT_ADD_FAILURE, meta: { message, tapTs, outboundLabel, endpoint: CREATE_ROOM_MESSAGE } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function roomCreateCleaning(cleanPayload) {
  const tapTs = moment().unix();
  const outboundLabel = `Create cleaning: ${JSON.stringify(cleanPayload)}`;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_CLEANING_ADD,
    payload: {
      cleanPayload
    },
    meta: {
      offline: {
        effect: {
          url: ROOM_INSERT_CLEANING,
          options: {
            method: 'POST',
            body: cleanPayload
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_CLEANING_ADD_SUCESS, meta: { cleanPayload, endpoint: ROOM_INSERT_CLEANING } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_CLEANING_ADD_FAILURE, meta: { cleanPayload, tapTs, outboundLabel, endpoint: ROOM_INSERT_CLEANING } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function roomUpdatePriority(priorityPayload) {
  const tapTs = moment().unix();
  const outboundLabel = `update cleaning: ${JSON.stringify(priorityPayload)}`;

  return {
    type: OutboundTypes.OUTBOUND_ROOM_UPDATE_PRIORITY,
    payload: {
      priorityPayload
    },
    meta: {
      offline: {
        effect: {
          url: ROOM_UPDATE_PRIORITY,
          options: {
            method: 'POST',
            body: priorityPayload
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_PRIORITY_SUCESS, meta: { priorityPayload, endpoint: ROOM_UPDATE_PRIORITY } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_UPDATE_PRIORITY_FAILURE, meta: { priorityPayload, tapTs, outboundLabel, endpoint: ROOM_UPDATE_PRIORITY } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}


export function taskCreate(task) {
  const tapTs = moment().unix();
  const outboundLabel = `Task created: ${JSON.stringify(task)}`;

  return {
    type: OutboundTypes.OUTBOUND_TASK_CREATE,
    payload: {
      task
    },
    meta: {
      offline: {
        effect: {
          url: INSERT_TASK,
          options: {
            method: 'POST',
            body: task
          }
        },
        commit: { type: UpdatesTypes.TASK_CREATE_SUCCESS, meta: { task, endpoint: INSERT_TASK } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_CREATE_FAILURE, meta: { task, tapTs, outboundLabel, endpoint: INSERT_TASK } },
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
  const outboundLabel = `Task(s) created: ${JSON.stringify(task)}`;

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
        commit: { type: UpdatesTypes.TASK_CREATE_SUCCESS, meta: { task, endpoint: TASK_BATCH_API } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_CREATE_FAILURE, meta: { task, tapTs, outboundLabel, endpoint: TASK_BATCH_API } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function taskUpdate(uuid, data, auditId, auditTemplateId, isAuditRequired) {
  const tapTs = moment().unix();
  let payload 
  if (data.status === 'completed' && isAuditRequired === true) {
      payload = {...data, auditId: !_.isEmpty(auditId) ? auditId : null, auditTemplateId: !_.isEmpty(auditTemplateId) ? auditTemplateId : null}
  }else{
    payload = {...data}
  }
  const outboundLabel = `Task updated: ${JSON.stringify(payload)}`;
  return {
    type: OutboundTypes.OUTBOUND_TASK_UPDATE,
    payload: {
      uuid,
      payload
    },
    meta: {
      offline: {
        effect: {
          url: TASK_UPDATE_API,
          options: {
            method: 'POST',
            body: { ...payload }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASK_UPDATE_SUCCESS, meta: { endpoint: TASK_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_UPDATE_FAILURE, meta: { uuid, payload, outboundLabel, endpoint: TASK_UPDATE_API } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function taskCreateMessage(messagePayload) {
  const tapTs = moment().unix();
  const outboundLabel = `Task create message: ${JSON.stringify(messagePayload)}`;

  return {
    type: OutboundTypes.OUTBOUND_CREATE_TASK_MESSAGE,
    payload: {
      ...messagePayload
    },
    meta: {
      offline: {
        effect: {
          url: CREATE_TASK_MESSAGE_API,
          options: {
            method: 'POST',
            body: {
              ...messagePayload
            }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_CREATE_TASK_MESSAGE_SUCCESS, meta: { endpoint: CREATE_TASK_MESSAGE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_CREATE_TASK_MESSAGE_FAILURE, meta: { ...messagePayload, outboundLabel, endpoint: CREATE_TASK_MESSAGE_API } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function taskUpdateBatch(tasks, userHotelId) {
  const tapTs = moment().unix();
  const outboundLabel = `Task(s) updated: ${JSON.stringify(tasks)} 
  userHotelId:${userHotelId}`
  return {
    type: OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH,
    payload: {
      userHotelId,
      tasks
    },
    meta: {
      offline: {
        effect: {
          url: TASK_BATCH_API,
          options: {
            method: 'POST',
            body: { hotelId: userHotelId, tasks }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH_SUCCESS, meta: { endpoint: TASK_BATCH_API } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH_FAILURE, meta: { userHotelId, tasks, outboundLabel, endpoint: TASK_BATCH_API } },
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
  const outboundLabel = `Task reassigned: ${JSON.stringify(data)}`
  return {
    type: OutboundTypes.OUTBOUND_TASK_REASSIGN,
    payload: {
      uuid,
      data
    },
    meta: {
      offline: {
        effect: {
          url: TASK_REASSIGN,
          options: {
            method: 'POST',
            body: data
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASK_REASSIGN_SUCCESS, meta: { endpoint: TASK_REASSIGN } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_REASSIGN_FAILURE, meta: { uuid, data, tapTs, outboundLabel, endpoint: TASK_REASSIGN } }
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function taskDeparture(uuid, data) {
  const tapTs = moment().unix();
  const outboundLabel = `Task departure: ${JSON.stringify(data)}`

  return {
    type: OutboundTypes.OUTBOUND_TASK_DEPARTURE,
    payload: {
      uuid,
      data
    },
    meta: {
      offline: {
        effect: {
          url: TASK_DEPARTURE,
          options: {
            method: 'POST',
            body: data
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASK_DEPARTURE_SUCCESS, meta: { endpoint: TASK_DEPARTURE } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_DEPARTURE_FAILURE, meta: { uuid, data, tapTs, outboundLabel, endpoint: TASK_DEPARTURE } }
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
  const outboundLabel = `Task edit: ${JSON.stringify(data)}
  uuid: ${uuid}
  `
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
        commit: { type: OutboundTypes.OUTBOUND_TASK_EDIT_SUCCESS, meta: { endpoint: `${TASK_API}/${uuid}/edit` } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_EDIT_FAILURE, meta: { uuid, data, tapTs, outboundLabel, endpoint: `${TASK_API}/${uuid}/edit` } }
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
  const outboundLabel = `Task converted: ${JSON.stringify(data)}
  uuid: ${uuid}
  `
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
        commit: { type: OutboundTypes.OUTBOUND_TASK_CONVERT_SUCCESS, meta: { endpoint: `${TASK_API}/${uuid}` } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_CONVERT_FAILURE, meta: { uuid, data, tapTs, outboundLabel, endpoint: `${TASK_API}/${uuid}` } }
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

  const outboundLabel = `Notification sent: ${JSON.stringify(task)}`
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
        commit: { type: OutboundTypes.OUTBOUND_NOTIFICATION_CREATE_SUCCESS, meta: { endpoint: TASK_API } },
        rollback: { type: OutboundTypes.OUTBOUND_NOTIFICATION_CREATE_FAILURE, meta: { task, tapTs, outboundLabel, endpoint: TASK_API } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function updateGlitch(glitchId, task_id, user_id) {
  const outboundLabel = `Experience updated
  experienceId : ${glitchId}
  task_id: ${task_id}
  user_id: ${user_id}
  `;

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
        commit: { type: OutboundTypes.OUTBOUND_GLITCH_UPDATE_SUCCESS, meta: { endpoint: `${GLITCHES_API}/${glitchId}/task` } },
        rollback: { type: OutboundTypes.OUTBOUND_GLITCH_UPDATE_FAILURE, meta: { glitchId, task_id, user_id, outboundLabel, endpoint: `${GLITCHES_API}/${glitchId}/task` } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function uploadTaskPhoto(path, task) {
  const outboundLabel = `Photo for task`;

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
        commit: { type: UpdatesTypes.TASK_CREATE_APPLY_PHOTO, meta: { task, endpoint: IMAGE_UPLOAD_API } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_PHOTO_FAILURE, meta: { path, task, outboundLabel, endpoint: IMAGE_UPLOAD_API } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function uploadNotificationPhoto(path, task) {
  const outboundLabel = `Photo for notification`;

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
        commit: { type: UpdatesTypes.NOTIFICATION_CREATE_APPLY_PHOTO, meta: { task, endpoint: IMAGE_UPLOAD_API } },
        rollback: { type: OutboundTypes.OUTBOUND_NOTIFICATION_PHOTO_FAILURE, meta: { path, task, outboundLabel, endpoint: IMAGE_UPLOAD_API } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function uploadLFPhoto(path, photoId, insertLFPayload) {
  const outboundLabel = 'Photo for found item';

  return {
    type: UpdatesTypes.LOST_ITEM_UPLOADING_PHOTO,
    payload: {
      path,
      photoId,
      insertLFPayload
    },
    meta: {
      offline: {
        effect: {
          url: IMAGE_UPLOAD_API,
          options: {
            photo: path
          }
        },
        commit: { type: UpdatesTypes.LOST_ITEM_APPLY_PHOTO, meta: { photoId, insertLFPayload, endpoint: IMAGE_UPLOAD_API } },
        rollback: { type: OutboundTypes.OUTBOUND_LF_PHOTO_FAILURE, meta: { path, photoId, insertLFPayload, outboundLabel, endpoint: IMAGE_UPLOAD_API } },
      },
      auth: {
        enable: true
      }
    },
    outboundLabel
  }
}

export function submitLostItem(insertLFPayload) {
  const outboundLabel = `submit lost item : ${insertLFPayload}`;

  return {
    type: UpdatesTypes.LOST_ITEM_SUBMIT,
    payload: insertLFPayload,
    meta: {
      offline: {
        effect: {
          url: `${INSERT_FOUND_ITEM_API}`,
          options: {
            method: 'POST',
            body: insertLFPayload
          }
        },
        commit: { type: UpdatesTypes.LOST_ITEM_SUBMIT_SUCCESS, meta: { endpoint: INSERT_FOUND_ITEM_API } },
        rollback: { type: OutboundTypes.OUTBOUND_LF_SUBMIT_FAILURE, meta: { outboundLabel, insertLFPayload, endpoint: INSERT_FOUND_ITEM_API } },
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
        commit: { type: UpdatesTypes.LOST_FOUND_EXTRA_APPLY_PHOTO, meta: { id, field, path, meta: { outboundLabel, insertLFPayload, endpoint: IMAGE_UPLOAD_API } } },
        rollback: { type: OutboundTypes.OUTBOUND_FOUND_PHOTO_EXTRA_ITEM_FAILURE, meta: { id, field, path, outboundLabel, endpoint: IMAGE_UPLOAD_API } },
      },
      auth: {
        enable: true
      }
    },
    outboundLabel
  }
}

export function updateFoundPhoto(objectToSend) {
  const outboundLabel = `Upload found item for photo : ${JSON.stringify(objectToSend)}`;
  return {
    type: OutboundTypes.OUTBOUND_FOUND_UPDATE_PHOTO,
    payload: {
      ...objectToSend
    },
    meta: {
      offline: {
        effect: {
          url: UPDATE_LOST_IMAGE,
          options: {
            method: 'POST',
            body: objectToSend
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_FOUND_UPDATE_PHOTO_SUCCESS, meta: { objectToSend, endpoint: UPDATE_LOST_IMAGE } },
        rollback: { type: OutboundTypes.OUTBOUND_FOUND_UPDATE_PHOTO_FAILURE, meta: { objectToSend, outboundLabel, endpoint: UPDATE_LOST_IMAGE } },
      },
      auth: {
        enable: true,
        // useUserId: true
      },
      outboundLabel
    }
  }
}

export function messageAdd(roomId, message) {
  const tapTs = moment().unix();
  const outboundLabel = `Room message add : 
  roomId: ${roomId}
  message:${message}
  `;

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
        commit: { type: UpdatesTypes.ROOM_MESSAGE_ADD_SUCCESS, meta: { endpoint: `${ROOM_MESSAGE_API}/${roomId}` } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_MESSAGE_ADD_FAILURE, meta: { roomId, message, endpoint: `${ROOM_MESSAGE_API}/${roomId}` } },
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
  const outboundLabel = `Room message remove:
  roomId: ${roomId}
  messageIds:${messageIds}
  `;

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
        commit: { type: UpdatesTypes.ROOM_MESSAGE_REMOVE_SUCCESS, meta: { endpoint: `${ROOM_MESSAGE_API}/${roomId}` } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_MESSAGE_REMOVE_FAILURE, meta: { roomId, messageIds, endpoint: `${ROOM_MESSAGE_API}/${roomId}` } },
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
  const outboundLabel = `Room message update:
  roomId: ${roomId}
  messageIds: ${messageIds}
  message: ${message}
  `;

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
        commit: { type: UpdatesTypes.ROOM_MESSAGE_UPDATE_SUCCESS, meta: { endpoint: `${ROOM_MESSAGE_API}/${roomId}` } },
        rollback: { type: OutboundTypes.OUTBOUND_ROOM_MESSAGE_UPDATE_FAILURE, meta: { roomId, messageIds, message, endpoint: `${ROOM_MESSAGE_API}/${roomId}` } },
      },
      auth: {
        enable: true,
        useUserSession: true
      },
      outboundLabel
    }
  }
}

export function inventoryScheduleAssetConsumption(assetConsumationPayload) {
  const outboundLabel = `Inventory minibar asset consumation : ${JSON.stringify(assetConsumationPayload)}`;

  return {
    type: OutboundTypes.OUTBOUND_INVENTORY_ASSET_CONSUMATION,
    payload: assetConsumationPayload,
    meta: {
      offline: {
        effect: {
          url: `${INVENTORY_SCHEDULE_ASSET_CONSUMATION}`,
          options: {
            method: 'POST',
            body: assetConsumationPayload
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_INVENTORY_ASSET_CONSUMATION_SUCCESS, meta: { endpoint: INVENTORY_SCHEDULE_ASSET_CONSUMATION } },
        rollback: { type: OutboundTypes.OUTBOUND_INVENTORY_ASSET_CONSUMATION_FAILURE, meta: { outboundLabel, assetConsumationPayload, endpoint: INVENTORY_SCHEDULE_ASSET_CONSUMATION } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function inventoryScheduleGroupedAssetConsumption(assetConsumationPayload) {
  const outboundLabel = `Inventory grouped asset consumation : ${JSON.stringify(assetConsumationPayload)}`;
  return {
    type: OutboundTypes.OUTBOUND_INVENTORY_ASSET_CONSUMATION,
    payload: assetConsumationPayload,
    meta: {
      offline: {
        effect: {
          url: `${INVENTORY_SCHEDULE_GROUPED_ASSET_CONSUMATION}`,
          options: {
            method: 'POST',
            body: assetConsumationPayload
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_INVENTORY_ASSET_CONSUMATION_SUCCESS, meta: { endpoint: INVENTORY_SCHEDULE_GROUPED_ASSET_CONSUMATION } },
        rollback: { type: OutboundTypes.OUTBOUND_INVENTORY_ASSET_CONSUMATION_FAILURE, meta: { outboundLabel, assetConsumationPayload, endpoint: INVENTORY_SCHEDULE_GROUPED_ASSET_CONSUMATION } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}



export function inventoryConfirmAssetConsumption(confirmAssetPayload) {
  const outboundLabel = `Inventory confirm asset consumation : ${JSON.stringify(confirmAssetPayload)}`;
  return {
    type: OutboundTypes.OUTBOUND_INVENTORY_CONFIRM_ASSET_CONSUMATION,
    payload: confirmAssetPayload,
    meta: {
      offline: {
        effect: {
          url: `${INVENTORY_CONFIRM_ASSET_CONSUMATION}`,
          options: {
            method: 'POST',
            body: confirmAssetPayload
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_INVENTORY_CONFIRM_ASSET_CONSUMATION_SUCCESS, meta: { confirmAssetPayload, endpoint: INVENTORY_CONFIRM_ASSET_CONSUMATION } },
        rollback: { type: OutboundTypes.OUTBOUND_INVENTORY_CONFIRM_ASSET_CONSUMATION_FAILURE, meta: { outboundLabel, confirmAssetPayload, endpoint: INVENTORY_CONFIRM_ASSET_CONSUMATION } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function inventoryWithdrawal(asset, withdrawal, roomId) {
  const tapTs = moment().unix();
  const outboundLabel = `Inventory withdrawal update: 
  roomId:${roomId}
  assetId:${asset._id}
  withdrawal:${withdrawal}
  `;

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
        commit: { type: OutboundTypes.OUTBOUND_INVENTORY_WITHDRAWAL_SUCCESS, meta: { endpoint: `${INVENTORY_API}/${asset._id}/withdrawal` } },
        rollback: { type: OutboundTypes.OUTBOUND_INVENTORY_WITHDRAWAL_FAILURE, meta: { roomId, withdrawal, asset, endpoint: `${INVENTORY_API}/${asset._id}/withdrawal` } },
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
  const outboundLabel = `Inventory rejection update: ${asset.asset}
  rejected:${rejected}`;

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
        commit: { type: OutboundTypes.OUTBOUND_INVENTORY_REJECTION_SUCCESS, meta: { endpoint: `${INVENTORY_API}/${asset.asset}/deposit/reject` } },
        rollback: { type: OutboundTypes.OUTBOUND_INVENTORY_REJECTION_FAILURE, meta: { rejected, asset, endpoint: `${INVENTORY_API}/${asset.asset}/deposit/reject` } },
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
  const outboundLabel = `Found item update:
  id: ${id}
  item: ${JSON.stringify(item)}
  `;

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
        commit: { type: OutboundTypes.OUTBOUND_UPDATE_FOUND_ITEM_SUCCESS, meta: { endpoint: `${LOST_ITEM_API}/${id}` } },
        rollback: { type: OutboundTypes.OUTBOUND_UPDATE_FOUND_ITEM_FAILURE, meta: { id, item, endpoint: `${LOST_ITEM_API}/${id}` } },
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
  const outboundLabel = `Extra option update:
  roomId:${roomId}
  label:${label}
  isCompleted:${isCompleted}
  `;

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
        commit: { type: OutboundTypes.OUTBOUND_UPDATE_EXTRA_OPTION_SUCCESS, meta: { roomId, label, isCompleted, endpoint: `${EXTRA_OPTION_API}/${roomId}` } },
        rollback: { type: OutboundTypes.OUTBOUND_UPDATE_EXTRA_OPTION_FAILURE, meta: { roomId, label, isCompleted, endpoint: `${EXTRA_OPTION_API}/${roomId}` } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function updateNightlyCleaningStatus(roomId, turnDownPayload) {
  const tapTs = moment().unix();
  const outboundLabel = `Night planning update:
  turnDownPayload: ${JSON.stringify(turnDownPayload)}
  roomId:${roomId}
  `;
  // const outboundLabel = `Create cleaning: ${cleanPayload.roomId}`;

  return {
    type: OutboundTypes.OUTBOUND_NIGHTLY_PLANNING_STATUS_UPDATE,
    payload: {
      turnDownPayload
    },
    meta: {
      offline: {
        effect: {
          url: NIGHTLY_CLEANING_UPDATE_API,
          options: {
            method: 'POST',
            body: { status: turnDownPayload.status, timestamp: turnDownPayload.timestamp, cleaningId: turnDownPayload.cleaningId, roomId: turnDownPayload.cleaningId == null ? roomId : null }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_NIGHTLY_PLANNING_STATUS_UPDATE_SUCCESS, meta: { turnDownPayload, endpoint: NIGHTLY_CLEANING_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_NIGHTLY_PLANNING_STATUS_UPDATE_FAILURE, meta: { turnDownPayload, tapTs, outboundLabel, endpoint: NIGHTLY_CLEANING_UPDATE_API } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function planningBulk(plannings) {
  const tapTs = moment().unix();
  const outboundLabel = `Planning: ${JSON.stringify(turnDownPayload)}`;

  return {
    type: OutboundTypes.OUTBOUND_PLANNING_BULK,
    payload: {
      plannings
    },
    meta: {
      offline: {
        effect: {
          url: PLANNING_API,
          options: {
            method: 'PUT',
            body: { plannings, tapTs }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_PLANNING_BULK_SUCCESS, meta: { endpoint: PLANNING_API } },
        rollback: { type: OutboundTypes.OUTBOUND_PLANNING_BULK_FAILURE, meta: { plannings, tapTs, endpoint: PLANNING_API } },
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
  const outboundLabel = `Night planning bulk: ${JSON.stringify(plannings)}`;

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
        commit: { type: OutboundTypes.OUTBOUND_NIGHT_PLANNING_BULK_SUCCESS, meta: { endpoint: PLANNING_NIGHT_API } },
        rollback: { type: OutboundTypes.OUTBOUND_NIGHT_PLANNING_BULK_FAILURE, meta: { plannings, tapTs, endpoint: PLANNING_NIGHT_API } },
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
  const outboundLabel = `Night planning update: ${JSON.stringify(planning)}`;

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
        commit: { type: OutboundTypes.OUTBOUND_NIGHT_PLANNING_UPDATE_SUCCESS, meta: { endpoint: `${PLANNING_NIGHT_API}/${planning.room_id}` } },
        rollback: { type: OutboundTypes.OUTBOUND_NIGHT_PLANNING_UPDATE_FAILURE, meta: { planning, tapTs, endpoint: `${PLANNING_NIGHT_API}/${planning.room_id}` } },
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
        commit: { type: UpdatesTypes.TASK_SUBMIT_PHOTO, meta: { uuid, path, endpoint: IMAGE_UPLOAD_API } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_SUBMIT_ADD_PHOTO_FAILURE, meta: { path, uuid, outboundLabel, endpoint: IMAGE_UPLOAD_API } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function uploadTaskAdditionalPhoto(additionalImage) {
  const tapTs = moment().unix();
  const outboundLabel = `Task create message: ${JSON.stringify(additionalImage)}`;

  return {
    type: OutboundTypes.OUTBOUND_TASK_ADDITIONAL_IMAGE,
    payload: {
      ...additionalImage
    },
    meta: {
      offline: {
        effect: {
          url: TASK_ADDITIONAL_IMAGE,
          options: {
            method: 'POST',
            body: {
              ...additionalImage
            }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_TASK_ADDITIONAL_IMAGE_SUCCESS, meta: { endpoint: TASK_ADDITIONAL_IMAGE } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_ADDITIONAL_IMAGE_FAILURE, meta: { ...additionalImage, outboundLabel, endpoint: TASK_ADDITIONAL_IMAGE } },
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
        commit: { type: OutboundTypes.OUTBOUND_TASK_SUBMIT_ADD_PHOTO_SUCCESS, meta: { endpoint: `${TASK_API}/${uuid}/photo` } },
        rollback: { type: OutboundTypes.OUTBOUND_TASK_SUBMIT_ADD_PHOTO_FAILURE, meta: { uuid, url, tapTs, endpoint: `${TASK_API}/${uuid}/photo` } },
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
  const outboundLabel = `Moving tasks to someday : ${uuids}`;

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
        commit: { type: OutboundTypes.OUTBOUND_TASKS_TO_SOMEDAY_SUCCESS, meta: { endpoint: `${TASKS_SOMEDAY_API}/to_someday` } },
        rollback: { type: OutboundTypes.OUTBOUND_TASKS_TO_SOMEDAY_FAILURE, meta: { uuids, tapTs, endpoint: `${TASKS_SOMEDAY_API}/to_someday` } },
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
  const outboundLabel = `Moving tasks from someday: ${uuids}`;

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
        commit: {
          type: OutboundTypes.OUTBOUND_TASKS_FROM_SOMEDAY_SUCCESS, meta: { endpoint: `${TASKS_SOMEDAY_API}/from_someday` }
        },
        rollback: { type: OutboundTypes.OUTBOUND_TASKS_FROM_SOMEDAY_FAILURE, meta: { uuids, tapTs, endpoint: `${TASKS_SOMEDAY_API}/from_someday` } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function inspectionUploadPhoto({ uuid, field, path }) {
  const tapTs = moment().unix();
  const outboundLabel = "Sending inspection photo";

  return {
    type: OutboundTypes.OUTBOUND_INSPECTION_UPLOAD_PHOTO,
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
        commit: { type: UpdatesTypes.INSPECTION_SUBMIT_PHOTO, meta: { uuid, field, path, endpoint: IMAGE_UPLOAD_API } },
        rollback: { type: OutboundTypes.OUTBOUND_INSPECTION_SUBMIT_PHOTO_FAILURE, meta: { path, uuid, outboundLabel, endpoint: IMAGE_UPLOAD_API } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function inspectionSubmitPhoto(uuid, field, url) {
  const tapTs = moment().unix();
  const outboundLabel = `Upload added photo for inspection: ${uuid}`;

  return {
    type: OutboundTypes.OUTBOUND_TASK_SUBMIT_ADD_PHOTO,
    payload: {
      uuid,
      field,
      url
    },
    meta: {
      offline: {
        effect: {
          url: `/inspections/${uuid}/photo`,
          options: {
            method: 'PUT',
            body: { url, field, tapTs }
          }
        },
        commit: {
          type: OutboundTypes.OUTBOUND_INSPECTION_SUBMIT_PHOTO_SUCCESS, meta: { endpoint: `/inspections/${uuid}/photo` }
        },
        rollback: { type: OutboundTypes.OUTBOUND_INSPECTION_SUBMIT_PHOTO_FAILURE, meta: { uuid, url, tapTs, endpoint: `/inspections/${uuid}/photo` } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function createAuditInsertRoute({ audit }) {
  const tapTs = moment().unix();
  const outboundLabel = `create audit insert: 
  ${JSON.stringify(audit)}
  `;
  return {
    type: OutboundTypes.OUTBOUND_CREATE_AUDIT_INSERT_ROUTE,
    payload: {
      audit
    },
    meta: {
      offline: {
        effect: {
          url: AUDIT_INSERT_ROUTE_API,
          options: {
            method: 'POST',
            body: { ...audit }
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_CREATE_AUDIT_INSERT_ROUTE_SUCESS, meta: { endpoint: AUDIT_INSERT_ROUTE_API,taskId: audit.taskId} },
        rollback: { type: OutboundTypes.OUTBOUND_CREATE_AUDIT_INSERT_ROUTE_FAILURE, meta: { audit, outboundLabel, endpoint: AUDIT_INSERT_ROUTE_API } },
      },
      auth: {
        enable: true
      },
      outboundLabel
    }
  }
}

export function auditInsert({ audit, inspections }) {
  const tapTs = moment().unix();
  const outboundLabel = `Inserting audit: 
  ${JSON.stringify(audit)}
  `;

  return {
    type: OutboundTypes.OUTBOUND_AUDIT_INSERT,
    payload: {
      audit,
      inspections
    },
    meta: {
      offline: {
        effect: {
          url: AUDIT_API,
          options: {
            method: 'POST',
            body: { audit }
          }
        },
        commit: { type: UpdatesTypes.AUDIT_FINISH_INSERT, meta: { audit, inspections, endpoint: AUDIT_API } },
        rollback: { type: OutboundTypes.OUTBOUND_AUDIT_REQUEST_FAILURE, meta: { audit, tapTs, endpoint: AUDIT_API } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function auditUpdate({ id, audit, inspections }) {
  const tapTs = moment().unix();
  const outboundLabel = `Update audit
  id:${id}
  audit: ${JSON.stringify(audit)}
  `;


  return {
    type: OutboundTypes.OUTBOUND_AUDIT_UPDATE,
    payload: {
      id,
      audit,
      inspections
    },
    meta: {
      offline: {
        effect: {
          url: `${AUDIT_API}/${id}`,
          options: {
            method: 'PUT',
            body: { audit }
          }
        },
        commit: { type: UpdatesTypes.AUDIT_FINISH_UPDATE, meta: { id, audit, inspections, endpoint: `${AUDIT_API}/${id}` } },
        rollback: { type: OutboundTypes.OUTBOUND_AUDIT_REQUEST_FAILURE, meta: { id, audit, tapTs, endpoint: `${AUDIT_API}/${id}` } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function auditTemplateUpdate({ audit }) {
  const tapTs = moment().unix();
  const outboundLabel = `Update audit template : 
  ${JSON.stringify(audit)}
  `;

  return {
    type: OutboundTypes.OUTBOUND_AUDIT_TEMPLATE_UPDATE,
    payload: audit,
    meta: {
      offline: {
        effect: {
          url: `${AUDIT_UPDATE_API}`,
          options: {
            method: 'POST',
            body: audit
          }
        },
        commit: { type: OutboundTypes.OUTBOUND_AUDIT_TEMPLATE_UPDATE_SUCCESS, meta: { audit, endpoint: AUDIT_UPDATE_API } },
        rollback: { type: OutboundTypes.OUTBOUND_AUDIT_TEMPLATE_REQUEST_FAILURE, meta: { audit, tapTs, endpoint: AUDIT_UPDATE_API } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function inspectionInsertAll({ inspections, photos }) {
  const tapTs = moment().unix();
  const outboundLabel = `Save inspection results:
  ${JSON.stringify(inspections)}
  `;

  return {
    type: OutboundTypes.OUTBOUND_INSPECTION_INSERT_ALL,
    payload: {
      inspections
    },
    meta: {
      offline: {
        effect: {
          url: INSPECTION_API,
          options: {
            method: 'POST',
            body: { inspections }
          }
        },
        commit: { type: UpdatesTypes.INSPECTION_FINISH_INSERT_ALL, meta: { inspections, photos, endpoint: INSPECTION_API } },
        rollback: { type: OutboundTypes.OUTBOUND_INSPECTION_REQUEST_FAILURE, meta: { inspections, photos, tapTs, endpoint: INSPECTION_API } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function inspectionUpdateAll({ inspections, photos }) {
  const tapTs = moment().unix();
  const outboundLabel = `Save inspection results :
   ${JSON.stringify(inspections)}`;

  return {
    type: OutboundTypes.OUTBOUND_INSPECTION_UPDATE_ALL,
    payload: {
      inspections
    },
    meta: {
      offline: {
        effect: {
          url: INSPECTION_API,
          options: {
            method: 'POST',
            body: { inspections }
          }
        },
        commit: { type: UpdatesTypes.INSPECTION_FINISH_UPDATE_ALL, meta: { inspections, photos, endpoint: INSPECTION_API } },
        rollback: { type: OutboundTypes.OUTBOUND_INSPECTION_REQUEST_FAILURE, meta: { inspections, photos, tapTs, endpoint: INSPECTION_API } },
      },
      auth: {
        enable: true,
      },
      outboundLabel
    }
  }
}

export function ReservationCameToBreakfastFlow(data) {
  const reservationId = data.reservationId
  const numberOfGuests = data.numberOfGuests
  const outboundLabel = `Reservation Came To Breakfast: 
  reservationId:${reservationId}
  numberOfGuests:${numberOfGuests}
  `;

  return {
    type: RoomsTypes.RESERVATION_CAME_TO_BREAKFAST,
    payload: {
      reservationId,
      numberOfGuests
    },
    meta: {
      offline: {
        effect: {
          url: `${CAME_TO_BREAKFAST}`,
          options: {
            method: 'POST',
            body: { reservationId: reservationId, numberOfGuests: numberOfGuests}
          }
        },
        commit: { type: RoomsTypes.RESERVATION_CAME_TO_BREAKFAST_SUCCESS, meta: { reservationId:reservationId, numberOfGuests: numberOfGuests, endpoint: CAME_TO_BREAKFAST } },
        rollback: { type: RoomsTypes.RESERVATION_CAME_TO_BREAKFAST_FAILURE, meta: { reservationId, numberOfGuests,outboundLabel, endpoint: CAME_TO_BREAKFAST } }
      },
      auth: {
        enable: true,
        useUserSession: false
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
  roomCancelStatus,
  roomCancel,
  logOther,
  logClean,
  roomHousekeepingUpdate,
  roomUpdate,
  roomAttendantInspect,
  roomMessageCreate,
  roomCreateCleaning,
  roomUpdatePriority,
  taskCreate,
  tasksCreate,
  taskUpdate,
  taskCreateMessage,
  taskUpdateBatch,
  taskReassign,
  taskDeparture,
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
  inventoryScheduleAssetConsumption,
  inventoryScheduleGroupedAssetConsumption,
  inventoryConfirmAssetConsumption,
  inventoryWithdrawal,
  inventoryRejection,
  updateFoundItem,
  updateExtraOption,
  planningBulk,
  updateNightlyCleaningStatus,
  nightPlanningBulk,
  nightPlanningUpdate,
  uploadTaskAddPhoto,
  uploadTaskAdditionalPhoto,
  uploadTaskSubmitAddPhoto,
  tasksToSomeday,
  tasksFromSomeday,
  inspectionUploadPhoto,
  inspectionSubmitPhoto,
  createAuditInsertRoute,
  auditInsert,
  auditUpdate,
  deleteAuditApi,
  auditTemplateUpdate,
  inspectionInsertAll,
  inspectionUpdateAll,
  removeFailed,
  retryFailed,
  resetOffline,
  updateGuestCurrentlyIn,
  updateNightlyInspectionStatusFu,
  assignNewCleaning,
  reAssignNewCleaning,
  cencleCleaning,
  ReservationCameToBreakfastFlow
}