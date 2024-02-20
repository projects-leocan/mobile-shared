import { createReducer } from 'reduxsauce';
import AuthTypes from '../constants/authLoader';

const getInitialState = () => ({
    isHotelLoading: false
})

const ACTION_HANDLERS = {
    [AuthTypes.LOADER_HOTEL_REQUEST]: (state) => {
        return {
            ...state,
            isHotelLoading: true
        }
    },
    [AuthTypes.LOADER_HOTEL_SUCCESS]: (state) => {
        return {
            ...state,
            isHotelLoading: false
        }
    },
    [AuthTypes.LOADER_HOTEL_FAILURE]: (state) => {
        return { ...state,isHotelLoading: false }
    },
};

export default createReducer(getInitialState(), ACTION_HANDLERS);
