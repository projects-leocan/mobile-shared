import OverlayTypes from '../constants/overlay';

export function overlayShow({ icon, message, color }) {
  return {
    type: OverlayTypes.SHOW_OVERLAY,
    icon,
    message,
    color
  }
}

export function overlayHide() {
  return {
    type: OverlayTypes.HIDE_OVERLAY
  }
}

export default {
  overlayShow,
  overlayHide
}
