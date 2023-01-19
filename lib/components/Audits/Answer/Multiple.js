import { get, map, filter, last } from 'lodash';
import React, { useState } from 'react';

import {
  MultipleContainer,
  MultipleOption,
  Option,
} from './styles';

// import  from './Option';

// export default Multiple = ({ responseFormArray: options, value = "", onChange, ...props }) => options && options.length > 0 ? (
export default CheckBox = ({ responseFormArray: options, value, singleAnswerDefault, onChange, ...props }) => {
  if (options && options.length > 0) {
    const mapOption = map(options, function (obj) {
      return { ...obj, answerResultSelected: get(obj, 'input', '') === singleAnswerDefault }
    })
    const [responseArray, setResponseArray] = useState(mapOption);

    const onCheckValue = (option) => {
      const mapOption = map(responseArray, function (obj) {
        return { ...obj, answerResultSelected: obj === option ? !(get(obj, 'answerResultSelected', false)) : false }
      })
      // onChange({ value: last(map(filter(mapOption, 'answerResultSelected'), 'input')), label: get(option, 'input', '')})
      onChange(mapOption)
      setResponseArray(mapOption)
    }

    return (
      <MultipleContainer {...props}>
        {
          responseArray.map((option, index) => (
            <MultipleOption
              key={index}
              // active={get(option, 'input', '') === get(option, 'defaultSelection', '')}
              active={get(option, 'answerResultSelected', false)}
              // onPress={() => onChange({ value: option, label: option })}
              onPress={() => onCheckValue(option)}
              card={props.card}
            >
              {get(option, 'input', '')}
            </MultipleOption>
          ))
        }
      </MultipleContainer>
    )
  } else {
    return null
  }
}