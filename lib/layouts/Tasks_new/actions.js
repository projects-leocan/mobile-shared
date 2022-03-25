import Types from './constants';

export function setActiveTab(tab) {
  return {
    type: Types.SET_ACTIVE_TAB,
    tab
  }
}

export default {
  setActiveTab,
}
