import { createSelector } from 'reselect';
import { concat, get, sortBy, groupBy, keys } from 'lodash';
import moment from 'moment';

export const hotelLostItemsSelector = state => state.rooms.hotelLostItems;
export const hotelFoundItemsSelector = state => state.rooms.hotelFoundItems;

export const hotelLFSelector = createSelector(
  [hotelLostItemsSelector, hotelFoundItemsSelector],
  (lostItems, foundItems) => sortBy(concat(lostItems, foundItems), 'date_ts')
    .reverse()
    .map(entry => ({ ...entry, date: moment.unix(entry.date_ts).format('YYYY-MM-DD') }))
)

export const groupedHotelLFSelector = createSelector(
  [hotelLFSelector],
  (hotelLostFoundItems) => {
    const grouped = groupBy(hotelLostFoundItems, 'date');

    return keys(grouped)
      .map(date => ({ title: date, data: grouped[date], key: date }));
  }
)

export const gropuedFilteredLFSelector = (searchQuery = '', isShowAll = true) => createSelector(
  [hotelLFSelector],
  (lfItems) => {
    const filtered = lfItems.filter(item => {
      if (!isShowAll && ['mailed', 'hand-delivered', 'expired', 'refused', 'delete', 'closed'].includes(item.status)) {
        return false;
      }

      if (searchQuery) {
        const cleanQuery = searchQuery.toLowerCase();
        if (
          !(item.name_or_description || '').toLowerCase().startsWith(cleanQuery) &&
          !(item.location || '').toLowerCase().startsWith(cleanQuery) &&
          !(item.room_name || '').toLowerCase().startsWith(cleanQuery) &&
          !(item.guest_name || '').toLowerCase().includes(cleanQuery)
        ) {
          return false;
        }
      }
      
      return true;
    });
    
    const grouped = groupBy(filtered, 'date');

    return keys(grouped)
      .map(date => ({ title: date, data: grouped[date], key: date }));
  }
)