import { filter, get, sortBy, take } from 'lodash';
import moment from 'moment';

const classifyReservation = (date, reservation) => { 
  if (date === reservation.mCheckOut.format('YYYY-MM-DD')) {
    return 'dep'
  } else if (date === reservation.mCheckIn.format('YYYY-MM-DD')) {
    return 'arr'
  } else {
    return 'stay'
  }
}

export default guestStatusByDate = (name, date, reservations) => {
  const mDate = moment(date);
  
  const roomReservations = reservations
    .filter(res => (res.room_name || res.RcRoomName) === name)
    .map(res => {
      const mCheckIn = moment(res.check_in_date || res.CheckIn).isValid()
        && moment(moment(res.check_in_date || res.CheckIn).format('YYYY-MM-DD'));
      const mCheckOut = moment(res.check_out_date || res.CheckOut).isValid()
        && moment(moment(res.check_out_date || res.CheckOut).format('YYYY-MM-DD'));
      
      if (mCheckIn.isSameOrBefore(mDate) && mCheckOut.isSameOrAfter(mDate)) {
        return {
          ...res,
          mCheckIn,
          mCheckOut
        }
      }
      
      return null;
    })
    .filter(Boolean);

  if (!roomReservations.length) {
    return {
      status: 'vac',
      reservations: []
    }
  }

  const guestStatuses = roomReservations
    .map(res => classifyReservation(date, res));

  return {
    status: guestStatuses.includes('stay') ? 'stay' :
            guestStatuses.includes('arr') && guestStatuses.includes('dep') ? 'da' :
            guestStatuses.includes('dep') ? 'dep' : 'arr',
    reservations: sortBy(roomReservations, res => res.mCheckIn.unix())
  }
}

function momentizeDate(date) {
	if (!date) {
		return moment();
	}
	return moment(take(date, 10).join(''));
}

export const excludeFutureArrivals = (roomCalendar) => {
  const validateReservationLength = get(roomCalendar, 'length');

  if(validateReservationLength > 1) {
    const today = moment(moment().format('YYYY-MM-DD'));

    return filter(roomCalendar, function(entry) {
      const checkInDate = momentizeDate(get(entry, 'check_in_date'));
      const isArrFuture = checkInDate.format('YYYY-MM-DD') > today.format('YYYY-MM-DD');
      
      return !isArrFuture
    })
  } else {
    return roomCalendar
  }
}