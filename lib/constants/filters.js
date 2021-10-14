import { createTypes } from 'reduxsauce';

export default createTypes(`
  UPDATE_SEARCH_ROOMS
  UPDATE_ACTIVE_FLOOR
  UPDATE_ACTIVE_SECTION
  SET_ACTIVE_ROOMS

  TOGGLE_NON_GUEST_ROOMS

  RESET_ROOM_FILTERS
`);
