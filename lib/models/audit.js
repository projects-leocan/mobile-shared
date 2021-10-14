import { put, call } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import omit from 'lodash/omit';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
// import { Resource } from 'rc-react-shared/utils';
import { Resource } from 'rc-mobile-base/lib/utils/redux-tools';
import { authRequest } from 'rc-mobile-base/lib/utils/request';
import { roomsSelector } from 'rc-mobile-base/lib/selectors/rooms';

const API_URL = `/audits`

import Inspections from './inspection';

class Audit extends Resource {
  onLoad = function * () {
    try {
      const response = yield call(authRequest, API_URL);
      return yield put(this.actions.load.success(this.normalize(response.audits)));
    } catch (error) {
      return yield put(this.actions.load.failure(error));
    }
  }.bind(this)

  onInsert = function * ({ payload }) {
    try {
      const { inspections, ...data } = payload

      const response = yield call(authRequest, API_URL, {
        method: 'POST',
        body: JSON.stringify({
          audit: data
        })
      });
      const auditId = response.audit.id
      // console.log(response.audit.status, inspections.length)
      if (response.audit.status !== 'cancelled' && inspections && inspections.length > 0) {
        // console.log('here audit');
        yield call(Inspections.onInsertAll, { payload: inspections.map(i => ({ ...i, audit_id: auditId })) })
      }
      if (data.tempId) {
        response.audit.tempId = data.tempId
      }
      const result = yield put(this.actions.insert.success(response.audit));
      return result
    } catch (error) {
      console.log(error);
      return yield put(this.actions.insert.failure(error));
    }
  }.bind(this)

  onUpdate = function * ({ payload }) {
    try {
      const { inspections, ...data } = payload

      const response = yield call(authRequest, `${API_URL}/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          audit: data
        })
      });
      const auditId = response.audit.id

      const existingInspections = inspections.filter(i => i.isExisting)
      const newInspections = inspections.filter(i => !i.isExisting)

      if (response.status !== 'cancelled' && newInspections && newInspections.length > 0) {
        yield call(Inspections.onInsertAll, { payload: newInspections.map(i => ({ ...i, audit_id: auditId })) })
      }
      if (response.status !== 'cancelled' && existingInspections && existingInspections.length > 0) {
        yield call(Inspections.onUpdateAll, { payload: existingInspections })
      }

      const result = yield put(this.actions.update.success(response.audit));
      return result
    } catch (error) {
      return yield put(this.actions.update.failure(error));
    }
  }.bind(this)

  all = () => {
    const all = this.selectors.all()
    return createSelector(
      [all, Inspections.all(), roomsSelector],
      (audits, inspectionsAll, rooms) => {
        return audits.map(audit => {
          const inspections = inspectionsAll.filter(i => i && i.audit_id && i.audit_id.toString() === audit.id.toString())
          const consumption = rooms.find(room => room._id === audit.consumption_id)

          return {
            ...audit,
            inspections: inspections.map(i => Inspections.normalizeOne(i)),
            consumptionName: get(consumption, 'name'),
            consumptionId: get(consumption, '_id', '')
          }
        }).sort((a, b) => {
          if (a.status === 'paused' && b.status === 'completed') {
            return -1
          }
          if (a.status === 'paused' && b.status === 'open') {
            return -1
          }
          if (a.status === 'open' && b.status === 'completed') {
            return -1
          }
          if (a.status === 'open' && b.status === 'paused') {
            return 1
          }
          if (b.status === 'paused' && a.status === 'completed') {
            return 1
          }
          if (b.status === 'paused' && a.status === 'open') {
            return 1
          }
          if (b.status === 'open' && a.status === 'completed') {
            return 1
          }
          if (b.status === 'open' && a.status === 'paused') {
            return -1
          }
          return 0
        })
      }
    )
  }

  indexByConsuptionId = () => createSelector(
    [this.all()],
    (all) => groupBy(all, 'consumptionId')
  )

  getByConsumptionId = (roomId) => {
    return createSelector(
      [this.indexByConsuptionId()],
      (index) => get(index, roomId, [])
    )
  }

  getById = (id) => {
    return createSelector(
      [this.all()],
      (all) => all.find(audit => audit.id === id)
    )
  }
}

export default new Audit({name: 'audit'})
