import { get, sortBy } from 'lodash';
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