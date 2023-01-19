import { compact, last } from 'lodash';
import React from 'react';

import {
  Container,
  Input
} from './styles';

export default Response = ({ AnswerResultText, onChange, singleAnswerDefault, responseFormArray, ...props }) => (
  <Container {...props}>
    <Input
      placeholder="Start typing to leave response..."
      value={AnswerResultText || singleAnswerDefault}
      // onChangeText={(AnswerResultText) => onChange({ AnswerResultText, label: AnswerResultText })}
      onChangeText={(AnswerResultText) => {
        let validateResponseFromArray = Object(last(compact(responseFormArray)))
        onChange([validateResponseFromArray.merge({ AnswerResultText: AnswerResultText })])
      }}
    />
  </Container>
)