import { createReducer } from 'reduxsauce';

import AvailHotelTaskTypes from '../constants/hotelsTask';
import { availableHotelsSelector } from 'rc-mobile-base/lib/selectors/auth';

const getInitialState = () => ({
    activeAvailHotel: null,
    availHotelTasks: [],
    availableHotels: [],
    availableHotelsRoom: [],
    availHotelTasksError: null,
    availHotelRoomError: null
});

const ACTION_HANDLERS = {
    [AvailHotelTaskTypes.AVAILABLE_HOTEL_TASK_RESET]: (state) => {
        return getInitialState();
    },
    [AvailHotelTaskTypes.ACTIVE_AVAIL_HOTEL]: (state, { hotelId }) => {
        return {
            ...state,
            activeAvailHotel: hotelId
        }
    },
    [AvailHotelTaskTypes.AVAILABLE_HOTEL_TASK_FETCH]: (state, { availableHotels }) => {
        return {
            ...state
        }
    },
    [AvailHotelTaskTypes.AVAILABLE_HOTEL_TASK_SUCCESS]: (state, { tasks }) => {
        return {
            ...state,
            availHotelTasks: tasks,
        }
    },
    [AvailHotelTaskTypes.AVAILABLE_HOTEL_FAILURE]: (state, { error }) => {
        return {
            ...state,
            availHotelTasksError: error
        }
    },

    [AvailHotelTaskTypes.AVAILABLE_HOTEL_ROOM_FETCH]: (state, { availableHotels }) => {
        return {
            ...state
        }
    },
    [AvailHotelTaskTypes.AVAILABLE_HOTEL_ROOM_SUCCESS]: (state, { rooms }) => {
        return {
            ...state,
            availableHotelsRoom: rooms,
        }
    },
    [AvailHotelTaskTypes.AVAILABLE_HOTEL_ROOM_FAILURE]: (state, { error }) => {
        return {
            ...state,
            availHotelRoomError: error
        }
    },
    
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
