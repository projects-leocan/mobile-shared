import React from 'react';
import get from 'lodash/get'

import TrueFalse from './TrueFalse';
import Multiple from './Multiple';
import MultiTrueFalse from './MultiTrueFalse';
import Range from './Range';
import Rating from './Rating';
import Response from './Response';
import CheckBox from './checkBox';

// const componentMap = {
//   trueFalse: TrueFalse,
//   multiple: Multiple,
//   multiTrueFalse: MultiTrueFalse,
//   response: Response,
//   range: Range,
//   rating: Rating,
// }

const componentMap = {
  trueFalse: TrueFalse,
  "Multiple Choice": Multiple,
  multiTrueFalse: MultiTrueFalse,
  response: Response,
  range: Range,
  rating: Rating,
  'Checkbox': CheckBox
}

// const getComponent = (kind) => componentMap[kind]
const getComponent = (kind) => componentMap[kind]


const Answer = ({ question_kind, responseType, ...props }) => {
  // const component = getComponent(question_kind)
  const component = getComponent(responseType)
  return component ? React.createElement(component, props) : null
}

export default Answer
