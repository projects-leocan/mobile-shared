import { isEmpty } from 'lodash/lang';
import get from 'lodash/get';

export const findUpdates = (prev, next) => {
  const updates = next.filter(room => {
    const previous = prev.find(p => p._id === room._id)
    if (!previous) {
      return false
    }
    if (previous.comment !== room.comment && !isEmpty(room.comment)) {
      return true
    }
    if (get(previous, 'messages.length', 0) < get(room, 'messages.length', 0)) {
      return true;
    }
    return false
  })

  if (!updates || !updates.length) {
    return null
  }

  const indexed = updates.reduce((acc, n) => ({
    ...acc,
    [n._id]: n
  }), {})
  console.log(indexed)

  return indexed
}
