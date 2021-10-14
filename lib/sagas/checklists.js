import { takeLatest, put, call, select, fork } from 'redux-saga/effects';
import moment from 'moment';

import ChecklistsTypes from '../constants/checklists';
import ChecklistsActions from '../actions/checklists';
import BackendActions from '../actions/backend';

import request, { authRequest } from '../utils/request';
import { forkWatchers } from '../utils/sagas';

export default function({ apiUrl }) {
  const CHECKLISTS_API = `/checklists`;
  const CHECKLIST_UPDATE_API = `/checklist_logs`;

  // Hotel Checklists
  function * fetchChecklists() {
    return yield call(authRequest, CHECKLISTS_API);
  }

  function * fetchChecklistsFlow() {
    try {
      // const { backend: { assets: { lastUpdate }}} = yield select();
      const data = yield call(fetchChecklists);
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }

      // yield put(AssetsActions.assetsSuccess(data))
      // yield put(BackendActions.assetsFetched());
      yield put(ChecklistsActions.checklistsFetchSuccess(data))
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function * watchFetchChecklistsFlow() {
    yield takeLatest(ChecklistsTypes.CHECKLISTS_FETCH, fetchChecklistsFlow);
  }

  function * updateChecklistFlow({ checklist }) {
    const { auth: { userId, hotelId, user: { first_name, last_name }}} = yield select();
    
    try {
      const data = {
        hotel_id: hotelId,
        responsible_id: userId,
        responsible_first_name: first_name,
        responsible_last_name: last_name,
        last_ts: moment().unix(),
        ...checklist
      }

      const response = yield call(authRequest, CHECKLIST_UPDATE_API, {
        method: 'POST',
        body: JSON.stringify({
          checklist: data
        })
      })

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  function * watchUpdateChecklistFlow() {
    yield takeLatest(ChecklistsTypes.CHECKLIST_UPDATE, updateChecklistFlow);
  }

  function * fetchActiveChecklistsFlow() {
    try {
      const data = yield call(authRequest, CHECKLIST_UPDATE_API);
      
      yield put(ChecklistsActions.activeChecklistsFetchSuccess(data));
    } catch (error) {
      console.log(error);
    }
  }

  function * watchFetchActiveChecklistsFlow() {
    yield takeLatest(ChecklistsTypes.ACTIVE_CHECKLISTS_FETCH, fetchActiveChecklistsFlow)
  }
  
  const watchers = {
    watchFetchChecklistsFlow,
    watchUpdateChecklistFlow,
    watchFetchActiveChecklistsFlow
  }

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas: {
      fetchChecklistsFlow,
      updateChecklistFlow,
      fetchActiveChecklistsFlow
    }
  }
}