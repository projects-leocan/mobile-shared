import { first, last, get } from 'lodash';
import React from 'react';

import {
  Container,
  YesOption,
  NoOption
} from './styles';

export default TrueFalse = ({ responseFormArray: options, value, onChange, ...props }) => options && options.length > 0 ? (
  <Container {...props}>
    <YesOption
      card={props.card}
      active={get(first(options), 'defaultSelection', '') === get(first(options), 'input', '')}
      onPress={() => onChange(options[0])}
    >
      {get(first(options), 'input', '')}
    </YesOption>
    <NoOption
      card={props.card}
      active={get(last(options), 'defaultSelection', '') === get(last(options), 'input', '')}
      // active={value === options[1].value}
      onPress={() => onChange(options[1])}
    >
      {get(last(options), 'input', '')}
    </NoOption>
  </Container>
) : null