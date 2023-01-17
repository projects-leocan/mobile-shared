import { createSelector } from 'reselect';

import { AuditSources, Audits } from 'rc-mobile-base/lib/models';

import { userSelector, hotelIdSelector } from 'rc-mobile-base/lib/selectors/auth';

import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import find from 'lodash/find';

import { buildAnswer, prepareInspections } from '../../utils/audit';

export const getById = (id) => createSelector(
  [Audits.getById(id), AuditSources.all(), userSelector, hotelIdSelector],
  (audit, auditSources, user, hotelId) => {
    const auditSource = auditSources.find(as => as.id.toString() === audit.audit_source_id.toString())
    if (!auditSource) {
      return null
    }
    const responder_id = user._id
    const responder_name = user.fullName
    const hotel_id = hotelId

    let inspections = auditSource.inspections.map((inspection, index) => {
      const existing = (audit.inspections || []).find(i => i.inspection_source_id === inspection.id)

      // const submitTasks = inspection.hotAnswers.reduce((acc, answer) => {
      //   if (!get(answer, 'condition.label')) {
      //     return acc;
      //   }
        
      //   return {
      //     ...acc,
      //     [answer.condition.label]: true,
      //   }
      // }, {})

      const submitTasks = inspection.hotAnswers.filter(answer => {
        const conditionLabel = get(answer, 'condition.label');
        const valueLabel = get(inspection, 'answer_label') || get(existing, 'answer_label');
        
        if (!conditionLabel || !valueLabel) {
          return false;
        }

        return conditionLabel === valueLabel;
      });

      const score = (inspection.scores || []).reduce((pv, item) => {
        const conditionLabel = get(item, 'condition.label');
        const valueLabel = get(inspection, 'answer_label') || get(existing, 'answer_label');
        
        if (!conditionLabel || !valueLabel) {
          return pv;
        }

        if (conditionLabel === valueLabel) {
          pv = Number(item.score);
        }
        return pv
      }, 0);

      if (existing) {
        return {
          ...existing,

          question: get(existing, 'question') ? get(existing, 'question').trim() : null,
          question_section: get(existing, 'question_section') ? get(existing, 'question_section').trim() : null,
          question_comment: get(existing, 'question_comment') ? get(existing, 'question_comment').trim() : null,

          options: inspection.options,
          hotAnswers: inspection.hotAnswers,
          isExisting: true,

          // submitTasks: isEmpty(existing.submitTasks) ? submitTasks : existing.submitTasks,
          submitTasks,
          score
        }
      }

      return ({
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
        options: inspection.options,

        id: index,
        isExisting: false,

        submitTasks,
        score
      })
    })

    inspections = prepareInspections(inspections)

    return {
      ...audit,
      responder_id,
      responder_name,
      hotel_id,
      inspections,
      isExisting: true,
    }
  }
)
