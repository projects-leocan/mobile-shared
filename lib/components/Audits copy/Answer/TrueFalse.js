import React from 'react';

import {
  Container,
  YesOption,
  NoOption
} from './styles';

export default TrueFalse = ({ options, value, onChange, ...props }) => options && options.length > 0 ? (
  <Container {...props}>
    <YesOption
      card={props.card}
      active={value === options[0].value}
      onPress={() => onChange(options[0])}
    >
      {options[0].label}
    </YesOption>
    <NoOption
      card={props.card}
      active={value === options[1].value}
      onPress={() => onChange(options[1])}
    >
      {options[1].label}
    </NoOption>
  </Container>
) : null