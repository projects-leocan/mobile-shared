import React from 'react';

import {
  Container,
  InputArea
} from './styles';

export default LongAnswer = ({ value, onChange, ...props }) => (
  <Container {...props}>
    <InputArea
      placeholder="Start typing to leave response..."
      value={value}
      onChangeText={(value) => onChange({ value, label: value })}
    />
  </Container>
)