import AvailHotelTaskTypes from '../constants/hotelsTask';

export function resetAvailHotel() {
    return {
        type: AvailHotelTaskTypes.AVAILABLE_HOTEL_TASK_RESET,
    }
}

export function activeAvailHotel(hotelId) {
    return {
        type: AvailHotelTaskTypes.ACTIVE_AVAIL_HOTEL,
        hotelId
    }
}

export function availHotelsTaskFetch() {
    return {
        type: AvailHotelTaskTypes.AVAILABLE_HOTEL_TASK_FETCH,
        meta: {
            debounce: {
                time: 1000
            }
        }
    }
}

export function availHotelTaskSuccess(tasks) {
    return {
        type: AvailHotelTaskTypes.AVAILABLE_HOTEL_TASK_SUCCESS,
        tasks
    }
}

export function availHotelTaskFailure(error) {
    return {
        type: AvailHotelTaskTypes.AVAILABLE_HOTEL_FAILURE,
        error
    }
}

export function availHotelsRoomFetch() {
    return {
        type: AvailHotelTaskTypes.AVAILABLE_HOTEL_ROOM_FETCH,
        meta: {
            debounce: {
                time: 1000
            }
        }
    }
}

export function availHotelRoomSuccess(rooms) {
    return {
        type: AvailHotelTaskTypes.AVAILABLE_HOTEL_ROOM_SUCCESS,
        rooms
    }
}

export function availHotelRoomFailure(error) {
    return {
        type: AvailHotelTaskTypes.AVAILABLE_HOTEL_ROOM_FAILURE,
        error
    }
}

export default {
    resetAvailHotel,
    activeAvailHotel,
    availHotelsTaskFetch,
    availHotelTaskSuccess,
    availHotelTaskFailure,

    availHotelsRoomFetch,
    availHotelRoomSuccess,
    availHotelRoomFailure
}
