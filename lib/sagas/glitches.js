import { takeLatest, put, call, select, fork, take, takeEvery } from 'redux-saga/effects';

import GlitchesTypes from '../constants/glitches';
import GlitchesActions from '../actions/glitches';

import { userIdSelector } from '../selectors/auth';

import request, { authRequest } from '../utils/request';
import { forkWatchers } from '../utils/sagas';

import {
  hotelIdSelector
} from "../selectors/auth";
import { groupBy } from 'lodash';

export default function ({ apiUrl }) {

  const GLITCHES_API = `/Experience/GetListOfExperiences`;
  const INSERT_NEW_GLITCHES = "/Experience/InsertExperience"
  // const GLITCHES_OPTIONS_API = `/glitch_options`;
  const GLITCHES_OPTIONS_API = `/ExperienceCategories/GetListOfExperienceCategories`;


  // Hotel Glitches
  function* fetchGlitches() {
    // return yield call(authRequest, GLITCHES_API);
    const userHotelId = yield select(hotelIdSelector);
    return yield call(authRequest, GLITCHES_API, {
      method: 'POST',
      body: JSON.stringify({
        hotelId: userHotelId
      })
    });
  }

  function* fetchGlitchesFlow() {
    try {
      const { backend: { glitches: { lastUpdate } } } = yield select();
      const data = yield call(fetchGlitches);
      if (data.ts && lastUpdate > data.ts) {
        return true;
      }

      yield put(GlitchesActions.glitchesSuccess(data));
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchGlitchesFlow(state) {
    yield takeLatest(GlitchesTypes.GLITCHES_FETCH, fetchGlitchesFlow);
  }

  function* fetchGlitchOptions() {
    // return yield call(authRequest, GLITCHES_OPTIONS_API);
    return yield call(authRequest, GLITCHES_OPTIONS_API, {
      method: 'POST',
      body: JSON.stringify({})
    });
  }

  function* fetchGlitchesOptionsFlow() {
    try {
      // const { backend: { glitchesOptions: { lastUpdate }}} = yield select();
      const data = yield call(fetchGlitchOptions);
      const NewData = data
      // if (data.ts && lastUpdate > data.ts) {
      //   return true;
      // }
      const mainCategory = []
      const subCategory = []
      data.map((category) => {
        if (category.parentExperienceCategoryId === null || category.parentExperienceCategoryId === "") {
          mainCategory.push(category)
        } else {
          subCategory.push(category)
        }
      })
      const finalArray = mainCategory.map((main) => {
        const allSubCategory = []
        subCategory.map((sub) => {
          if (main.id === sub.parentExperienceCategoryId) {
            let obj = {
              id: sub.id,
              name: sub.name,
              parentExperienceCategoryId: sub.parentExperienceCategoryId,
              hasAnyChildren: sub.hasAnyChildren,
              withMainCategory: main.name + " - " + sub.name,
            }
            allSubCategory.push(obj)
          }
        })
        return ({ ...main, options: allSubCategory })
      })
      yield put(GlitchesActions.glitchesOptionsSuccess(finalArray));
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchGlitchesOptionsFlow(state) {
    yield takeLatest(GlitchesTypes.GLITCHES_OPTIONS_FETCH, fetchGlitchesOptionsFlow);
  }

  // New Glitch
  function* submitNewGlitch(data) {
    const userId = yield select(userIdSelector);
    return yield call(authRequest, INSERT_NEW_GLITCHES, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  function* submitNewGlitchFlow({ newGlitch }) {
    try {
      const response = yield call(submitNewGlitch, newGlitch);
      const data = yield call(fetchGlitches);
      yield put(GlitchesActions.glitchesSuccess(data));
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchNewGlitchFlow() {
    yield takeLatest(GlitchesTypes.GLITCH_NEW, submitNewGlitchFlow);
  }

  // Acknowledge Glitch
  function* acknowledgeGlitch(uuid) {
    const userId = yield select(userIdSelector);

    return yield call(authRequest, `${GLITCHES_API}/${uuid}/acknowledge`, {
      method: 'PUT',
      body: JSON.stringify({
        user_id: userId
      })
    });
  }

  function* acknowledgeGlitchFlow({ glitchId }) {
    const userId = yield select(userIdSelector);

    try {
      yield put(GlitchesActions.glitchAcknowledgeOptimistic(glitchId, userId));
      const response = yield call(acknowledgeGlitch, glitchId);
      const data = yield call(fetchGlitches);
      yield put(GlitchesActions.glitchesSuccess(data));
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchAcknowledgeGlitchFlow() {
    yield takeLatest(GlitchesTypes.GLITCH_ACKNOWLEDGE, acknowledgeGlitchFlow);
  }

  // Batch Acknowledge Glitch
  function* batchAcknowledgeGlitchFlow({ entries }) {
    const userId = yield select(userIdSelector);

    try {
      yield put(GlitchesActions.glitchBatchAcknowledgeOptimistic(entries, userId));
      const response = yield call(authRequest, `${GLITCHES_API}/batch/acknowledge`, {
        method: 'PUT',
        body: JSON.stringify({ entries, user_id: userId })
      });
    } catch (error) {
      console.log(error)
    }
  }

  function* watchBatchAcknowledgeGlitchFlow() {
    yield takeLatest(GlitchesTypes.GLITCH_BATCH_ACKNOWLEDGE, batchAcknowledgeGlitchFlow);
  }

  // Recategorize Glitch
  function* recategorizeGlitch(uuid, category, assignment) {
    const userId = yield select(userIdSelector);

    return yield call(authRequest, `${GLITCHES_API}/${uuid}/recategorize`, {
      method: 'PUT',
      body: JSON.stringify({
        user_id: userId,
        category,
        assignment
      })
    });
  }

  function* recategorizeGlitchFlow({ glitchId, category, assignment }) {
    try {
      const response = yield call(recategorizeGlitch, glitchId, category, assignment);
      const data = yield call(fetchGlitches);
      yield put(GlitchesActions.glitchesSuccess(data));
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchRecategorizeGlitchFlow() {
    yield takeLatest(GlitchesTypes.GLITCH_RECATEGORIZE, recategorizeGlitchFlow);
  }

  // Start Glitch
  function* startGlitch(uuid) {
    const userId = yield select(userIdSelector);

    return yield call(authRequest, `${GLITCHES_API}/${uuid}/start`, {
      method: 'PUT',
      body: JSON.stringify({
        user_id: userId,
      })
    });
  }

  function* startGlitchFlow({ glitchId }) {

    try {
      const response = yield call(startGlitch, glitchId);
      const data = yield call(fetchGlitches);
      yield put(GlitchesActions.glitchesSuccess(data));
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchStartGlitchFlow() {
    yield takeLatest(GlitchesTypes.GLITCH_START, startGlitchFlow);
  }

  // Update Glitch
  function* submitUpdateGlitch(uuid, data) {
    const userId = yield select(userIdSelector);
    return yield call(authRequest, `${GLITCHES_API}/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        user_id: userId
      })
    });
  }

  function* submitUpdateGlitchFlow({ glitchId, updatedGlitch }) {
    try {
      yield call(submitUpdateGlitch, glitchId, updatedGlitch);
      const data = yield call(fetchGlitches);
      yield put(GlitchesActions.glitchesSuccess(data));
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchUpdateGlitchFlow() {
    yield takeLatest(GlitchesTypes.GLITCH_UPDATE, submitUpdateGlitchFlow);
  }

  // Handover Glitch
  function* submitHandoverGlitch(uuid, assignment) {
    const userId = yield select(userIdSelector);

    return yield call(authRequest, `${GLITCHES_API}/${uuid}/handover`, {
      method: 'PUT',
      body: JSON.stringify({
        user_id: userId,
        handover_id: assignment
      })
    });
  }

  function* submitHandoverGlitchFlow({ glitchId, assignment }) {
    try {
      yield call(submitHandoverGlitch, glitchId, assignment);
      const data = yield call(fetchGlitches);
      yield put(GlitchesActions.glitchesSuccess(data));
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchHandoverGlitchFlow() {
    yield takeLatest(GlitchesTypes.GLITCH_HANDOVER, submitHandoverGlitchFlow);
  }

  // Email Glitch
  function* submitEmailGlitch(data) {
    const userId = yield select(userIdSelector);
    const {
      uuid,
      address,
      subject,
      message
    } = data;
    return yield call(authRequest, `${GLITCHES_API}/${uuid}/email`, {
      method: 'PUT',
      body: JSON.stringify({
        address,
        subject,
        message,
        user_id: userId
      })
    });
  }

  function* submitEmailGlitchFlow({ emailGlitch }) {
    try {
      yield call(submitEmailGlitch, emailGlitch);
      const data = yield call(fetchGlitches);
      yield put(GlitchesActions.glitchesSuccess(data));
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchEmailGlitchFlow() {
    yield takeLatest(GlitchesTypes.GLITCH_EMAIL, submitEmailGlitchFlow);
  }

  // Close Glitch
  function* submitCloseGlitch(uuid, data) {
    const userId = yield select(userIdSelector);

    return yield call(authRequest, `${GLITCHES_API}/${uuid}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        user_id: userId,
        is_completed: true,
      })
    });
  }

  function* submitCloseGlitchFlow({ glitchId, closedGlitch }) {
    try {
      yield call(submitCloseGlitch, glitchId, closedGlitch);
      const data = yield call(fetchGlitches);
      yield put(GlitchesActions.glitchesSuccess(data));
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  function* watchCloseGlitchFlow() {
    yield takeLatest(GlitchesTypes.GLITCH_CLOSE, submitCloseGlitchFlow);
  }

  const watchers = {
    watchGlitchesFlow,
    watchGlitchesOptionsFlow,
    watchNewGlitchFlow,
    watchAcknowledgeGlitchFlow,
    watchBatchAcknowledgeGlitchFlow,
    watchRecategorizeGlitchFlow,
    watchStartGlitchFlow,
    watchUpdateGlitchFlow,
    watchHandoverGlitchFlow,
    watchEmailGlitchFlow,
    watchCloseGlitchFlow
  };

  const root = forkWatchers(watchers);

  return {
    root,
    watchers,
    sagas: {
      fetchGlitches,
      fetchGlitchesFlow,
      fetchGlitchOptions,
      fetchGlitchesOptionsFlow,
      submitNewGlitch,
      submitNewGlitchFlow,
      batchAcknowledgeGlitchFlow,
      submitUpdateGlitch,
      submitUpdateGlitchFlow,
      submitHandoverGlitch,
      submitHandoverGlitchFlow,
      submitEmailGlitch,
      submitEmailGlitchFlow,
      submitCloseGlitch,
      submitCloseGlitchFlow,
    }
  }
}
