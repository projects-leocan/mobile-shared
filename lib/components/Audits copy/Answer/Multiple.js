import React from 'react';

import {
  MultipleContainer,
  MultipleOption,
  Option,
} from './styles';

// import  from './Option';

export default Multiple = ({ options, value, onChange, ...props }) => options && options.length > 0 ? (
  <MultipleContainer {...props}>
    {
      options.map((option, index) => (
        <MultipleOption
          key={index}
          active={value === option}
          onPress={() => onChange({ value: option, label: option })}
          card={props.card}
        >
          {option}
        </MultipleOption>
      ))
    }
  </MultipleContainer>
) : null