import { fork, all } from 'redux-saga/effects';

import assets from './assets'
import auth from './auth'
import backend from './backend'
import glitches from './glitches'
import routes from './routes'
import rooms from './rooms'
import updates from './updates'
import users from './users'
import checklists from './checklists'
import outbound from './outbound';

import { forkWatchers } from '../utils/sagas';
import { createSagas as createOfflineSagas } from '../offline';
import { sagas as createWifiSagas } from '../wifi';

export const createBaseSagas = (params) => {
  const assetsSagas = assets(params)
  const authSagas = auth(params)
  const glitchesSagas = glitches(params)
  const routesSagas = routes(params)
  const roomsSagas = rooms(params)
  const updatesSagas = updates(params)
  const usersSagas = users(params)
  const checklistsSagas = checklists(params)
  const backendSagas = backend(params)
  const outboundSagas = outbound(params)

  const watchers = {
    ...assetsSagas.watchers,
    ...updatesSagas.watchers,
    ...authSagas.watchers,
    ...glitchesSagas.watchers,
    ...roomsSagas.watchers,
    ...routesSagas.watchers,
    ...updatesSagas.watchers,
    ...usersSagas.watchers,
    ...checklistsSagas.watchers,
    ...backendSagas.watchers,
    ...outboundSagas.watchers
  }

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas: {
      ...assetsSagas.sagas,
      ...authSagas.sagas,
      ...glitchesSagas.sagas,
      ...roomsSagas.sagas,
      ...routesSagas.sagas,
      ...updatesSagas.sagas,
      ...usersSagas.sagas,
      ...checklistsSagas.sagas,
      ...backendSagas.sagas,
      ...outboundSagas.sagas,
    }
  }
}

export const createSagasWithOffline = (params) => {
  const baseSagas = createBaseSagas(params);
  const { watchers: baseWatchers, sagas } = baseSagas;
  // const requireSaga = (saga) => sagas[saga];
  const requireSaga = (saga) => {
    const candidat = sagas[saga]
    if (!candidat) {
      throw new Error(`Cannot find saga: ${saga}`)
    }
    return candidat
  }

  const offlineSagas = createOfflineSagas({ requireSaga, ...params });
  const { watchers: offlineWatchers } = offlineSagas;

  const watchers = {
    ...baseWatchers,
    ...offlineWatchers,
  };

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas,
  };
}

export const createAllSagas = (params) => {
  const baseSagas = createSagasWithOffline(params);
  const { watchers: baseWatchers, sagas } = baseSagas;

  const wifiSagas = createWifiSagas({ ...params });
  const { watchers: wifiWatchers } = wifiSagas;

  const watchers = {
    ...baseWatchers,
    ...wifiWatchers,
  };

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas,
  };
}

export default createBaseSagas;
