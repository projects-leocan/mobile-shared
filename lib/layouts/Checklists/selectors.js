import { createSelector } from 'reselect';

export const activeChecklistsSelector = state => state.checklists.checklistLogs
export const userIdSelector = state => state.auth.userId;

export const userActiveChecklistsSelector = createSelector(
  [activeChecklistsSelector, userIdSelector],
  (checklistLogs, userId) => {
    return (checklistLogs || [])
      .filter(c => c.responsible_id === userId);
  }
)

export const sectionedUserChecklistsSelector = createSelector(
  [userActiveChecklistsSelector],
  (checklistLogs) => {
    const splitLogs = checklistLogs.reduce((pv, i) => {
      if (i.is_completed) {
        pv[1].push(i);
      } else {
        pv[0].push(i);
      }
      
      return pv;
    }, [[], []]);

    return [
      { title: 'Open checklists', data: splitLogs[0] },
      { title: 'Recently closed checklists', data: splitLogs[1] },
    ]
  }
)
