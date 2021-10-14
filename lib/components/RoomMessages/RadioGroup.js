import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'react-native-i18n';

import {
  RadioRow,
  RadioOptionContainer,
  RadioLabel
} from './styles';

import {
  blue,
  greyDk
} from 'rc-mobile-base/lib/styles';

const RadioOption = ({ label, value, isTranslations, isSelected, onPress }) => (
  <RadioOptionContainer onPress={() => onPress(value)}>
    { isSelected ?
      <Icon name="dot-circle-o" size={20} color={blue.color} />
      :
      <Icon name="circle-o" size={20} color={greyDk.color} />
    }
    
    { isTranslations ?
      <RadioLabel style={[isSelected && blue.text]}>{ I18n.t(label) }</RadioLabel>
      :
      <RadioLabel style={[isSelected && blue.text]}>{ label }</RadioLabel>
    }
  </RadioOptionContainer>
)

export default RadioGroup = ({ options, value, isTranslations, onChange }) => (
  <RadioRow>
    { options.map(item => 
      <RadioOption key={item.label} isSelected={item.value === value} isTranslations={isTranslations} onPress={onChange} { ...item } />
    )}
  </RadioRow>
)