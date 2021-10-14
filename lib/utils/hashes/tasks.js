export const hashTaskCreate = (task, location="NL", assignedLabel="", photoId='') => {
    return `${task}:${location}:${assignLabel}:${photoId}`
}

export const hashTasksCreate = (task, firstRoomId="NL", assignedLabel="", photoId='') => {
    return `${task}:${firstRoomId}:${assignLabel}:${photoId}`
}

export const hashTaskUpdate = (taskId, updateType, updateValue) => {
    return `${taskId}:${updateType}:${updateValue}`
}

export const hashTaskConvert = (taskId) => {
    return taskId
}