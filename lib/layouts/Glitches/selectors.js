import { createSelector } from 'reselect';
import { sortBy, get, groupBy, keys } from 'lodash';

const customSort = (entry) => {
  let v = 4;
  switch (entry.key || '') {
    case "you":
      v = 1; break;
    case "other":
      v = 2; break;
    case "completed":
      v = 3; break;
    default:
      v = 4;
  }
  return v;
}

export const hotelExperiencesSelector = state => state.glitches.hotelGlitches;
export const userIdSelector = state => state.auth.userId;

export const cleanExperiencesSelector = createSelector(
  [hotelExperiencesSelector, userIdSelector],
  (experiences, userId) => experiences.map(experience => ({
    ...experience,
    group: experience.assignment,
    assignment: experience.is_completed ? 'completed' : get(experience, 'assignment.user_ids', []).includes(userId) ? 'you' : 'other',
    status: !experience.is_started && !experience.is_completed ?
      'pending' : experience.is_completed ?
      'completed' :
      'started'
  }))
)

export const groupedHotelExperiencesSelector = createSelector(
  [cleanExperiencesSelector],
  (experiences) => {
    const sorted = sortBy(experiences, 'last_ts').reverse();
    const grouped = groupBy(sorted, 'assignment');
    
    const items = keys(grouped)
      .map(assignment => ({ title: assignment, data: grouped[assignment], key: assignment }));

    return sortBy(items, customSort);
  }
)