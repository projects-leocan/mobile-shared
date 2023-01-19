import React from 'react';
import { compact, last } from 'lodash';

import {
  Container,
  InputArea
} from './styles';

export default LongAnswer = ({ AnswerResultText, singleAnswerDefault, onChange, responseFormArray, ...props }) => (
  <Container {...props}>
    <InputArea
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