import LostFoundTypes from '../constants/lost-found';

export function reset() {
  return {
    type: LostFoundTypes.LOST_FOUND_RESET
  }
}

export function setPhoto(path, id) {
  // console.log("SET PHOTO id: ", id);
  return {
    type: LostFoundTypes.LOST_FOUND_SET_PHOTO,
    path,
    id,
  };
}

export function clearPhoto(id) {
  return {
    type: LostFoundTypes.LOST_FOUND_CLEAR_PHOTO,
    id
  };
}

export function setPhotos(path, id) {
  // console.log("SET PHOTO id: ", id);
  return {
    type: LostFoundTypes.LOST_FOUND_SET_PHOTOS,
    path,
    id,
  };
}

export function clearFromPhotos(id) {
  return {
    type: LostFoundTypes.LOST_FOUND_CANCEL_PHOTOS,
    id
  };
}

export function setDescription(text) {
  return {
    type: LostFoundTypes.LOST_FOUND_SET_DESCRIPTION,
    text,
  };
}

export function showNotificationWithTimeout(text, timeout = 5000) {
  return {
    type: LostFoundTypes.LOST_FOUND_SHOW_NOTIFICATION_WITH_TIMEOUT,
    text,
    timeout,
  };
}

export default {
  reset,
  setPhoto,
  clearPhoto,
  setPhotos,
  clearFromPhotos,
  setDescription,
  showNotificationWithTimeout
};
