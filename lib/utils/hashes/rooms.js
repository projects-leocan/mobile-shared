export const roomUpdate = (roomId, field, value) => {
    return `${roomId}:${field}:${value || "noValue"}`
}

export const roomCleanLog = (roomId, startTs) => {
    return `${roomId}:${startTs}`
}

export const roomOtherLog = (roomId, status) => {
    return `${roomId}:${status}`
}