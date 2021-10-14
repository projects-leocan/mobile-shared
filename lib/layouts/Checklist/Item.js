import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  ItemContainer,
  ItemLabel
} from './styles';

import {
  slate,
  green
} from 'rc-mobile-base/lib/styles';

export default Item = ({ label, uuid, minHour, finishTs, index, handler = () => null }) => (
  <ItemContainer onPress={() => handler(index)}>
    { finishTs ?
      <Icon name="check-circle-o" size={36} color={green.color} />
      :
      <Icon name="circle-o" size={36} color={slate.color} />
    }
    <ItemLabel>{ label }</ItemLabel>
  </ItemContainer>
)