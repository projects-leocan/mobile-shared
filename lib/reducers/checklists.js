import { createReducer } from 'reduxsauce';

import ChecklistsTypes from '../constants/checklists';

const getInitialState = () => ({
  checklists: [],
  checklistLogs: []
})

const ACTION_HANDLERS = {
  [ChecklistsTypes.CHECKLISTS_FETCH_SUCCESS]: (state, { checklists }) => {
    return {
      ...state,
      checklists
    }
  },
  [ChecklistsTypes.ACTIVE_CHECKLISTS_FETCH_SUCCESS]: (state, { checklistLogs }) => {
    console.log('here', checklistLogs);
    return {
      ...state,
      checklistLogs
    }
  }
};

export default createReducer(getInitialState(), ACTION_HANDLERS);
