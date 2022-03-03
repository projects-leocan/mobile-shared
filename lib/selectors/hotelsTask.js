import { createSelector } from 'reselect';
import createDeepEqualSelector from '../utils/create-deep-equal-selector';

import { groupBy, isEmpty, each, get } from 'lodash';
import { availableHotelsSelector } from 'rc-mobile-base/lib/selectors/auth';

export const availHotelsTaskSelector = state => state.hotelsTask.availHotelTasks;

export const getTaskByHotelId = (hotelsTask) => groupBy(hotelsTask || [], 'hotel_id');

export const hotelsTaskSelector = createDeepEqualSelector([availHotelsTaskSelector], getTaskByHotelId);

export const getComputedHotelsTask = (availableHotels, hotelsTask) => {
  if(isEmpty(availableHotels)) {
    return []
  } 

  let mappedhotelsTask = []

  each(availableHotels, hotel => {
    mappedhotelsTask.push({
      ...hotel,
      hotelsTask: hotelsTask[get(hotel, 'hotelId', null)]
    });
  });

  return mappedhotelsTask;
}


export const computedHotelsTask = createSelector(
  [availableHotelsSelector, hotelsTaskSelector],
  getComputedHotelsTask
);

