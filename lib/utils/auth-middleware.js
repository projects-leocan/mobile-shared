import get from 'lodash/get';

const authMiddleware = store => next => action => {
  if (!get(action, 'meta.auth.enable', false)) {
    return next(action);
  }

  const { auth } = store.getState();
  action.meta.auth.data = auth;
  
  return next(action)
}

export default authMiddleware;