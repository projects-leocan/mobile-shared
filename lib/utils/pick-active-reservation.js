import get from 'lodash/get';
import find from 'lodash/find';

const ALL_RESERVATIONS = ['arrived', 'departure', 'arrival', 'stay', 'departed'];
const UPCOMING_RESERVATIONS = ['arrival', 'arrived', 'stay', 'departure', 'departed'];

const pickActiveReservation = (guests, isUpcoming = false, isReturnGuest = false) => {
  if (!guests || !guests.length) {
    return null;
  }

  let activeId = null;
  const statuses = isUpcoming
    ? ALL_RESERVATIONS
    : UPCOMING_RESERVATIONS;
  
  for (let status of statuses) {
    const found = find(guests, { status });
    if (found) {
      activeId = isReturnGuest ? found : get(found, 'pmsId');
      break;
    }
  }
  
  return activeId;
}

export default pickActiveReservation;