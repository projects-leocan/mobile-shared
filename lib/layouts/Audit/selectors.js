import { createSelector } from 'reselect';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

import { AuditSources, Audits } from 'rc-mobile-base/lib/models';

import { userSelector, hotelIdSelector } from 'rc-mobile-base/lib/selectors/auth';

import { buildAnswer, prepareInspections } from '../../utils/audit';

export const getById = (id) => createSelector(
  [AuditSources.getById(id), userSelector, hotelIdSelector],
  (auditSource, user, hotelId) => {
    const responder_id = user._id
    const responder_name = user.fullName
    const hotel_id = hotelId

    let inspections = sortBy(auditSource.inspections, 'sortValue').map((inspection, index) => {
      const submitTasks = inspection.hotAnswers.filter(answer => {
        const conditionLabel = get(answer, 'condition.label');
        const valueLabel = get(inspection, 'answer_label');
        
        if (!conditionLabel || !valueLabel) {
          return false;
        }

        return conditionLabel === valueLabel;
      });

      return {
        hotel_id,

        inspection_source_id: inspection.id,

        is_hot: false,

        ...buildAnswer(inspection),

        note: null,
        photo: null,
        meta: "",
        question: get(inspection, 'question') ? get(inspection, 'question').trim() : null,
        question_section: get(inspection, 'section') ? get(inspection, 'section').trim() : null,
        question_comment: get(inspection, 'comment') ? get(inspection, 'comment').trim() : null,
        question_kind: inspection.kind,
        required: inspection.required,
        hotAnswers: inspection.hotAnswers,
        scores: inspection.scores,
        options: inspection.options,

        id: index,
        isExisting: false,
        submitTasks

        // submitTasks: inspection.hotAnswers.reduce((acc, answer) => {
        //   if (!get(answer, 'condition.label')) {
        //     return acc;
        //   }
        //   return {
        //     ...acc,
        //     [answer.condition.label]: true,
        //   }
        // }, {}),
      }
    })

    inspections = prepareInspections(inspections)

    return {
      ...omit(auditSource, 'id'),
      responder_id,
      responder_name,
      hotel_id,
      audit_source_id: auditSource.id,
      inspections,
      isExisting: false,
    }
  }
)
