import { first, last, get, map } from 'lodash';
import React, { useState } from 'react';

import {
  Container,
  YesOption,
  NoOption
} from './styles';

// export default TrueFalse = ({ responseFormArray: options, value, onChange, ...props }) => options && options.length > 0 ? (
export default TrueFalse = ({ responseFormArray: options, value, onChange, ...props }) => {
  if (options && options.length > 0) {
    const mapOption = map(options, function (obj) {
      return { ...obj, isSelected: get(obj, 'input', '') === get(obj, 'defaultSelection', '') }
    })
    const [responseArray, setResponseArray] = useState(mapOption);

    const onOptionOne = () => {
      const mapOption = map(responseArray, function (obj, index) {
        return { ...obj, isSelected: index === 0 ? !(get(obj, 'isSelected', false)) : false }
      })
      setResponseArray(mapOption)
      onChange(mapOption[0])
    }

    const onOptionTwo = () => {
      const mapOption = map(responseArray, function (obj, index) {
        return { ...obj, isSelected: index === 1 ? !(get(obj, 'isSelected', false)) : false }
      })
      setResponseArray(mapOption)
      onChange(mapOption[1])
    }

    return (
      <Container {...props}>
        <YesOption
          card={props.card}
          // active={get(first(mapOption), 'defaultSelection', '') === get(first(mapOption), 'input', '')}
          active={get(first(responseArray), 'isSelected', '')}
          onPress={() => onOptionOne()}
        >
          {get(first(responseArray), 'input', '')}
        </YesOption>
        <NoOption
          card={props.card}
          // active={get(last(mapOption), 'defaultSelection', '') === get(last(mapOption), 'input', '')}
          // active={value === options[1].value}
          active={get(last(responseArray), 'isSelected', '')}
          // onPress={() => onChange(mapOption[1])}
          onPress={() => onOptionTwo()}
        >
          {get(last(responseArray), 'input', '')}
        </NoOption>
      </Container>
    )
  } else {
    return null
  }
}