import { put, call } from 'redux-saga/effects';
import { createSelector } from 'reselect';
// import { Resource } from 'rc-react-shared/utils';
import { Resource } from 'rc-mobile-base/lib/utils/redux-tools';
import { authRequest } from 'rc-mobile-base/lib/utils/request';

import InspectionSources from './inspection-source';

const API_URL = `/audit_sources`

class AuditSource extends Resource {
  name = 'audit_source'

  onLoad = function * () {
    try {
      const response = yield call(authRequest, API_URL);
      return yield put(this.actions.load.success(this.normalize(response.audit_sources)));
    } catch (error) {
      return yield put(this.actions.load.failure(error));
    }
  }.bind(this)

  all = () => {
    const all = this.selectors.all()
    return createSelector(
      [all, InspectionSources.all()],
      (auditSources, inspectionSources) => {
        return auditSources.map(audit => {
          const inspections = inspectionSources.filter(i => i.audit_source_id === audit.id)
          return {
            ...audit,
            inspections,
          }
        })
      }
    )
  }

  getById = (id) => {
    return createSelector(
      [this.all()],
      (all) => all.find(auditSource => auditSource.id === id)
    )
  }
}

export default new AuditSource({name: 'audit_source'})
