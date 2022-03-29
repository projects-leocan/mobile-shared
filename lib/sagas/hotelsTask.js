import { takeLatest, put, call, select, fork, all } from 'redux-saga/effects';

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

    function* fetchHotelsTaskFlow() {
        try {
            const availableHotels = yield select(availableHotelsSelector);

            const data = yield all(availableHotels.map(hotel => call(fetchTasksByHotel, get(hotel, 'hotelId', null))));
            yield put(HotelsTaskActions.availHotelTaskSuccess(flatten(data)))
        } catch (e) {
            yield put(HotelsTaskActions.availHotelTaskFailure(e))
        } finally {

        }
    }

    function* watchHotelTasksFlow(state) {
        yield takeLatest(AvailHotelTaskTypes.AVAILABLE_HOTEL_TASK_FETCH, fetchHotelsTaskFlow);
    }

    const watchers = {
        watchHotelTasksFlow
    };

    const root = forkWatchers(watchers);

    return {
        root,
        watchers,
        sagas: {
            fetchTasksByHotel,
            fetchHotelsTaskFlow
        }
    }
}
