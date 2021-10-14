import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import ListView from 'rc-mobile-base/lib/components/ListView';

import {
  flxRow,
  flxCol,
  white,
  grey,
  margin,
  padding,
  flex1,
  jcc,
  aic,
  jcsb,
  greyDk,
  slate,
  asfe,
  text
} from '../../styles';

import H2 from '../H2';
import ModalToggler from '../ModalToggler';

import Opener from './Opener'
import Close from './Close'
import Item from './Item'

export const DropDownMenu = ({ options, onOptionSelected, selectedOption, titleProperty, valueProperty, style }) => (
  <ModalToggler
    modalProps={{
      transparent: true
    }}
    renderValue={(toggle) => (
      <Opener
        text={selectedOption[titleProperty]}
        onPress={toggle}
        style={style}
      />
    )}
    renderModal={(toggle) => (
      <View style={[flex1, style.modal]}>
        <View style={[padding.a10, flex1, flxCol, grey.bg, jcsb]}>
          <View style={[flex1]}>
            <ListView
              data={options}
              renderRow={(option) => (
                <Item
                  option={option}
                  property={titleProperty}
                  style={style}
                  onPress={() => {
                    onOptionSelected(option)
                    toggle()
                  }}
                />
              )}
            />
          </View>
          <Close onPress={toggle} />
        </View>
      </View>
    )}
  />
)

DropDownMenu.defaultProps = {
  style: {}
}

export default DropDownMenu
