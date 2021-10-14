import ModalTypes from './constants';

export const open = (modalContent, params = {}) => ({
  type: ModalTypes.OPEN_MODAL,
  modalContent,
  params 
});

export const close = () => ({
  type: ModalTypes.CLOSE_MODAL
})

export const toggle = (modalContent, params = {}) => ({
  type: ModalTypes.TOGGLE_MODAL,
  modalContent,
  params
})

export default {
  open,
  close,
  toggle
}
