export const COMPLETED = 'completed';
export const CANCELLED = 'canceled';
export const PAUSED = 'paused';
export const STARTED = 'started';
export const WAITING = 'waiting';
export const PENDING = 'pending';
export const REJECTED = 'rejected';

export const getTaskStatus = (task) => {
    if (task.is_completed) {
        return COMPLETED;
    }
    if (task.is_cancelled) {
        return CANCELLED;
    }
    if (task.is_paused) {
        return PAUSED;
    }
    if (task.is_started) {
        return STARTED;
    }
    if (task.is_claimed) {
        return WAITING;
    }
    if (task.is_rejected) {
        return REJECTED;
    }
    return PENDING;
}

export const options = [
    COMPLETED,
    CANCELLED,
    PAUSED,
    STARTED,
    WAITING,
    PENDING,
    REJECTED
]

export default {
  get: getTaskStatus,
  options
}
