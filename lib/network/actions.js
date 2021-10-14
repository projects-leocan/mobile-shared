import Types from './constants';

const status = (isOnline) => () => ({
  type: Types.NETWORK_STATUS,
  isOnline
})

const socketStatus = (isConnected) => () => ({
  type: Types.SOCKET_STATUS,
  isConnected
})

export const statusOnline = status(true)
export const statusOffline = status(false)

export const socketStatusOnline = socketStatus(true)
export const socketStatusOffline = socketStatus(false)

export default {
  statusOnline,
  statusOffline,
  socketStatusOnline,
  socketStatusOffline
}
