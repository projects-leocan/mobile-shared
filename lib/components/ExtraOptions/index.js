import React from 'react';
import {
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'react-native-i18n'

import {
  Container,
  OptionText,
  OptionOverlay,
  HeaderText,
  SimpleContainer,
  OptionSimpleText
} from './styles';

import {
  slate,
  blueLt
} from 'rc-mobile-base/lib/styles';

export const ExtraOptionItem = ({ label, index, isCompleted = false, handler }) => (
  <Container onPress={() => handler(label, !isCompleted)} index={index}>
    { isCompleted ?
      <Icon name="check-circle" size={36} color={blueLt.color} style={{ opacity: .8 }} />
      :
      <Icon name="circle-o" size={36} color={slate.color} style={{ opacity: .8 }} />
    }
    <OptionText>{ label }</OptionText>

    { isCompleted &&
      <OptionOverlay />
    }
  </Container>
)

export const ExtraOptionSimple = ({ label, index, isCompleted = false }) => (
  <SimpleContainer index={index}>
    <OptionSimpleText>{ label }</OptionSimpleText>
    
    { isCompleted &&
      <OptionOverlay />
    }
  </SimpleContainer>
)

export const ExtraOptions = ({ extras, handler, isSectioned = false, isHeader = false, isDisableMarking = false }) => (
  <FlatList
    data={extras}
    renderItem={({ item, index }) => isDisableMarking ? <ExtraOptionSimple { ...item } index={index} /> : <ExtraOptionItem { ...item }  handler={handler} />}
    keyExtractor={(item, index) => index}
    ListHeaderComponent={() => isHeader ? <HeaderText>{ I18n.t('base.extra-options.room-extra-options').toUpperCase() }</HeaderText> : false}
    />
)

export default ExtraOptions