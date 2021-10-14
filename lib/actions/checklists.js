import ChecklistsTypes from '../constants/checklists';

export function checklistsFetch() {
  return {
    type: ChecklistsTypes.CHECKLISTS_FETCH
  }
}

export function checklistsFetchSuccess({ checklists }) {
  return {
    type: ChecklistsTypes.CHECKLISTS_FETCH_SUCCESS,
    checklists
  }
}

export function checklistsFetchFailure(error) {
  return {
    type: ChecklistsTypes.CHECKLISTS_FETCH_FAILURE,
    error
  }
}

export function checklistUpdate(checklist) {
  return {
    type: ChecklistsTypes.CHECKLIST_UPDATE,
    checklist
  }
}

export function activeChecklistsFetch() {
  return {
    type: ChecklistsTypes.ACTIVE_CHECKLISTS_FETCH
  }
}

export function activeChecklistsFetchSuccess({ checklistLogs }) {
  return {
    type: ChecklistsTypes.ACTIVE_CHECKLISTS_FETCH_SUCCESS,
    checklistLogs
  }
}

export function activeChecklistsFetchFailure(error) {
  return {
    type: ChecklistsTypes.ACTIVE_CHECKLISTS_FETCH_FAILURE,
    error
  }
}

export default {
  checklistsFetch,
  checklistsFetchSuccess,
  checklistsFetchFailure,
  checklistUpdate,
  activeChecklistsFetch,
  activeChecklistsFetchSuccess,
  activeChecklistsFetchFailure,
}