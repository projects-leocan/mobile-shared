import { createReducer } from 'reduxsauce';

import SocketRoomsTypes from '../constants/socketRooms';

const getInitialState = () => ({
    socketHotelMessages: [],
});

const ACTION_HANDLERS = {
    [SocketRoomsTypes.RESET_SOCKET_ROOMS]: (state) => {
        return getInitialState();
    },
    [SocketRoomsTypes.SOCKET_ROOM_MESSAGES_SUCCESS]: (state, { messages }) => {

        return {
            ...state,
            socketHotelMessages: messages
        }
    },
    [SocketRoomsTypes.SOCKET_ROOM_MESSAGES_UPDATE]: (state, { messageId }) => {
        const filterMessages = state.socketHotelMessages.filter(item => item.id !== messageId);
        return {
            ...state,
            socketHotelMessages: filterMessages
        }
    },
}

export default createReducer(getInitialState(), ACTION_HANDLERS);
