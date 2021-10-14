import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { get } from 'lodash';

import {
  TFContainer,
  TFValue,
  TFTrue,
  TFFalse,
  TFLabel,
  MultiTFContainer
} from './styles';

const TF = ({ label, value, onChange, card, ...props }) => (
  <TFContainer>
    <TFValue>
      <TFTrue active={value === true} onPress={() => onChange(true)}>
        <FontAwesome name="check" size={22} color={'#FFF'} />
      </TFTrue>
      <TFFalse active={value === false} onPress={() => onChange(false)}>
        <FontAwesome name="times" size={22} color={'#FFF'} />
      </TFFalse>
    </TFValue>
    <TFLabel card={card}>
      {label}
    </TFLabel>
  </TFContainer>
)

const DELIMITER = '||'

const buildMultiLabel = (value) => {
  return Object.keys(value).reduce((acc, key) => {
    return [...acc, `${key}: ${value[key]}`]
  }, []).join(DELIMITER)
}

export default MultiTrueFalse = ({ options, value, onChange, ...props }) => options && options.length > 0 ? (
  <MultiTFContainer {...props}>
    {
      options.map((option, index) => {
        return (
          <TF
            key={index}
            label={option.label}
            value={get(value, option.label)}
            card={props.card}
            onChange={(answer) => {
              const result = { ...value, [option.label]: answer }
              onChange({ value: result, label: buildMultiLabel(result) })
            }}
          />
        )
      })
    }
  </MultiTFContainer>
) : null