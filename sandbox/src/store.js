import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import createLogger from 'redux-logger';
import createSagaMiddleware, { END } from 'redux-saga';

import Rehydration from '../lib/utils/rehydration';
import persist from '../lib/persist';

import rootReducer from './reducers';
import sagas from './sagas';

const IS_DEBUG = false;
const USE_LOGGING = false;

const logger = createLogger({});
const sagaMiddleware = createSagaMiddleware();

let middleware = [];
middleware.push(sagaMiddleware);

if (IS_DEBUG) {
  middleware.push(logger);
}

export default () => {
  let store = {};

  if (persist.active) {
    let enhancers;
    if (IS_DEBUG) {
      enhancers = compose(
        applyMiddleware(...middleware),
        // autoRehydrate()
      );
    } else {
      enhancers = compose(
        applyMiddleware(...middleware),
        // autoRehydrate()
      );
    }

    store = createStore(
      rootReducer,
      enhancers
    );

    Rehydration.updateReducers(store);
  } else {
    let enhancers;
    if (IS_DEBUG) {
      enhancers = compose(
        applyMiddleware(...middleware),
      );
    } else {
      enhancers = compose(
        applyMiddleware(...middleware),
      );
    }

    store = createStore(
      rootReducer,
      enhancers
    );
  }

  sagaMiddleware.run(sagas);

  store.close = () => store.dispatch(END)

  return store;
}
