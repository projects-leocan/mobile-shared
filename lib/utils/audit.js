import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import identity from 'lodash/identity';

export const buildAnswer = (inspection) => {
  const defaultAnswer = inspection.defaultAnswer
  const answer = inspection.required ? defaultAnswer : null

  if (!answer) {
    return {
      answer: null,
      answer_label: null,
    }
  }

  let answer_label = null

  if (inspection.kind === 'trueFalse' || inspection.kind === 'multiTrueFalse') {
    answer_label = inspection.options.find(o => {
      return o.value === defaultAnswer
    })
    answer_label = answer_label && answer_label.label
  } else {
    answer_label = inspection.options.find(o => {
      return o === defaultAnswer
    })
  }

  return {
    answer,
    answer_label,
  }
}

export const prepareInspections = (inspections) => {
  const groups = groupBy(inspections, 'question_section')
  const sections = orderBy(Object.keys(groups), identity, ['asc'])

  return sections.reduce((acc, section) => {
    const items = orderBy(groups[section], 'created_at', ['asc'])
    return [...acc, ...items]
  }, [])
}
