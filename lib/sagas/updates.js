import { takeLatest, takeEvery, put, call, select, fork, all, throttle } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import { get, keys, has, extend, omit } from 'lodash/object';
import { filter, includes, find, groupBy, map } from 'lodash/collection';
import { isNumber, isEmpty } from 'lodash/lang';
import { first, compact } from 'lodash/array';
import moment from 'moment';

import digestAssignment from '../utils/digest-assignment';
import buildTask from '../utils/build-task';
import buildUpdateTask from '../utils/build-update-task';
import buildReassignTask from '../utils/build-reassign-task';

import UpdatesTypes from '../constants/updates';
import UpdatesActions from '../actions/updates';
import OutboundActions from '../actions/outbound';
import AssetsActions from '../actions/assets';
import RoomsActions from '../actions/rooms';
import OverlayActions from '../actions/overlay';
import { Audits, Inspections } from 'rc-mobile-base/lib/models';

import { userIdSelector, userSelector, hotelIdSelector, userInfoSelector } from '../selectors/auth';
import { planningsNightSelector, tasksSelector } from '../selectors/rooms';
import { photosSelector } from '../selectors/updates';
import { availableHotelsSelector } from 'rc-mobile-base/lib/selectors/auth';

import request, { authRequest } from '../utils/request';
import { forkWatchers } from '../utils/sagas';
import { roomUpdate as ruHash } from '../utils/hashes';
import { offlineable } from '../offline';
import {
  tokenSelector,
  hotelNameSelector
} from "../selectors/auth";
import { planningsSelector } from '../selectors/rooms';
import _ from 'lodash';

