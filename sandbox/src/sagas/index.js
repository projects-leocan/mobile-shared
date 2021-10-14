import { fork } from 'redux-saga/effects';
import { createSagasWithOffline } from '../../lib/sagas';

import API_URL from '../api';

const params = { apiUrl: API_URL };
const appSagas = createSagasWithOffline(params);

export default appSagas.root;
