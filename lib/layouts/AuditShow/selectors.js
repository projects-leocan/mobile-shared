import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';

import { InspectionSources, Audits } from 'rc-mobile-base/lib/models';

export const getById = (id) => createSelector(
  [Audits.getById(id), InspectionSources.all()],
  (audit, inspectionSources) => {
    let inspections = audit.inspections.map((inspection, index) => {
      const inspectionSource = inspectionSources.find(i => i.id === inspection.inspection_source_id)
      return {
        ...inspection,
        options: inspectionSource.options,
        isExisting: true,
      }
    })

    inspections = sortBy(inspections, 'question_section')

    return {
      ...audit,
      inspections,
      isExisting: true,
    }
  }
)