export default function ({ apiUrl }) {
  // const ROOM_UPDATE_API = `/room_update`;
  const ROOM_LOG_CLEAN_API = `/attendant`;
  const ROOM_NOTES_API = `/room_notes`;
  const ROOM_INSERT_NOTES_API = `/Room/InsertNote`;
  const ROOM_DELETE_NOTES_API = `/Room/DeleteNote`;
  // const IMAGE_UPLOAD_API = 'https://upload.roomchecking.com/image-upload';
  const IMAGE_UPLOAD_API = 'https://www.filestackapi.com/api/store/S3?key=AwMlkjOdcTp2fmqSd0KPDz';
  const LOST_ITEM_API = `/lost_found/founds`;
  const INVENTORY_API = `/hotel_inventory`;
  const TASK_API = `/tasks`;
  const TASK_BATCH_API = `/tasks/batch`;
  const VIRTUAL_ASSETS_API = `/virtual_assets`;
  const PLANNING_API = `/attendant_plannings`;
  const ROOM_RESET_API = `/room_reset`;
  const GLITCHES_API = `/glitches`;
  const ROOM_CLEANING_LIST_API = `/Cleaning/GetListOfCleanings`;
  const ROOM_INSERT_CLEANING = `/Cleaning/InsertCleaning`;

  function* fetchCleaningList() {
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, ROOM_CLEANING_LIST_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId
      })
    });
  }

  function* updateTurnDownRoomFlow({ field, updateTurnDownStatus, tapTs }) {
    const roomId = get(updateTurnDownStatus, 'roomId', null);
    const validateUpdateTurnDownStatus = omit(updateTurnDownStatus, 'roomId');
    const status = get(updateTurnDownStatus, 'status', null);
    const turnDownPayload = {
      ...validateUpdateTurnDownStatus,
      timestamp: tapTs
    }
    yield put(RoomsActions.updateRoomOptimistic({ roomId, field: 'turndownService', value: status }));
    yield put(OutboundActions.updateNightlyCleaningStatus(roomId, turnDownPayload));

    // updateNightlyCleaningStatus
  }

  // Update Room
  function* updateRoomFlow({ roomId, status, tapTs }) {
    const { updates: { outgoingHashes: { room } } } = yield select();
    const oldHash = get(room, roomId, null);
    const hash = ruHash(roomId, 'attendantStatus', status);
    const hotelPlannings = yield select(planningsSelector);

    const hotelNightyPlanning = yield select(planningsNightSelector);

    try {

      const cleanListRoom = find(hotelPlannings, { room_id: roomId }) || {};
      const cleanListRoomNight = find(hotelNightyPlanning, { room_id: roomId }) || {};

      if (isEmpty(cleanListRoom, true) && isEmpty(cleanListRoomNight, true)) {
        return true;
      }

      yield put(UpdatesActions.saveOutgoingHash('room', roomId, hash));
      yield put(RoomsActions.updateRoomOptimistic({ roomId, field: 'attendantStatus', value: status }));


      if (status === "cleaning") {
        yield put(OutboundActions.roomCleanStart(roomId, cleanListRoom));
      } else if (status === "paused") {
        yield put(OutboundActions.roomCleanPause(roomId, cleanListRoom));
      } else if (status === "finish") {
        yield put(OutboundActions.roomCleanFinish(roomId, cleanListRoom));
      } else if (status === "delay") {
        yield put(OutboundActions.roomDelay(roomId, cleanListRoom));
      } else if (status === "dnd") {
        yield put(OutboundActions.roomDND(roomId, cleanListRoom));
      } else if (status === "refuse") {
        yield put(OutboundActions.roomRefuse(roomId, cleanListRoom));
      } else if (status === "voucher") {
        yield put(OutboundActions.roomVoucher(roomId, cleanListRoom));
      } else if (status === "no-check") {
        yield put(OutboundActions.roomNoCheck(roomId, cleanListRoom));
      } else if (status === "confirm-dnd") {
        yield put(OutboundActions.roomConfirmDND(roomId, cleanListRoom));
      } else if (status === 'cancel-finish') {
        yield put(OutboundActions.roomCancelStatus(roomId, cleanListRoom, 'cancel-finish'));
      } else if (status === 'cancel-dnd') {
        yield put(OutboundActions.roomCancelStatus(roomId, cleanListRoom, 'cancel-dnd'));
      } else if (status === 'cancel-refuse') {
        yield put(OutboundActions.roomCancelStatus(roomId, cleanListRoom, 'cancel-refuse'));
      } else if (status === "") {
        yield put(OutboundActions.roomCancel(roomId, cleanListRoom));
      }

      // if (['dnd', 'refuse', 'voucher', 'delay', 'confirm-dnd'].includes(status)) {
      //   const { auth: { user }, rooms: { hotelRooms }} = yield select();
      //   const room = find(hotelRooms, { id: roomId });
      //   yield put(OutboundActions.logOther(room, user, status));
      // }

      if (status === 'finish' || status === 'no-check') {
        const { auth: { user }, updates: { rooms: roomUpdates }, rooms: { hotelRooms } } = yield select();
        // const room = find(hotelRooms, { _id: roomId });
        // const roomUpdate = get(roomUpdates, roomId, {});
        // yield put(OutboundActions.logClean(room, user, roomUpdate))
        yield put(UpdatesActions.roomCleanFlush(roomId));
      }

      return true
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  //update nighty inspection status from inspector app
  function* updateNightyInspectionStatus({ field, updateTurnDownStatus, tapTs }) {
    const roomId = get(updateTurnDownStatus, 'roomId', null);
    const validateUpdateTurnDownStatus = omit(updateTurnDownStatus, 'roomId');
    const status = get(updateTurnDownStatus, 'status', null);
    const turnDownPayload = {
      ...validateUpdateTurnDownStatus,
      timestamp: tapTs
    }

    // yield put(RoomsActions.updateRoomOptimistic({ roomId, field: 'turndownService', value: status }));
    yield put(OutboundActions.updateNightlyInspectionStatusFu(roomId, turnDownPayload));
  }


  function* watchUpdateRoomFinish(state) {
    yield throttle(3000, UpdatesTypes.ROOM_CLEAN_FINISH, updateRoomFlow);
  }

  function* watchUpdateRoomCleaning(state) {
    yield throttle(3000, UpdatesTypes.ROOM_CLEAN_START, updateRoomFlow);
  }

  function* watchUpdateRoomPause(state) {
    yield throttle(3000, UpdatesTypes.ROOM_CLEAN_PAUSE, updateRoomFlow);
  }

  function* watchUpdateRoomUnpause(state) {
    yield throttle(3000, UpdatesTypes.ROOM_CLEAN_UNPAUSE, updateRoomFlow);
  }

  function* watchUpdateRoomCleaning(state) {
    yield throttle(3000, UpdatesTypes.ROOM_CLEAN_START, updateRoomFlow);
  }

  function* watchUpdateRoomDelay(state) {
    yield throttle(3000, UpdatesTypes.ROOM_DELAY, updateRoomFlow);
  }

  function* watchUpdateRoomDND(state) {
    yield throttle(3000, UpdatesTypes.ROOM_DND, updateRoomFlow);
  }

  function* watchUpdateRoomRefuse(state) {
    yield throttle(3000, UpdatesTypes.ROOM_REFUSE, updateRoomFlow);
  }

  function* watchUpdateRoomVoucher(state) {
    yield throttle(3000, UpdatesTypes.ROOM_VOUCHER, updateRoomFlow);
  }

  function* watchUpdateRoomInspect(state) {
    yield throttle(3000, UpdatesTypes.ROOM_INSPECT, updateRoomFlow);
  }

  function* watchUpdateRoomNoCheck(state) {
    yield throttle(3000, UpdatesTypes.ROOM_NO_CHECK, updateRoomFlow);
  }

  function* watchUpdateRoomConfirmDND(state) {
    yield throttle(3000, UpdatesTypes.ROOM_CONFIRM_DND, updateRoomFlow);
  }

  function* watchUpdateRoomCancel(state) {
    yield throttle(3000, UpdatesTypes.ROOM_CANCEL, updateRoomFlow);
  }

  // Room Mobile Housekeeping
  function* mobileHousekeepingFlow({ roomId, roomHousekeeping, attendantStatus }) {
    try {
      yield put(RoomsActions.updateRoomOptimistic({ roomId, field: 'roomHousekeeping', value: roomHousekeeping }));
      yield put(RoomsActions.updateRoomOptimistic({ roomId, field: 'attendantStatus', value: attendantStatus }));
      // const response = yield call(attendantInspect, { roomId, roomHousekeeping, attendantStatus });
      yield put(OutboundActions.roomAttendantInspect(roomId, roomHousekeeping, attendantStatus));
      // const room = response.room;

      // return yield put(RoomsActions.updateRoom(room))
    } catch (error) {

    }
  }

  function* watchMobileHousekeepingFlow(state) {
    yield takeLatest(UpdatesTypes.ROOM_MOBILE_INSPECT, mobileHousekeepingFlow);
  }

  // Reset Room
  function* resetRoomFlow({ roomId, turnDown }) {

    const roomIdNew = get(roomId, "id", null)
    const newStatus = "HD"
    const objectToSend = {
      roomId: get(roomId, "id", null),
      cleaningId: turnDown ? get(roomId, "roomNightPlanning.id", null) : get(roomId, "roomPlanning", null),
      status: "HD",
      timestamp: 0
    }

    const hash = ruHash(roomId, 'attendantStatus', newStatus);

    try {
      yield put(UpdatesActions.saveOutgoingHash('room', roomIdNew, hash));
      yield put(RoomsActions.updateRoomOptimistic({ roomId: roomIdNew, field: 'attendantStatus', value: '' }));

      if (turnDown) {
        yield put(OutboundActions.updateNightlyInspectionStatusFu(roomIdNew, objectToSend))
      }
      else {
        yield put(OutboundActions.roomHousekeepingUpdate(roomIdNew, newStatus, objectToSend.cleaningId))
      }
      // yield put(OutboundActions.roomReset(roomIdNew ,objectToSend ))

      // yield put(OutboundActions.roomReset(roomId))
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchResetRoomFlow() {
    yield throttle(3000, UpdatesTypes.ROOM_RESET, resetRoomFlow);
  }

  function* createPlanning({ room, user }) {
    const roomId = get(room, 'id', null)
    const planingPayload = {
      hotelId: get(room, 'hotelId', null),
      description: "Custom cleaning",
      credits: 20,
      roomId: roomId,
      roomBedId: null,
      cleanerId: get(user, 'id', null),
      changeSheets: false
    }

    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, ROOM_INSERT_CLEANING, {
      method: 'POST',
      body: JSON.stringify(planingPayload)
    });
  }

  // Room Model
  function* updateRoomModelFlow({ room, status }) {
    const roomId = get(room, 'id', null);
    const loginUser = yield select(userSelector);
    const hotelPlannings = yield select(planningsSelector);
    const cleanListRoom = find(hotelPlannings, { room_id: roomId }) || {};

    yield put(RoomsActions.isSocketFireOnUpdateInspection({ isFire: false }))

    if (isEmpty(cleanListRoom, true)) {
      try {
        //when cleaner not assign
        // const cleannerId = get(room, 'roomInspectionPlanning.id', null);
        const customeCleanPayload = {
          id: null
        }

        yield put(OutboundActions.roomHousekeepingUpdate(roomId, status, customeCleanPayload));
      } catch (error) {
        console.log(error)
      }
    } else {
      const oldHash = get(room, roomId, null);
      const hash = moment().unix();

      // if (isNumber(oldHash) && oldHash + 3 >= hash) {
      //   return true;
      // }

      try {
        //when cleaner assign

        // yield put(UpdatesActions.saveOutgoingHash('room', roomId, hash));
        // yield put(RoomsActions.updateRoomOptimistic({ roomId, field, value }));
        // yield put(OutboundActions.roomHousekeepingUpdate(roomId, field, value));
        yield put(OutboundActions.roomHousekeepingUpdate(roomId, status, cleanListRoom));
        return true;
      } catch (error) {
        console.log(error);
      }

    }
  }

  //update room locator
  function* updateRoomLocatorFlow({ roomId, value, bedId }) {
    const finalObject = {
      roomId, isGuestCurrentlyIn: value, bedId
    }
    yield put(OutboundActions.updateGuestCurrentlyIn(finalObject));
  }

  function* sendRoomMessageModelFlow({ roomMessagePayload }) {
    const userHotelId = yield select(hotelIdSelector);
    const timeStamp = moment().format();
    const valiadtePayload = {
      ...roomMessagePayload,
      createdAt: timeStamp,
      hotelId: userHotelId
    }

    yield put(OutboundActions.roomMessageCreate(valiadtePayload));
  }

  function* watchRoomModelComment() {
    yield throttle(3000, UpdatesTypes.ROOM_COMMENT, sendRoomMessageModelFlow);
  }

  function* watchRoomModelGuestLocator() {
    yield throttle(3000, UpdatesTypes.ROOM_GUEST_LOCATOR, updateRoomLocatorFlow);
  }

  function* watchRoomModelUnblock() {
    yield throttle(3000, UpdatesTypes.ROOM_UNBLOCK, updateRoomModelFlow);
  }

  function* watchRoomModelAddChangeSheets() {
    yield throttle(3000, UpdatesTypes.ROOM_ADD_CHANGE_SHEETS, updateRoomModelFlow);
  }

  function* watchRoomModelHousekeeping() {
    yield throttle(3000, UpdatesTypes.ROOM_HOUSEKEEPING, updateRoomModelFlow);
  }

  function* watchRoomModelUpdateNightyInspection() {
    yield throttle(3000, UpdatesTypes.ROOM_NIGHTY_HOUSEKEEPING, updateNightyInspectionStatus);
  }

  function* watchRoomModelRestock() {
    yield throttle(3000, UpdatesTypes.ROOM_RESTOCK, updateRoomModelFlow);
  }

  function* watchRoomModelTurndown() {
    // yield throttle(3000, UpdatesTypes.ROOM_TURNDOWN, updateRoomModelFlow);
    // yield throttle(3000, UpdatesTypes.ROOM_TURNDOWN, updateRoomFlow);
    yield throttle(3000, UpdatesTypes.ROOM_TURNDOWN, updateTurnDownRoomFlow);
  }

  // Planning
  const roomPlanning = offlineable('roomPlanning', function* roomPlanning({ room, user, options }) {
    const { auth: { userId }, rooms: { hotelPlannings } } = yield select();
    const { _id: roomId, roomCredits, roomPlanning: planning } = room;

    const isPlanned = !!find(hotelPlannings, { room_id: roomId, is_optimistic: false });
    const endpoint = isPlanned ? `${PLANNING_API}/${roomId}` : PLANNING_API;
    const method = isPlanned ? 'PUT' : 'POST';
    let data;

    if (isPlanned) {
      data = _.extend({}, planning, {
        user_id: user && user._id || null,
        credits: roomCredits,
        room_id: roomId
      })
    } else {
      data = {
        user_id: user && user._id || null,
        room_id: roomId,
        creator_id: userId,
        credits: roomCredits || 1,
        is_priority: 0
      }
    }

    if (options) {
      data = extend({}, data, options);
    }

    return yield call(authRequest, endpoint, {
      method,
      body: JSON.stringify(data)
    });
  })

  function* roomPlanningFlow({ room, user, options }) {
    const roomId = get(room, 'id', null)
    const planingPayload = {
      hotelId: get(room, 'hotelId', null),
      description: "Custom cleaning",
      credits: 20,
      roomId: roomId,
      roomBedId: null,
      cleanerId: get(user, 'id', null),
      changeSheets: false
    }

    yield put(OutboundActions.roomCreateCleaning(planingPayload));
    yield put(RoomsActions.planningsUpdateOptmistic({ roomId, user, options }));
    return yield put(RoomsActions.planningsFetch());
  }



  function* watchRoomPlanningFlow() {
    yield throttle(3000, UpdatesTypes.PLANNING_USER, roomPlanningFlow);
  }

  function* assignCleaningToUserFlow({ room }) {

    yield put(OutboundActions.assignNewCleaning(room));

  }

  function* watchAssignPlanningFlow() {
    yield throttle(3000, UpdatesTypes.ASSIGN_CLEANING_TO_USER, assignCleaningToUserFlow);
  }

  function* reAssignCleaningToUserFlow({ room }) {
    yield put(OutboundActions.reAssignNewCleaning(room));
  }

  function* watchReAssignPlanningFlow() {
    yield throttle(3000, UpdatesTypes.RE_ASSIGN_CLEANING_TO_USER, reAssignCleaningToUserFlow);
  }

  function* roomPriorityUpdateFlow({ room, is_priority }) {
    const priorityPayload = {
      hotelId: get(room, 'hotelId', null),
      roomId: get(room, 'id', null),
      bedId: null,
      isPriority: is_priority
    }

    yield put(OutboundActions.roomUpdatePriority(priorityPayload));
    // yield put(RoomsActions.planningsUpdateOptmistic({ roomId, user, options }));
    return yield put(RoomsActions.planningsFetch());
  }

  function* watchRoomPriorityFlow() {
    yield throttle(3000, UpdatesTypes.ROOM_PRIORITY_UPDATE, roomPriorityUpdateFlow);
  }

  function* roomPlanningBulkFlow({ plannings }) {
    const { auth: { userId: creatorId, hotelId }, rooms: { hotelPlannings } } = yield select();

    const updatedPlannings = plannings.map(planning => ({
      ...planning,
      hotel_id: hotelId,
      creator_id: creatorId
    }));

    yield put(OutboundActions.planningBulk(updatedPlannings));
  }

  function* watchRoomPlanningBulkFlow() {
    yield throttle(3000, UpdatesTypes.PLANNING_USER_BULK, roomPlanningBulkFlow);
  }

  function* roomNightPlanningFlow({ room, user, options }) {
    const { auth: { userId: creatorId, hotelId }, rooms: { hotelPlannings } } = yield select();
    const { _id: roomId, name: roomName } = room;
    const { _id: userId, first_name, last_name, username } = user;

    try {
      const plannings = [
        {
          creator_id: creatorId,
          credits: 1,
          date_ts: moment().unix(),
          hotel_id: hotelId,
          is_change_sheets: 0,
          is_priority: 0,
          planning_date: moment().format('YYYY-MM-DD'),
          planning_user_email: "",
          planning_user_firstname: first_name,
          planning_user_id: userId,
          planning_user_lastname: last_name,
          planning_user_username: username,
          room_id: roomId,
          room_name: roomName,
        }
      ];

      yield put(OutboundActions.nightPlanningBulk(plannings));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchRoomNightPlanningFlow() {
    yield throttle(3000, UpdatesTypes.PLANNING_NIGHT_USER, roomNightPlanningFlow);
  }

  function* roomNightPlanningUpdateFlow({ planning }) {
    try {
      yield put(OutboundActions.nightPlanningUpdate(planning));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchRoomNightPlanningUpdateFlow() {
    yield throttle(3000, UpdatesTypes.PlANNING_NIGHT_UPDATE, roomNightPlanningUpdateFlow);
  }

  // Room Notes
  const createRoomNote = offlineable('createRoomNote', function* createRoomNote({ roomId, note, photo }) {
    const userId = yield select(userIdSelector);
    const userHotelId = yield select(hotelIdSelector);
    let image = null;
    if (photo) {
      image = yield call(uploadPhoto, photo)
    }

    let data = {};
    data = {
      hotel_id: userHotelId,
      room_id: roomId,
      note,
      task_uuid: null,
      application: 'attendant',
      image: null
    }
    if (image) {
      data.image = image
    }

    return yield call(authRequest, `${ROOM_INSERT_NOTES_API}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  })

  function* createRoomNoteFlow({ roomId, note, photo }) {
    yield call(createRoomNote, { roomId, note, photo });
    return yield put(RoomsActions.roomNotesFetch());
  }

  function* watchCreateRoomNote(state) {
    yield throttle(3000, UpdatesTypes.ROOM_NOTE_ADD, createRoomNoteFlow);
  }

  const removeRoomNote = offlineable('removeRoomNote', function* removeRoomNote({ roomId, noteId }) {
    const userHotelId = yield select(hotelIdSelector);
    // return yield call(authRequest, `${ROOM_NOTES_API}/${roomId}/${noteId}`, {
    //   method: 'PUT',
    //   body: JSON.stringify({}),
    // })
    const data = {
      hotel_id: userHotelId,
      room_id: roomId
    }
    return yield call(authRequest, `${ROOM_DELETE_NOTES_API}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  })

  function* removeRoomNoteFlow({ roomId, noteId }) {
    try {
      const response = yield call(removeRoomNote, { roomId, noteId });
      return yield put(RoomsActions.roomNotesFetch());
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchRemoveRoomNote() {
    yield throttle(3000, UpdatesTypes.ROOM_NOTE_REMOVE, removeRoomNoteFlow);
  }

  // Image Upload
  const uploadPhoto = function* (path) {
    try {
      const formData = new FormData();
      formData.append('fileUpload', {
        uri: path,
        name: 'photo.jpg',
        type: 'image/jpeg'
      });

      const response = yield call(request, IMAGE_UPLOAD_API, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data;',
        },
        body: formData,
      });

      return response.url
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // Video Upload
  const uploadVideo = function* (path) {
    try {
      const formData = new FormData();
      formData.append('fileUpload', {
        uri: path,
        name: 'mobile-video-upload',
        type: 'video/mp4'
      });

      const response = yield call(request, IMAGE_UPLOAD_API, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data;',
        },
        body: formData,
      });
      return response.url
    } catch (error) {
      console.log(error)
      return
    }
  }


  function* uploadPhotoFlow({ path, id }) {
    try {
      const photoUrl = yield call(uploadPhoto, path);
      return yield put(UpdatesActions.photoStore({ path, id, url: photoUrl }))
    } catch (e) {
      console.log(e);
      yield put(UpdatesActions.photoUploadFailure(id));
    } finally {

    }
  }

  function* watchUploadPhoto() {
    yield throttle(3000, UpdatesTypes.PHOTO_UPLOAD, uploadPhotoFlow);
  }

  function* generateUploadedImageArray(photos) {
    let uploadedImage = [];
    for (let [index, item] of photos.entries()) {
      // if (item?.assetsType) {
      //   if (item?.assetsType === "image") {
      //     const photoUrl = yield call(uploadPhoto, item.photoPath);
      //     uploadedImage.unshift(photoUrl);
      //   }
      //   else {
      //     const photoUrl = yield call(uploadVideo, item.photoPath);
      //     uploadedImage.unshift(photoUrl);
      //   }
      // }
      // else {
      const photoUrl = yield call(uploadPhoto, item.photoPath);
      uploadedImage.unshift(photoUrl);
      // }
      if (photos.length === (index + 1)) {
        return uploadedImage
      }
    }
  }

  function* addLostItemFlow({ photos, insertLFPayload }) {
    const userId = yield select(userIdSelector);
    const { lostFound } = yield select();

    if (photos.length > 0) {
      const uploadedImage = yield call(generateUploadedImageArray, photos);
      const insertImagePayload = { ...insertLFPayload, image_urls: uploadedImage };
      yield call(submitLostItemFlow, insertImagePayload);
      // yield put(OutboundActions.uploadLFPhoto(lostFound.photoPath, photoId, insertLFPayload));
    } else {
      yield call(submitLostItemFlow, insertLFPayload);
    }
  }

  function* watchAddLostItem() {
    yield throttle(3000, UpdatesTypes.LOST_ITEM_ADD, addLostItemFlow);
  }

  function* addLostItemPhotoFlow({ payload, meta }) {
    try {
      const { photoId, insertLFPayload } = meta;
      const insertImagePayload = { ...insertLFPayload, image: payload }

      yield put(UpdatesActions.photoRemove(photoId));
      yield call(submitLostItemFlow, insertImagePayload);
    } catch (error) {
      console.log(error)
    }
  }

  function* generateLostItem({ payload, meta }) {
  }

  function* watchLostItemPhotoFlow() {
    // yield takeLatest(UpdatesTypes.LOST_ITEM_APPLY_PHOTO, addLostItemPhotoFlow);
    yield takeLatest(UpdatesTypes.LOST_ITEM_APPLY_PHOTO, generateLostItem);
  }

  function* submitLostItemFlow(insertLFPayload) {
    try {
      yield put(OutboundActions.submitLostItem(insertLFPayload));
      yield put(UpdatesActions.lostItemAddSuccess(null));
    } catch (error) {
      console.log(error)
    }
  }

  function* updateFoundItemFlow({ id, item, photoField, photoUrl }) {
    try {
      yield put(OutboundActions.updateFoundItem(id, item));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchUpdateFoundItemFlow() {
    yield takeLatest(UpdatesTypes.LOST_FOUND_UPDATE_FOUND_STATUS, updateFoundItemFlow);
  }

  function* photoFoundItemFlow({ id, field, photoPath }) {
    try {
      if (_.isEmpty(photoPath)) {
        const objectToSend = {
          ...id,
          photoUrls: field
        }
        yield put(OutboundActions.updateFoundPhoto(objectToSend));
      }
      else {
        const imagePayload = photoPath.map((item, index) => {
          return {
            photoPath: item,
            photoId: index + 1
          }
        })

        const uploadedImage = yield call(generateUploadedImageArray, imagePayload)
        const objectToSend = {
          ...id,
          photoUrls: [...uploadedImage, ...field]
        }
        yield put(OutboundActions.updateFoundPhoto(objectToSend));
      }
    } catch (error) {
      console.log(error);
    }
  }

  function* watchPhotoFoundItemFlow() {
    yield takeLatest(UpdatesTypes.LOST_FOUND_UPDATE_FOUND_PHOTO, photoFoundItemFlow);
  }

  function* addLostItemPhotoExtraFlow({ payload, meta }) {
    try {
      const { id, field, path } = meta;
      // yield call(submitLostItemFlow, { desc, roomId, image: payload });
      yield put(OutboundActions.updateFoundPhoto(id, field, payload));
    } catch (error) {
      console.log(error)
    }
  }

  function* watchLostItemExtraPhotoFlow() {
    yield takeLatest(UpdatesTypes.LOST_FOUND_EXTRA_APPLY_PHOTO, addLostItemPhotoExtraFlow);
  }

  const submitInventoryWithdrawl = offlineable('submitInventoryWithdrawl', function* submitInventoryWithdrawl({ asset, change, roomId }) {
    const userId = yield select(userIdSelector);

    const data = {
      userId,
      roomId,
      withdrawal: change
    };

    return yield call(authRequest, `${INVENTORY_API}/${asset._id}/withdrawal`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  })

  function* submitInventoryWithdrawlFlow({ roomId }) {
    const { updates: { inventory, rejections }, assets: { hotelAssetRooms } } = yield select();

    const roomChanges = get(inventory, roomId, {})
    const assetIds = keys(roomChanges);
    const roomAssets = filter(hotelAssetRooms, a => includes(assetIds, get(a, '_id')));
    const filteredAssets = filter(roomAssets, a => get(roomChanges, get(a, '_id'), 0) > 0 && get(a, 'assetType', null) === 'stock');

    const rejectionRoomChanges = get(rejections, roomId, {})
    const rejectionAssetIds = keys(rejectionRoomChanges);
    const rejectionRoomAssets = filter(hotelAssetRooms, a => includes(rejectionAssetIds, get(a, '_id')));
    const rejectionFilteredAssets = filter(rejectionRoomAssets, a => get(rejectionRoomChanges, get(a, '_id'), 0) > 0 && get(a, 'assetType', null) === 'stock');

    // if (!filteredAssets || !filteredAssets.length || !rejectionFilteredAssets || !rejectionFilteredAssets.length) {
    //   return;
    // }

    if (!get(filteredAssets, 'length') && !get(rejectionFilteredAssets, 'length')) {
      return;
    }

    yield put(OverlayActions.overlayShow({ message: 'Updating' }));

    try {
      if (filteredAssets && filteredAssets.length) {
        yield all(filteredAssets.map(asset => put(OutboundActions.inventoryWithdrawal(asset, -1 * get(roomChanges, asset._id, 1), roomId))))
      }
      if (rejectionFilteredAssets && rejectionFilteredAssets.length) {
        yield all(rejectionFilteredAssets.map(asset => put(OutboundActions.inventoryRejection(asset, Math.abs(get(rejectionRoomChanges, asset._id, 1))))))
      }

      yield filteredAssets.map(asset => put(UpdatesActions.resetInventory({ assetRoomId: asset._id, roomId })));
    } catch (e) {
      console.log(e);
    } finally {

    }
    // return yield put(OverlayActions.overlayHide());
  }

  function* watchSubmitInventoryWithdrawal() {
    yield throttle(3000, UpdatesTypes.INVENTORY_FLUSH, submitInventoryWithdrawlFlow);
  }

  // Hotel Inventory Restock
  const submitInventoryRestock = offlineable('submitInventoryRestock', function* submitInventoryRestock({ assetRoomId, id }) {
    return yield call(authRequest, `${INVENTORY_API}/${assetRoomId}/withdrawal/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        is_restocked: 1
      }),
    });
  })

  function* submitInventoryRestockFlow({ assetRoomId, id }) {
    try {
      const response = yield call(submitInventoryRestock, { assetRoomId, id });
      return yield put(AssetsActions.inventoryWithdrawalFetch());
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchSubmitInventoryRestock() {
    yield throttle(3000, UpdatesTypes.INVENTORY_RESTOCK, submitInventoryRestockFlow);
  }

  // ScheduleAssetConsumation
  function* roomScheduleAssetConsumationFlow({ assetConsumation }) {
    try {
      yield put(OutboundActions.inventoryScheduleAssetConsumption(assetConsumation));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchRoomScheduleAssetConsumationFlow() {
    yield throttle(3000, UpdatesTypes.INVENTORY_ASSET_CONSUMATION, roomScheduleAssetConsumationFlow);
  }

  // ConfirmAssetConsumation
  function* roomConfirmAssetConsumationFlow({ confirmAssetConsumption }) {
    try {
      yield put(OutboundActions.inventoryConfirmAssetConsumption(confirmAssetConsumption));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchRoomConfirmAssetConsumationFlow() {
    yield throttle(3000, UpdatesTypes.INVENTORY_CONFIRM_ASSET_CONSUMATION, roomConfirmAssetConsumationFlow);
  }

  function* uploadVideos(photos) {
    try {
      if (!_.isEmpty(photos)) {
        const promises = photos.map((photo) => {
          return call(uploadVideo, photo.photoPath);
        });
        const results = yield all(promises);
        return results
      }
      else {
        return []
      }

    } catch (error) {
      return [];
    }
  }

  // Hotel Tasks
  function* createTaskFlow({ data }) {
    const userHotelId = yield select(hotelIdSelector);
    try {
      yield put(UpdatesActions.taskSending());
    } catch (error) {

    }
    const { imageUrl } = data;
    if (imageUrl.length > 0) {
      const imagePayload = imageUrl.map(item => {
        return {
          photoPath: item.compressUrl ? item.compressUrl : item.assetsPath,
          photoId: item.assetsId,
          assetsType: item?.assetsType ? item?.assetsType : 'photo'
        }
      })

      const filterImageUpload = imagePayload.filter(image => image?.assetsType === "photo")
      const filterVideoUpload = imagePayload.filter(image => image?.assetsType === "video")
      // let uploadedImage = []
      // if (!_.isEmpty(filterImageUpload)) {
      //   uploadedImage = yield call(generateUploadedImage, filterImageUpload);
      // }

      // let uploadedVideo = []
      // if (!_.isEmpty(filterVideoUpload)) {
      //   uploadedVideo = yield call(uploadVideos, filterVideoUpload);
      // }
      let uploadedVideo = []
      let uploadedImage = []
      if (!_.isEmpty(filterImageUpload) || !_.isEmpty(filterVideoUpload)) {
        [uploadedImage, uploadedVideo] = yield all([
          call(generateUploadedImage, filterImageUpload),
          call(uploadVideos, filterVideoUpload)
        ]);
      }

      const task = { ...data, hotelId: userHotelId, imageUrls: uploadedImage, videoUrls: uploadedVideo };
      yield put(OutboundActions.taskCreate(omit(task, ['imageUrl'])));
    } else {
      const task = { ...data, hotelId: userHotelId, imageUrl: null };
      yield put(OutboundActions.taskCreate(task));
    }
    yield delay(1000);
    yield put(UpdatesActions.taskSendingSuccess());
  }

  function* watchCreateTaskFlow() {
    yield throttle(3000, UpdatesTypes.TASK_CREATE, createTaskFlow);
  }

  function* createTaskBatchFlow({ data }) {
    const { auth: { hotelId, token, userId, hotel }, updates: { photos }, users: { users, hotelGroups } } = yield select();
    let image = get(data, 'asset.image', null);
    let task;
    let isPhotoUpload = false;

    try {
      yield put(UpdatesActions.taskSending());
    } catch (error) {

    }

    try {
      if (get(data, 'photoId') && get(photos, [get(data, 'photoId'), 'url'])) {
        image = get(photos, [get(data, 'photoId'), 'url']);
      }

      task = buildTask(data, userId, image, users, hotelGroups);
    } catch (error) {
      console.log(error)
      return;
    }

    if (get(data, 'photoId') && !get(photos, [get(data, 'photoId'), 'url'])) {
      const photoId = get(data, 'photoId');
      const path = get(photos, [photoId, 'path']);

      if (path) {
        // image = yield call(uploadPhoto, path);
        yield put(OutboundActions.uploadTaskPhoto(path, task));
        isPhotoUpload = true;
      }
    }

    if (!isPhotoUpload) {
      yield call(createTaskSubmitFlow, { task });
    }

    yield delay(1000);
    yield put(UpdatesActions.taskSendingSuccess());
  }

  function* watchCreateTaskBatchFlow() {
    yield throttle(3000, UpdatesTypes.TASK_CREATE_BATCH, createTaskBatchFlow);
  }

  function* createTaskApplyPhotoFlow({ meta, payload }) {
    const { task } = meta;
    task.meta.image = payload;
    yield call(createTaskSubmitFlow, { task });
  }

  function* watchCreateTaskApplyPhotoFlow() {
    yield takeLatest(UpdatesTypes.TASK_CREATE_APPLY_PHOTO, createTaskApplyPhotoFlow);
  }

  function* createTaskSubmitFlow({ task }) {
    try {
      if (has(task, 'locations')) {
        yield put(OutboundActions.tasksCreate(task));
      } else {
        yield put(OutboundActions.taskCreate(task));
      }

      if (get(task, 'meta.isGlitch')) {
        const { uuid: task_id, creator_id: userId, meta: { glitchId } } = task;
        yield put(OutboundActions.updateGlitch({ task_id, user_id, glitchId }));
      }

    } catch (error) {
      console.log(error)
    }
  }

  // Update Task  
  function* updateTaskFlow({ uuid, status }) {
    const userId = yield select(userIdSelector);
    const tasks = yield select(tasksSelector);
    const userHotelId = yield select(hotelIdSelector);
    const task = find(tasks, { uuid });

    if (!task) {
      return;
    }

    try {
      const { data, optimistic } = buildUpdateTask(task, uuid, status, userId, userHotelId);

      yield put(RoomsActions.taskUpdateOptimistic({ uuid, update: optimistic }));
      yield put(OutboundActions.taskUpdate(uuid, data));
    } catch (error) {
      console.log(error)
    }
  }

  function* watchUpdateTaskFlow(state) {
    yield throttle(3000, UpdatesTypes.TASK_UPDATE, updateTaskFlow);
  }

  function* createTaskMessage({ taskId, message }) {
    try {
      const payload = {
        taskId: taskId,
        message: message
      }
      yield put(OutboundActions.taskCreateMessage(payload));
    } catch (error) {
      console.log(error)
    }
  }

  function* watchUpdateCreateTaskMessageFlow(state) {
    yield throttle(3000, UpdatesTypes.CREATE_TASK_MESSAGE, createTaskMessage);
  }

  function* updateBatchTasksFlow({ tasks }) {
    const userHotelId = yield select(hotelIdSelector);

    try {
      yield put(OutboundActions.taskUpdateBatch(tasks, userHotelId));

    } catch (error) {
      console.log(error);
    }
  }

  function* watchUpdateBatchTasksFlow(state) {
    yield throttle(3000, UpdatesTypes.TASK_UPDATE_BATCH, updateBatchTasksFlow);
  }

  function* updateBatchPopUpTasksFlow({ tasks }) {
    const availHotels = yield select(availableHotelsSelector);
    const groupByTask = groupBy(tasks, 'hotel_id')

    try {
      const mapTaskByHotelIds = compact(map(availHotels, function (hotels) {
        return groupByTask[get(hotels, 'hotelId', '')]
      }))

      yield all(mapTaskByHotelIds.map(tasks => put(OutboundActions.taskUpdateBatch(map(tasks, function (o) {
        return {
          taskId: get(o, 'taskId', ''),
          status: get(o, 'status', '')
        }
      }), get(first(tasks), 'hotel_id', '')))));

    } catch (error) {
      console.log(error);
    }
  }

  function* watchUpdateBatchPopUpTasksFlow(state) {
    yield throttle(3000, UpdatesTypes.POPUP_TASK_UPDATE_BATCH, updateBatchPopUpTasksFlow);
  }

  function* reassignTaskFlow({ uuid, user, dueDate }) {
    // const userId = get(user, 'id', null)
    // const userId = first(user)
    let userId = {}
    if (get(user, 'isSubGroup', false)) {
      userId = { userSubGroupId: user.value || user.id }
    }
    else if (get(user, 'isSubGroup', null) === false) {
      userId = { userGroupId: user.value || user.id }
    }
    else {
      userId = { userId: user.value || user.id }
    }

    try {
      const data = {
        taskId: uuid,
        startsAtString: dueDate,
        ...userId,
        isForPlannedAttendant: false
      }

      yield put(OutboundActions.taskReassign(uuid, data));

    } catch (error) {
      console.log(error);
    }
  }

  function* watchReassignTaskFlow(state) {
    yield throttle(3000, UpdatesTypes.TASK_REASSIGN, reassignTaskFlow);
  }

  function* departureTaskFlow({ uuid }) {
    try {
      const data = {
        taskId: uuid,
      }
      yield put(OutboundActions.taskDeparture(uuid, data));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchDepartureTaskFlow(state) {
    yield throttle(3000, UpdatesTypes.TASK_DEPARTURE, departureTaskFlow);
  }

  function* editTaskFlow({ uuid, task, type, meta, assigned, dueDate, is_priority }) {
    const { auth: { hotelId, token, userId, hotel }, users: { users, hotelGroups } } = yield select();

    try {
      let data = {
        user_id: userId
      }

      if (task) { data.task = task; }
      if (type) { data.type = type; }
      if (meta) { data.meta = meta; }
      if (assigned) { data.assigned = assigned; }
      if (dueDate) { data.dueDate = dueDate; }
      if (is_priority) { data.is_priority = is_priority; }

      yield put(OutboundActions.taskEdit(uuid, data));

    } catch (error) {
      console.log(error)
    }
  }

  function* watchEditTaskFlow(state) {
    yield throttle(3000, UpdatesTypes.TASK_EDIT, editTaskFlow);
  }

  function* convertTaskFlow({ task, update }) {
    const { auth: { hotelId, token, userId, hotel }, users: { users, hotelGroups } } = yield select();

    try {
      const taskAssignment = digestAssignment(update.assignments, users, hotelGroups);

      let data = {
        task: '',
        type: 'lite',
        meta: {
          ...task.meta,
          ...taskAssignment.meta
        },
        assigned: {
          ...task.assigned,
          ...taskAssignment.assigned
        },
        is_priority: update.isPriority,
        user_id: userId,
        previous_task: task.task,
        update_type: 'reassign'
      }

      if (update.asset) {
        data.type = 'quick';
        data.task = get(update, 'asset.name');
      } else {
        data.type = 'lite';
        data.task = update.task || task.task;
      }

      if (update.asset && update.action) {
        data.meta.action = update.action;
        data.task = `${data.task}: ${update.action.label}`;
        if (get(update, 'action.body.task_type')) { data.type = get(update, 'action.body.task_type') }
        if (get(update, 'action.body.estimated_time')) { data.meta.estimatedTime = get(update, 'action.body.estimated_time') }
      }

      yield put(OutboundActions.taskConvert(task.uuid, data));

    } catch (error) {
      console.log(error);
    }
  }

  function* watchConvertTaskFlow(state) {
    yield throttle(3000, UpdatesTypes.TASK_CONVERT, convertTaskFlow);
  }

  function* taskAddPhotoFlow({ uuid, photoPath }) {
    const { auth: { userId } } = yield select();

    try {
      yield put(OutboundActions.uploadTaskAddPhoto(uuid, photoPath));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchTaskAddPhotoFlow() {
    yield throttle(3000, UpdatesTypes.TASK_ADD_PHOTO, taskAddPhotoFlow);
  }

  function* generateUploadedImage(photos) {
    try {
      if (!_.isEmpty(photos)) {
        const promises = photos.map((photo) => {
          return call(uploadPhoto, photo.photoPath);
        });

        const results = yield all(promises);
        return results
      }
      else {
        return []
      }
    } catch (error) {
      return [];
    }
  }



  function* taskAdditionalPhotoFlow({ taskId, imageUrls }) {
    const { auth: { userId } } = yield select();
    const userHotelId = yield select(hotelIdSelector);

    try {
      if (imageUrls.length > 0) {
        const imagePayload = imageUrls.map(item => {
          return {
            photoPath: item.compressUrl ? item.compressUrl : item.assetsPath,
            photoId: item.assetsId,
            assetsType: item?.assetsType ? item?.assetsType : 'photo'
          }
        })

        const filterImageUpload = imagePayload.filter(image => image?.assetsType === "photo")
        const filterVideoUpload = imagePayload.filter(image => image?.assetsType === "video")

        let uploadedVideo = []
        let uploadedImage = []
        if (!_.isEmpty(filterImageUpload) || !_.isEmpty(filterVideoUpload)) {
          [uploadedImage, uploadedVideo] = yield all([
            call(generateUploadedImage, filterImageUpload),
            call(uploadVideos, filterVideoUpload)
          ]);
        }
        const additionalImagePayload = {
          hotelId: userHotelId,
          taskId: taskId,
          imageUrls: uploadedImage,
          videoUrls: uploadedVideo
        }
        yield put(OutboundActions.uploadTaskAdditionalPhoto(additionalImagePayload));
      } else {
        const additionalImagePayload = {
          hotelId: userHotelId,
          taskId: taskId,
          imageUrls: null,
          videoUrls: null
        }
        yield put(OutboundActions.uploadTaskAdditionalPhoto(additionalImagePayload));
      }

    } catch (error) {
      console.log(error);
    }
  }

  function* watchTaskAdditionalPhotoFlow() {
    yield throttle(3000, UpdatesTypes.TASK_ADDITIONAL_PHOTO, taskAdditionalPhotoFlow);
  }

  function* taskAddPhotoSubmitFlow({ meta, payload }) {
    const { uuid } = meta;

    try {
      yield put(OutboundActions.uploadTaskSubmitAddPhoto(uuid, payload));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchTaskAddPhotoSubmitFlow() {
    yield throttle(3000, UpdatesTypes.TASK_SUBMIT_PHOTO, taskAddPhotoSubmitFlow);
  }

  function* createNotificationFlow({ user, message, room, photoUrl, photoId, photoPath, tapTs }) {
    const { auth: { userId }, updates: { photos } } = yield select();
    let image = null;
    let task;

    try {
      task = {
        creator_id: userId,
        task: message,
        type: 'notification',
        meta: {
          room_id: room && room._id || null,
          location: room && room.name || null
        },
        guest_info: {
          guest_name: null,
        },
        assigned: {
          label: `${user.first_name} ${user.last_name}`,
          user_ids: [user._id],
        },
        start_date: moment().format('YYYY-MM-DD'),
        due_date: moment().format('YYYY-MM-DD'),
        is_required: 1,
        is_optional: 0,
        is_priority: false,
        is_group: 0,
      };
    } catch (error) {
      console.log(error);
    }

    try {
      if (photoPath) {
        yield put(OutboundActions.uploadNotificationPhoto(photoPath, task));
      } else {
        if (photoUrl) {
          image = photoUrl;
        } else if (photoId && get(photos, [photoId, 'url'])) {
          image = get(photos, [photoId, 'url']);
        }
        task.meta.image = image;
        yield call(submitCreateNotificationFlow, task);

      }
    } catch (error) {
      console.log(error)
    }
  }

  function* watchCreateNotificationFlow(state) {
    yield throttle(3000, UpdatesTypes.NOTIFICATION_CREATE, createNotificationFlow);
  }

  function* createNotificationApplyPhotoFlow({ meta, payload }) {
    const { task } = meta;
    task.meta.image = payload;
    yield call(submitCreateNotificationFlow, task);
  }

  function* watchNotificationTaskApplyPhotoFlow() {
    yield takeLatest(UpdatesTypes.NOTIFICATION_CREATE_APPLY_PHOTO, createNotificationApplyPhotoFlow);
  }

  function* submitCreateNotificationFlow(task) {
    yield put(OutboundActions.notificationCreate(task));
  }

  function* roomMessageAddFlow({ roomId, message }) {
    try {
      yield put(OutboundActions.messageAdd(roomId, message));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchRoomMessageAddFlow() {
    yield throttle(3000, UpdatesTypes.ROOM_MESSAGE_ADD, roomMessageAddFlow);
  }

  function* roomMessageRemoveFlow({ roomId, messageIds }) {
    try {
      yield put(OutboundActions.messageRemove(roomId, messageIds));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchRoomMessageRemoveFlow() {
    yield throttle(3000, UpdatesTypes.ROOM_MESSAGE_REMOVE, roomMessageRemoveFlow);
  }

  function* roomMessageUpdateFlow({ roomId, messageIds, message }) {
    try {
      yield put(OutboundActions.messageUpdate(roomId, messageIds, message));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchRoomMessageUpdateFlow() {
    yield throttle(3000, UpdatesTypes.ROOM_MESSAGE_UPDATE, roomMessageUpdateFlow);
  }

  function* updateExtraOptionFlow({ roomId, label, isCompleted }) {
    try {
      yield put(RoomsActions.updateExtraOptionOptimistic({ roomId, label, isCompleted }));
      yield put(OutboundActions.updateExtraOption(roomId, label, isCompleted));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchUpdateExtraOptionFlow() {
    yield throttle(3000, UpdatesTypes.EXTRA_OPTION_UPDATE, updateExtraOptionFlow);
  }

  function* tasksToSomedayFlow({ uuids }) {
    try {
      yield put(OutboundActions.tasksToSomeday(uuids));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchTasksToSomedayFlow() {
    yield throttle(3000, UpdatesTypes.TASKS_TO_SOMEDAY, tasksToSomedayFlow);
  }

  function* tasksFromSomedayFlow({ uuids }) {
    try {
      yield put(OutboundActions.tasksFromSomeday(uuids));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchTasksFromSomedayFlow() {
    yield throttle(3000, UpdatesTypes.TASKS_FROM_SOMEDAY, tasksFromSomedayFlow);
  }

  function* inspectionSubmitPhotoFlow({ payload, meta }) {
    try {
      yield put(OutboundActions.inspectionSubmitPhoto(meta.uuid, meta.field, payload));
      yield put(UpdatesActions.inspectionFinishPhotoUpload());
    } catch (error) {
      console.log(error);
    }
  }

  function* watchInspectionSubmitPhotoFlow() {
    yield takeEvery(UpdatesTypes.INSPECTION_SUBMIT_PHOTO, inspectionSubmitPhotoFlow);
  }

  function* inspectionFinishPhotoUploadFlow() {
    try {
      yield delay(5000);
      yield put(Inspections.load.tap());
      // yield put(Audits.load.tap());
    } catch (error) {
      console.log(error);
    }
  }

  function* watchInspectionFinishPhotoUploadFlow() {
    yield throttle(5000, UpdatesTypes.INSPECTION_FINISH_PHOTO_UPLOAD, inspectionFinishPhotoUploadFlow);
  }

  function* auditFinishInsertFlow({ payload, meta }) {
    try {
      const { audit, inspections } = meta;
      const auditId = payload.audit.id

      if (payload.audit.status !== 'cancelled' && inspections && inspections.length > 0) {
        yield call(Inspections.onInsertAll, { payload: inspections.map(i => ({ ...i, audit_id: auditId })) })
      }
      if (audit.tempId) {
        payload.audit.tempId = audit.tempId
      }

      return yield put(Audits.actions.insert.success(payload.audit));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchAuditFinishInsertFlow() {
    yield takeLatest(UpdatesTypes.AUDIT_FINISH_INSERT, auditFinishInsertFlow);
  }

  function* auditFinishUpdateFlow({ payload, meta }) {
    try {
      const { audit, inspections } = meta;
      const auditId = payload.audit.id

      const existingInspections = inspections.filter(i => i.isExisting)
      const newInspections = inspections.filter(i => !i.isExisting)

      if (payload.status !== 'cancelled' && newInspections && newInspections.length > 0) {
        yield call(Inspections.onInsertAll, { payload: newInspections.map(i => ({ ...i, audit_id: auditId })) })
      }
      if (payload.status !== 'cancelled' && existingInspections && existingInspections.length > 0) {
        yield call(Inspections.onUpdateAll, { payload: existingInspections })
      }

      return yield put(Audits.actions.update.success(payload.audit));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchAuditFinishUpdateFlow() {
    yield takeLatest(UpdatesTypes.AUDIT_FINISH_UPDATE, auditFinishUpdateFlow);
  }

  function* inspectionFinishInsertAllFlow({ payload: response, meta }) {
    try {
      const { inspections, photos } = meta;
      for (const photo of photos) {
        yield put(OutboundActions.inspectionUploadPhoto(photo));
      }

      yield put(Inspections.actions.insertAll.success(Inspections.normalize(response.inspections)));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchInspectionFinishInsertAllFlow() {
    yield takeLatest(UpdatesTypes.INSPECTION_FINISH_INSERT_ALL, inspectionFinishInsertAllFlow);
  }

  function* inspectionFinishUpdateAllFlow({ payload: response, meta }) {
    try {
      const { inspections, photos } = meta;
      for (const photo of photos) {
        yield put(OutboundActions.inspectionUploadPhoto(photo));
      }

      yield put(Inspections.actions.updateAll.success(Inspections.normalize(response.inspections)));
    } catch (error) {
      console.log(error);
    }
  }

  function* watchInspectionFinishUpdateAllFlow() {
    yield takeLatest(UpdatesTypes.INSPECTION_FINISH_UPDATE_ALL, inspectionFinishUpdateAllFlow);
  }

  const watchers = {
    watchUpdateRoomFinish,
    watchUpdateRoomCleaning,
    watchUpdateRoomPause,
    watchUpdateRoomUnpause,
    watchUpdateRoomDelay,
    watchUpdateRoomDND,
    watchUpdateRoomRefuse,
    watchUpdateRoomVoucher,
    watchUpdateRoomInspect,
    watchUpdateRoomNoCheck,
    watchUpdateRoomConfirmDND,
    watchUpdateRoomCancel,
    watchResetRoomFlow,
    watchRoomModelComment,
    watchRoomModelGuestLocator,
    watchRoomModelUnblock,
    watchRoomModelAddChangeSheets,
    watchRoomModelHousekeeping,
    watchMobileHousekeepingFlow,
    watchRoomModelRestock,
    watchRoomModelTurndown,
    watchCreateRoomNote,
    watchRemoveRoomNote,
    watchUploadPhoto,
    watchAddLostItem,
    watchLostItemPhotoFlow,
    watchSubmitInventoryWithdrawal,
    watchSubmitInventoryRestock,
    watchRoomScheduleAssetConsumationFlow,
    watchRoomConfirmAssetConsumationFlow,
    watchCreateTaskFlow,
    watchCreateTaskBatchFlow,
    watchUpdateTaskFlow,
    updateBatchPopUpTasksFlow,
    watchUpdateBatchTasksFlow,
    watchUpdateBatchPopUpTasksFlow,
    watchUpdateCreateTaskMessageFlow,
    watchReassignTaskFlow,
    watchDepartureTaskFlow,
    watchEditTaskFlow,
    watchConvertTaskFlow,
    watchRoomPlanningFlow,
    watchRoomPriorityFlow,
    watchRoomPlanningBulkFlow,
    watchRoomNightPlanningFlow,
    watchRoomNightPlanningUpdateFlow,
    watchCreateNotificationFlow,
    watchNotificationTaskApplyPhotoFlow,
    watchCreateTaskApplyPhotoFlow,
    watchRoomMessageAddFlow,
    watchRoomMessageRemoveFlow,
    watchRoomMessageUpdateFlow,
    watchUpdateFoundItemFlow,
    watchUpdateExtraOptionFlow,
    watchPhotoFoundItemFlow,
    watchLostItemExtraPhotoFlow,
    watchTaskAddPhotoFlow,
    watchTaskAdditionalPhotoFlow,
    watchTaskAddPhotoSubmitFlow,
    watchTasksToSomedayFlow,
    watchTasksFromSomedayFlow,
    watchInspectionSubmitPhotoFlow,
    watchInspectionFinishPhotoUploadFlow,
    watchAuditFinishInsertFlow,
    watchAuditFinishUpdateFlow,
    watchInspectionFinishInsertAllFlow,
    watchInspectionFinishUpdateAllFlow,
    watchRoomModelUpdateNightyInspection,
    watchAssignPlanningFlow,
    watchReAssignPlanningFlow
  };

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas: {
      createRoomNoteFlow,
      createRoomNote,
      updateRoomFlow,
      updateTurnDownRoomFlow,
      mobileHousekeepingFlow,
      resetRoomFlow,
      updateRoomModelFlow,
      sendRoomMessageModelFlow,
      removeRoomNote,
      removeRoomNoteFlow,
      uploadPhoto,
      uploadPhotoFlow,
      addLostItemFlow,
      addLostItemPhotoFlow,
      submitLostItemFlow,
      submitInventoryWithdrawl,
      submitInventoryWithdrawlFlow,
      submitInventoryRestock,
      submitInventoryRestockFlow,
      roomScheduleAssetConsumationFlow,
      roomConfirmAssetConsumationFlow,
      createTaskFlow,
      createTaskBatchFlow,
      updateTaskFlow,
      updateBatchTasksFlow,
      createTaskMessage,
      reassignTaskFlow,
      departureTaskFlow,
      editTaskFlow,
      convertTaskFlow,
      roomPlanning,
      roomPlanningFlow,
      roomPriorityUpdateFlow,
      roomPlanningBulkFlow,
      roomNightPlanningFlow,
      roomNightPlanningUpdateFlow,
      createNotificationFlow,
      createTaskSubmitFlow,
      createTaskApplyPhotoFlow,
      submitCreateNotificationFlow,
      roomMessageAddFlow,
      roomMessageRemoveFlow,
      roomMessageUpdateFlow,
      updateFoundItemFlow,
      updateExtraOptionFlow,
      photoFoundItemFlow,
      addLostItemPhotoExtraFlow,
      taskAddPhotoFlow,
      taskAdditionalPhotoFlow,
      taskAddPhotoSubmitFlow,
      tasksToSomedayFlow,
      tasksFromSomedayFlow,
      inspectionSubmitPhotoFlow,
      inspectionFinishPhotoUploadFlow,
      auditFinishInsertFlow,
      auditFinishUpdateFlow,
      inspectionFinishInsertAllFlow,
      inspectionFinishUpdateAllFlow,
      updateNightyInspectionStatus,
      assignCleaningToUserFlow,
      reAssignCleaningToUserFlow
    }
  }
}
