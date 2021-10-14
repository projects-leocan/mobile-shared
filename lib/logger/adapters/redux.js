import Adapter from '../adapter';

class ReduxAdapter extends Adapter {
  static normalizeMessage(message) {
    if (!message) {
      return super.normalizeMessage(message)
    }
    if (message.reduxAction) {
      return `Fired ${message.reduxAction}`
    }
    if (message.reduxActionTime) {
      return `Completed in ${message.reduxActionTime} ms`
    }

    const value = super.normalizeMessage(message)
    return `Parameters: ${value}`
  }

  static normalize(config, data) {
    const base = super.normalize(config, data)
    const message = ReduxAdapter.normalizeMessage(data)

    return {
      ...base,
      message,
    }
  }
}

export default ReduxAdapter
