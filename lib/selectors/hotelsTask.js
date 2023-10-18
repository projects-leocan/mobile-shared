import { createSelector } from 'reselect';
import createDeepEqualSelector from '../utils/create-deep-equal-selector';

import { groupBy, isEmpty, each, get, filter, first } from 'lodash';
import { availableHotelsSelector } from 'rc-mobile-base/lib/selectors/auth';

export const availHotelsRoomSelector = state => state.hotelsTask.availableHotelsRoom;

export const availHotelsTaskSelector = state => get(state, 'hotelsTask.availHotelTasks', []);
// export const selectedHotel = state => state.hotelsTask.activeAvailHotel;
export const selectedHotel = state => get(state, 'hotelsTask.activeAvailHotel', null);
export const SocketHotelTaskPopup = state => get(state, 'rooms.taskSocket', [])
export const getTaskByHotelId = (hotelsTask) => groupBy(hotelsTask || [], 'hotel_id');

export const hotelsTaskSelector = createDeepEqualSelector([availHotelsTaskSelector], getTaskByHotelId);

export const getComputedHotelsTask = (availableHotels, hotelsTask, hotelsPlanning) => {
  if (isEmpty(availableHotels)) {
    return []
  }
  let mappedhotelsTask = []

  each(availableHotels, hotel => {
    const hotelsPlanningList = hotelsPlanning[get(hotel, 'hotelId', null)] || [];
    const hotelsTaskList = hotelsTask[get(hotel, 'hotelId', null)] || [];

    const filteredTask = hotelsTaskList.filter(task => {
      if (get(task, 'is_completed') || get(task, 'is_cancelled') || get(task, 'is_rejected')) {
        return false;
      }

      return true;
    })

    mappedhotelsTask.push({
      ...hotel,
      hotelsTask: filteredTask,
      hotelsPlanning: hotelsPlanningList
    });
  });

  return mappedhotelsTask;
}

export const selectedHotelName = (availableHotels, activeHotelId) => {
  return get(first(filter(availableHotels, function (o) { return o.hotelId === activeHotelId })), 'hotelName');
}


export const availHotelsPlanningSelector = state => get(state, 'rooms.allHotelPlannings', []);

export const getPlanningByHotelId = (hotelsPlanning) => groupBy(hotelsPlanning || [], 'hotel_id');

export const hotelsPlanningSelector = createDeepEqualSelector([availHotelsPlanningSelector], getPlanningByHotelId);

export const computedHotelsTask = createSelector(
  [availableHotelsSelector, hotelsTaskSelector, hotelsPlanningSelector],
  getComputedHotelsTask
);

export const computedHotelName = createSelector(
  [availableHotelsSelector, selectedHotel],
  selectedHotelName
);
