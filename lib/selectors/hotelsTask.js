import { createSelector } from 'reselect';
import createDeepEqualSelector from '../utils/create-deep-equal-selector';

import { groupBy, isEmpty, each, get, filter, first } from 'lodash';
import { availableHotelsSelector } from 'rc-mobile-base/lib/selectors/auth';

export const availHotelsTaskSelector = state => get(state, 'hotelsTask.availHotelTasks', []);
// export const selectedHotel = state => state.hotelsTask.activeAvailHotel;
export const selectedHotel = state => get(state, 'hotelsTask.activeAvailHotel', null);

export const getTaskByHotelId = (hotelsTask) => groupBy(hotelsTask || [], 'hotel_id');

export const hotelsTaskSelector = createDeepEqualSelector([availHotelsTaskSelector], getTaskByHotelId);

export const getComputedHotelsTask = (availableHotels, hotelsTask) => {
  if (isEmpty(availableHotels)) {
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

export const selectedHotelName = (availableHotels, activeHotelId) => {
  return get(first(filter(availableHotels, function (o) { return o.hotelId === activeHotelId })), 'hotelName');
}


export const computedHotelsTask = createSelector(
  [availableHotelsSelector, hotelsTaskSelector],
  getComputedHotelsTask
);

export const computedHotelName = createSelector(
  [availableHotelsSelector, selectedHotel],
  selectedHotelName
);
