import { first, last, get, map } from 'lodash';
import React, { useEffect, useState } from 'react';

import {
  Container,
  YesOption,
  NoOption
} from './styles';

// export default TrueFalse = ({ responseFormArray: options, value, onChange, ...props }) => options && options.length > 0 ? (
export default TrueFalse = ({ responseFormArray: options, value, singleAnswerDefault, onChange, ...props }) => {
  if (options && options.length > 0) {
    const mapOption = map(options, function (obj) {
      return { ...obj, answerResultSelected: get(obj, 'input', '') === singleAnswerDefault }
    })
    const [responseArray, setResponseArray] = useState(mapOption);

    const onOptionOne = () => {
      const mapOption = map(responseArray, function (obj, index) {
        return { ...obj, answerResultSelected: index === 0 ? !(get(obj, 'answerResultSelected', false)) : false }
      })
      setResponseArray(mapOption)
      // onChange(mapOption[0])
      // onChange({value: get(first(responseArray), 'input', ''), label: get(first(responseArray), 'input', '')})
      // onChange({value: true, label: get(first(responseArray), 'input', '')})
    }

    const onOptionTwo = () => {
      const mapOption = map(responseArray, function (obj, index) {
        return { ...obj, answerResultSelected: index === 1 ? !(get(obj, 'answerResultSelected', false)) : false }
      })
      setResponseArray(mapOption)
      // onChange(mapOption[1])
      // onChange({value: get(last(responseArray), 'input', ''), label: get(last(responseArray), 'input', '')})
      // onChange({value: false, label: get(last(responseArray), 'input', '')})
      // onChange(mapOption)
    }

    useEffect(() => {
      onChange(responseArray)
      props.onClearValue('photo')
      props.onClearValue('note')
    }, [responseArray])

    return (
      <Container {...props}>
        <YesOption
          card={props.card}
          // active={get(first(mapOption), 'defaultSelection', '') === get(first(mapOption), 'input', '')}
          active={get(first(responseArray), 'answerResultSelected', '')}
          onPress={() => onOptionOne()}
        >
          {get(first(responseArray), 'input', '')}
        </YesOption>
        <NoOption
          card={props.card}
          // active={get(last(mapOption), 'defaultSelection', '') === get(last(mapOption), 'input', '')}
          // active={value === options[1].value}
          active={get(last(responseArray), 'answerResultSelected', '')}
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