import React from 'react';

import {
  Container,
  Input
} from './styles';

export default Response = ({ value, onChange, ...props }) => (
  <Container {...props}>
    <Input
      placeholder="Start typing to leave response..."
      value={value}
      onChangeText={(value) => onChange({ value, label: value })}
    />
  </Container>
)