import { createSelector } from 'reselect';

const modalSelector = state => state.modal;

const getContent = (modal) => modal.modalContent
const getParams = (modal) => modal.params

export const modalContentSelector = createSelector(
  [modalSelector],
  getContent
);

export const modalParamsSelector = createSelector(
  [modalSelector],
  getParams
);
