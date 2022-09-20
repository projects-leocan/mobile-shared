import { get } from 'lodash';
import React from 'react';

import {
  MultipleContainer,
  MultipleOption,
  Option,
} from './styles';

// import  from './Option';

export default Multiple = ({ responseFormArray: options, value = "", onChange, ...props }) => options && options.length > 0 ? (
  <MultipleContainer {...props}>
    {
      options.map((option, index) => (
        <MultipleOption
          key={index}
          active={get(option, 'input', '') === get(option, 'defaultSelection', '')}
          // active={false}
          onPress={() => onChange({ value: option, label: option })}
          card={props.card}
        >
          {get(option, 'input', '')}
        </MultipleOption>
      ))
    }
  </MultipleContainer>
) : null