import AvailHotelTaskTypes from '../constants/hotelsTask';

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

export default {
    activeAvailHotel,
    availHotelsTaskFetch,
    availHotelTaskSuccess,
    availHotelTaskFailure
}
