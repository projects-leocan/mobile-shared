import React from 'react';

import {
  ItemTypeBg,
  ItemTypeText
} from './styles';

export default ItemType = ({ label, isFound = true }) => (
  <ItemTypeBg isFound={isFound}>
    <ItemTypeText>
      { label.toUpperCase() }
    </ItemTypeText>
  </ItemTypeBg>
)