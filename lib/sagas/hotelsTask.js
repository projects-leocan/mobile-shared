import { takeLatest, put, call, select, fork, all } from 'redux-saga/effects';

import AvailHotelTaskTypes from '../constants/hotelsTask';
import HotelsTaskActions from '../actions/hotelsTask';
import BackendActions from '../actions/backend';

import request, { authRequest } from '../utils/request';
import { forkWatchers } from '../utils/sagas';
import { hotelIdSelector, availableHotelsSelector } from "../selectors/auth";
import { get, flatten, map } from 'lodash';

export default function ({ apiUrl }) {
    const TASKS_API = `/Task/GetListOfTasks`;
    const ROOMS_API = `/Room/GetListOfRooms`;

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
            let validateData = map(flatten(data), function (item) {
                return item.due_date ? item : { ...item, due_date: item.start_date };
            });

            yield put(HotelsTaskActions.availHotelTaskSuccess(validateData))
        } catch (e) {
            yield put(HotelsTaskActions.availHotelTaskFailure(e))
        } finally {

        }
    }

    function* watchHotelTasksFlow(state) {
        yield takeLatest(AvailHotelTaskTypes.AVAILABLE_HOTEL_TASK_FETCH, fetchHotelsTaskFlow);
    }

    function* fetchRoomsByHotel(hotelId) {
        // const userHotelId = yield select(hotelIdSelector);
        return yield call(authRequest, ROOMS_API, {
            method: 'POST',
            body: JSON.stringify({
                hotelId: hotelId
            })
        });
    }

    function* fetchHotelsRoomFlow() {
        try {
            const availableHotels = yield select(availableHotelsSelector);
            const data = yield all(availableHotels.map(hotel => call(fetchRoomsByHotel, get(hotel, 'hotelId', null))));

            yield put(HotelsTaskActions.availHotelRoomSuccess(flatten(data)))
        } catch (e) {
            yield put(HotelsTaskActions.availHotelRoomFailure(e))
        } finally {

        }
    }

    function* watchHotelRoomsFlow(state) {
        yield takeLatest(AvailHotelTaskTypes.AVAILABLE_HOTEL_ROOM_FETCH, fetchHotelsRoomFlow);
    }

    const watchers = {
        watchHotelTasksFlow,
        watchHotelRoomsFlow
    };

    const root = forkWatchers(watchers);

    return {
        root,
        watchers,
        sagas: {
            fetchTasksByHotel,
            fetchHotelsTaskFlow,
            fetchRoomsByHotel,
            fetchHotelsRoomFlow
        }
    }
}
