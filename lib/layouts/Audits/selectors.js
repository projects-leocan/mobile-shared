import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import orderBy from 'lodash/orderBy';

import { userIdSelector } from '../../selectors/auth';

import { Audits, AuditSources } from 'rc-mobile-base/lib/models';

export const allAudits = createSelector(
  [Audits.all(), AuditSources.all(), userIdSelector],
  (audits, auditSources, userId) => {
    const active = audits.filter(a => a.status !== 'cancelled')
    const valid = active.filter(a => {
      const auditSource = auditSources.find(as => as.id.toString() === a.audit_source_id.toString())
      return !!auditSource
    })

    const assigned = valid.filter(a => (a.assigned || []).includes(userId) || a.responder_id === userId)

    const paused = assigned.filter(a => a.status === 'paused')
    const open = assigned.filter(a => a.status === 'open')
    const completed = assigned.filter(a => a.status === 'completed')

    const grouped = groupBy(completed, 'name')

    const closed = orderBy(Object.keys(grouped).reduce((acc, audit) => {
      const arr = grouped[audit]
      const latest = maxBy(arr, 'updated_at')

      return [...acc, latest]
    }, []), ['updated_at'], ['desc'])

    return [...paused, ...open, ...closed]
  }
)

export const roomAudits = (roomId) => createSelector(
  [allAudits],
  (audits) => audits
    .filter(audit => audit.consumption_id === roomId)
)