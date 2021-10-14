import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { roomsSelector, computedIndexRooms } from 'rc-mobile-base/lib/selectors/rooms';

import { keyBy, groupBy, map, find, filter, sortBy, includes, each } from 'lodash/collection';
import { get, extend, values, mapKeys, keys, assign, merge, pick } from 'lodash/object';
import { uniq, flatten } from 'lodash/array';

import Inspections from '../models/inspection';

export const auditsSelector = state => state.audit.items;
export const auditSourcesSelector = state => state.audit_source.items;
export const inspectionsSelector = state => state.inspection.items;
export const inspectionSourcesSelector = state => state.inspection_source.items;

export const normalizedInspectionsSelector = createSelector(
  [inspectionsSelector],
  (inspections) => map(inspections, i => Inspections.normalizeOne(i))
)

export const indexedInspectionsSelector = createSelector(
  [normalizedInspectionsSelector],
  (inspections) => groupBy(inspections, i => i && i.audit_id && i.audit_id.toString() || '')
)

export const hotelAuditsSelector = createSelector(
  [auditsSelector, indexedInspectionsSelector, computedIndexRooms],
  (audits, indexedInspections, indexedRooms) => {
    return map(audits, audit => {
      const auditId = audit && audit.audit_id && audit.audit_id.toString() || '';
      const inspections = get(indexedInspectionsSelector, auditId, []);
      const consumption = get(indexedRooms, audit.consumption_id, '');

      return {
        ...audit,
        inspections,
        consumptionName: get(consumption, 'name'),
        consumptionId: get(consumption, '_id', '')
      }
    }).sort(auditSort);
  }
)

export const roomAuditsSelector = (roomId) => createSelector(
  [hotelAuditsSelector],
  (hotelAudits) => hotelAudits
    .filter(audit => audit.consumption_id === roomId)
)

const auditSort = (a, b) => {
  if (a.status === 'paused' && b.status === 'completed') { return -1 }
  if (a.status === 'paused' && b.status === 'open') { return -1 }
  if (a.status === 'open' && b.status === 'completed') { return -1 }
  if (a.status === 'open' && b.status === 'paused') { return 1 }
  if (b.status === 'paused' && a.status === 'completed') { return 1 }
  if (b.status === 'paused' && a.status === 'open') { return 1 }
  if (b.status === 'open' && a.status === 'completed') { return 1 }
  if (b.status === 'open' && a.status === 'paused') { return -1 }
  return 0
}