import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import UpdatesTypes from '../constants/updates';
import LostFoundTypes from '../constants/lost-found';
import { get, omit } from 'lodash/object';

// export const INITIAL_STATE = Immutable({
//   photoId: null,
//   photoPath: null,
//   description: '',
//   submitting: false,
//   submissionError: null,
// });

const getInitialState = () => ({
  photoId: null,
  photoPath: null,
  photos: [],
  description: '',
  submitting: false,
  submissionError: null,
});

const ACTION_HANDLERS = {
  [LostFoundTypes.LOST_FOUND_RESET]: (state) => {
    return getInitialState();
  },
  [LostFoundTypes.LOST_FOUND_SET_PHOTO]: (state, { path, id }) => {
    // return state.merge({ photoId: id, photoPath: path });
    return {
      ...state,
      photoId: id,
      photoPath: path,
    }
  },
  [LostFoundTypes.LOST_FOUND_CLEAR_PHOTO]: (state, { id }) => {
    // return state.merge({ photoId: null, photoPath: null });
    return {
      ...state,
      photoId: null,
      photoPath: null,
    }
  },
  [LostFoundTypes.LOST_FOUND_SET_PHOTOS]: (state, { path, id }) => {
    // return state.merge({ photoId: id, photoPath: path });
    return {
      ...state,
      photos: [{ photoId: id, photoPath: path }, ...state.photos]
    }
  },
  [LostFoundTypes.LOST_FOUND_CANCEL_PHOTOS]: (state, { id }) => {
    // return state.merge({ photoId: null, photoPath: null });
    const filterArray = (state.photos).filter((item) => item.photoId !== id);

    return {
      ...state,
      photos: filterArray
    }
  },
  [LostFoundTypes.LOST_FOUND_SET_DESCRIPTION]: (state, { text }) => {
    // return state.set('description', text);
    return {
      ...state,
      description: text
    }
  },
  [UpdatesTypes.PHOTO_UPLOAD_FAILURE]: (state, { id }) => {
    if (id !== state.photoId) {
      // return state;
      return { ...state }
    }

    // return state.merge({ photoId: null, photoPath: null });
    return {
      ...state,
      photoId: null,
      photoPath: null
    }
  },
  [UpdatesTypes.LOST_ITEM_ADD]: (state) => {
    // return state.set('submitting', true);
    return {
      ...state,
      submitting: true
    }
  },
  [UpdatesTypes.LOST_ITEM_ADD_SUCCESS]: (state, { foundItem }) => {
    // return INITIAL_STATE
    return getInitialState()
  },
  [UpdatesTypes.LOST_ITEM_ADD_FAILURE]: (state, { error }) => {
    // return state.merge({
    //   submitting: false,
    //   submissionError: error,
    // });
    return {
      ...state,
      submitting: false,
      submissionError: error
    }
  }
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
