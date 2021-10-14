import { createSelector } from 'reselect';
import { flatten, sortBy } from 'lodash';
import uuid from 'uuid';

export const checklistsSelector = state => state.checklists.checklists;

export const cheklistsExpanded = createSelector(
  [checklistsSelector],
  (checklists) => {
    return checklists.map(checklist => {
      const occurances = checklist.items.map(item => {
        return item.occurances.map(minHour => ({
          minHour,
          label: item.label,
          uuid: item.uuid,
          finishTs: null
        }))
      })
      
      return {
        uuid: uuid.v4(),
        checklist_id: checklist._id,
        name: checklist.name,
        items: sortBy(flatten(occurances), 'minHour'),
        is_completed: false
      }
    })
  }
) 