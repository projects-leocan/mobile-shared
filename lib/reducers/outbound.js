import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import moment from 'moment';
import { find, findIndex } from 'lodash/collection';
import { get, omit } from 'lodash/object';
import { isArray, isObject, isEqual } from 'lodash/lang';

import OutboundTypes from '../constants/outbound';

const getInitialState = () => ({
  failedRequests: [],
  successfulRequests: []
})

const ACTION_HANDLERS = {
  [OutboundTypes.OUTBOUND_RESET]: (state) => {
    return getInitialState();
  },
  [OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_ROOM_CLEAN_FAILURE ------');
    console.log(type)
    console.log(meta)
    console.log(payload)

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]      
    }
  },
  [OutboundTypes.OUTBOUND_ROOM_RESET_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_ROOM_RESET_FAILURE ------');
    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_LOG_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_LOG_FAILURE ------');

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_ROOM_UPDATE_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_ROOM_UPDATE_FAILURE ------');

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_TASK_CREATE_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_TASK_CREATE_FAILURE ------');

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_TASK_UPDATE_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_TASK_UPDATE_FAILURE ------');

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_TASK_UPDATE_BATCH_FAILURE ------');

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_TASK_REASSIGN_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_TASK_REASSIGN_FAILURE ------');

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_TASK_CONVERT_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_TASK_CONVERT_FAILURE ------');

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_NOTIFICATION_CREATE_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_NOTIFICATION_CREATE_FAILURE ------');

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_GLITCH_UPDATE_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_GLITCH_UPDATE_FAILURE ------');

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_TASK_PHOTO_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_TASK_PHOTO_FAILURE ------');

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_NOTIFICATION_PHOTO_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_NOTIFICATION_PHOTO_FAILURE ------');
    
    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_LF_PHOTO_FAILURE]: (state, { type, meta, payload }) => {
    console.log('----- OutboundTypes.OUTBOUND_LF_PHOTO_FAILURE ------');

    const { message } = payload;
    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_LF_SUBMIT_FAILURE]: (state, { type, meta, payload }) => {
    const { message } = payload;
    console.log('----- OutboundTypes.OUTBOUND_LF_SUBMIT_FAILURE ------');

    return {
      ...state,
      failedRequests: [
        ...state.failedRequests,
        { type, meta, errorMessage: message || "" }
      ]
    }
  },
  [OutboundTypes.OUTBOUND_RETRY_FAILED]: (state, { data }) => {
    console.log('----- OutboundTypes.OUTBOUND_RETRY_FAILED ------');

    return {
      ...state,
      failedRequests: state.failedRequests
        .filter(req => !(isEqual(req.meta, data.meta) && isEqual(req.type, data.type)))
    }
  },
  [OutboundTypes.OUTBOUND_REMOVE_FAILED]: (state, { data }) => {
    console.log('----- OutboundTypes.OUTBOUND_REMOVE_FAILED ------');

    return {
      ...state,
      failedRequests: state.failedRequests
        .filter(req => !(isEqual(req.meta, data.meta) && isEqual(req.type, data.type)))
    }
  },
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
