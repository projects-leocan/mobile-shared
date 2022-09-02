import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import orderBy from 'lodash/orderBy';

import { userIdSelector } from '../../selectors/auth';

import { Audits, AuditSources } from 'rc-mobile-base/lib/models';
import auditData from './audit.json'
import { usersSelector } from 'rc-mobile-base/lib/selectors/rooms';
import { find, get, map } from 'lodash';

export const allAudits = createSelector(
  [usersSelector, userIdSelector],
  (users, userId) => {
    const mapAudits = map(auditData, function(audit) {
      return {
        ...audit,
        // auditCreater: find(users, function(o) { return get(o, 'id', null) === get(audit, 'CreatedBy', null) })
        auditCreater: find(users, function(o) { return get(o, 'id', null) === '1014130e-9d06-4b0b-b119-b03d03708176' })
      }
    })

    return mapAudits
  }
)

// export const allAudits = createSelector(
//   [Audits.all(), AuditSources.all(), userIdSelector],
//   (audits, auditSources, userId) => {
//     const active = audits.filter(a => a.status !== 'cancelled')
//     const valid = active.filter(a => {
//       const auditSource = auditSources.find(as => as.id.toString() === a.audit_source_id.toString())
//       return !!auditSource
//     })

//     const assigned = valid.filter(a => (a.assigned || []).includes(userId) || a.responder_id === userId)

//     const paused = assigned.filter(a => a.status === 'paused')
//     const open = assigned.filter(a => a.status === 'open')
//     const completed = assigned.filter(a => a.status === 'completed')

//     const grouped = groupBy(completed, 'name')

//     const closed = orderBy(Object.keys(grouped).reduce((acc, audit) => {
//       const arr = grouped[audit]
//       const latest = maxBy(arr, 'updated_at')

//       return [...acc, latest]
//     }, []), ['updated_at'], ['desc'])

//     return [...paused, ...open, ...closed]
//   }
// )

export const roomAudits = (roomId) => createSelector(
  [allAudits],
  (audits) => audits
    .filter(audit => audit?.consumption_id === roomId)
)