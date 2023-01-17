import React from 'react';

import {
  Container,
  InputArea
} from './styles';

export default LongAnswer = ({ value, singleAnswerDefault, onChange, ...props }) => (
  <Container {...props}>
    <InputArea
      placeholder="Start typing to leave response..."
      value={value || singleAnswerDefault}
      onChangeText={(value) => onChange({ value, label: value })}
    />
  </Container>
)