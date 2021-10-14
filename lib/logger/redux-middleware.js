import isEmpty from 'lodash/isEmpty';
import present from 'present';

const loggerMiddleware = logger => (config = {}) => store => next => action => {
  const { type, ...params } = action
  const whitelistParams = config.whitelistParams || []
  const whitelistState = config.whitelistState || {}

  const start = present()
  const result = next(action)
  const end = present()

  const selector = whitelistState[type]

  logger.group((log) => {
    log('info', {reduxAction: type})
    if (!isEmpty(params) && whitelistParams.includes(type)) {
      log('info', params)
    }
    if (selector) {
      const nextState = store.getState()
      log('info', {reduxActionState: selector(nextState)})
    }
    log('info', {reduxActionTime: (end - start).toFixed(2)})
  })

  return result
}

export default loggerMiddleware
