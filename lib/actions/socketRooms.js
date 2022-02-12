import SocketRoomsTypes from '../constants/socketRooms';

export function socketRoomMessagesFetch() {
    return {
        type: SocketRoomsTypes.SOCKET_ROOM_MESSAGES_FETCH
    }
}

export function socketMessageSuccess(results) {
    return {
        type: SocketRoomsTypes.SOCKET_ROOM_MESSAGES_SUCCESS,
        messages: results
    }
}

export function updatesocketMessage(messageId) {
    return {
        type: SocketRoomsTypes.SOCKET_ROOM_MESSAGES_UPDATE,
        messageId: messageId
    }
}

export default {
    socketRoomMessagesFetch,
    socketMessageSuccess,
    updatesocketMessage
}
