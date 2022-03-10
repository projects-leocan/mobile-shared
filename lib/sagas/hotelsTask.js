import { takeLatest, put, call, select, fork } from 'redux-saga/effects';

import AvailHotelTaskTypes from '../constants/hotelsTask';
import HotelsTaskActions from '../actions/hotelsTask';
import BackendActions from '../actions/backend';

import request, { authRequest } from '../utils/request';
import { forkWatchers } from '../utils/sagas';
import { hotelIdSelector, availableHotelsSelector } from "../selectors/auth";
import { get, flatten } from 'lodash';

export default function ({ apiUrl }) {
    const TASKS_API = `/Task/GetListOfTasks`;

    // Hotel Users
    function* fetchTasksByHotel(hotelId) {
        // const userHotelId = yield select(hotelIdSelector);
        return yield call(authRequest, TASKS_API, {
            method: 'POST',
            body: JSON.stringify({
                hotelId: hotelId
            })
        });
    }

    function* getTasksByHotel(availableHotels) {
        let hotelsTask = [];
        for (let [index, item] of availableHotels.entries()) {
            const hotelTask = yield call(fetchTasksByHotel, get(item, 'hotelId', null));

            hotelsTask.unshift(hotelTask);
            if (availableHotels.length === (index + 1)) {
                return flatten(hotelsTask)
            }
        }
    }

    function* fetchHotelsTaskFlow() {
        try {
            const availableHotels = yield select(availableHotelsSelector);

            const data = yield call(getTasksByHotel, availableHotels);
            yield put(HotelsTaskActions.availHotelTaskSuccess(data))
        } catch (e) {
            yield put(HotelsTaskActions.availHotelTaskFailure(e))
        } finally {

        }
    }

    function* watchUsersFlow(state) {
        yield takeLatest(AvailHotelTaskTypes.AVAILABLE_HOTEL_TASK_FETCH, fetchHotelsTaskFlow);
    }

    const watchers = {
        watchUsersFlow
    };

    const root = forkWatchers(watchers);

    return {
        root,
        watchers,
        sagas: {
            fetchTasksByHotel,
            fetchHotelsTaskFlow,
        }
    }
}
