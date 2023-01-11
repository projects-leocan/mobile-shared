import React from 'react';

import {
  Container,
  Input
} from './styles';

export default Response = ({ value, onChange, singleAnswerDefault, ...props }) => (
  <Container {...props}>
    <Input
      placeholder="Start typing to leave response..."
      value={value || singleAnswerDefault}
      onChangeText={(value) => onChange({ value, label: value })}
    />
  </Container>
)