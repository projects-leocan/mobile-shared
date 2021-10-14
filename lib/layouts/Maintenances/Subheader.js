import React from 'react';

import {
  SubheaderContainer,
  SubheaderOptionContainer,
  SubheaderOptionText,
} from './styles';

const Option = ({ option, activeTab, handle }) => (
  <SubheaderOptionContainer isActive={activeTab === option} onPress={() => handle(option)}>
    <SubheaderOptionText isActive={activeTab === option}>{ option.toUpperCase() }</SubheaderOptionText>
  </SubheaderOptionContainer>
)

export default Subheader = ({ options = ['today', 'backlog'], activeTab, handle }) => (
  <SubheaderContainer>
    { options.map(option =>
      <Option
        key={option}
        option={option}
        activeTab={activeTab}
        handle={handle}
        />
    )}
  </SubheaderContainer>
)