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
      return { ...obj, isSelected: get(obj, 'input', '') === singleAnswerDefault }
    })
    const [responseArray, setResponseArray] = useState(mapOption);

    const onCheckValue = (option) => {
      const mapOption = map(responseArray, function (obj) {
        return { ...obj, isSelected: obj === option ? !(get(obj, 'isSelected', false)) : false }
      })
      onChange({ value: last(map(filter(mapOption, 'isSelected'), 'input')), label: get(option, 'input', '')})
      setResponseArray(mapOption)
    }

    return (
      <MultipleContainer {...props}>
        {
          responseArray.map((option, index) => (
            <MultipleOption
              key={index}
              // active={get(option, 'input', '') === get(option, 'defaultSelection', '')}
              active={get(option, 'isSelected', false)}
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