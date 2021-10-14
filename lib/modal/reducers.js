import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import ModalTypes from './constants';

export const getInitialState = () => ({
  modalContent: null,
  params: {}
});

const ACTION_HANDLERS = {
  [ModalTypes.OPEN_MODAL]: (state, { modalContent, params }) => {
    return {
      ...state,
      modalContent,
      params
    }
  },
  [ModalTypes.CLOSE_MODAL]: (state) => {
    return getInitialState();
  },
  [ModalTypes.TOGGLE_MODAL]: (state, props) => {
    if (state.modalContent) {
      return getInitialState();
    }

    return {
      modalContent: props.modalContent,
      params: props.params
    }
  },
}

export const modalReducer = createReducer(getInitialState(), ACTION_HANDLERS);

export default modalReducer
