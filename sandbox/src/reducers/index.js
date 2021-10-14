import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

import baseReducers from '../../lib/reducers';
import offlineReducer from '../../lib/offline/reducer';

export default combineReducers({
  ...baseReducers,
  form: formReducer,
  offline: offlineReducer({ attempts: 2, delay: 1000 }),
});
