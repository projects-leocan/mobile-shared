import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Field, reduxForm  } from 'redux-form';
import Icon from 'react-native-vector-icons/Entypo';
import I18n from 'react-native-i18n';

import {
  flxRow,
  flxCol,
  margin,
  padding,
  text,
  aic,
  jcc,
  white,
  slate,
  greyDk,
  grey400,
  red,
  blue500,
  blue300,
  green,
  jcsb,
  flex1,
  flexGrow1,
  grey
} from '../../styles';

import ModalHeader from '../../components/ModalHeader';
import ModalFieldArray from '../../components/ModalFieldArray';
import SelectLocation from '../../components/SelectLocation';
import ExitButton from '../../components/SelectLocation/ExitButton';
import SearchFilter from '../../components/SearchFilter';

const SearchForm = reduxForm({
  form: 'roomSearch',
})(SearchFilter)

export const Location = ({ value, onPress, input }) => (
  <TouchableOpacity
    style={[flxRow, blue300.bg, aic, jcsb, margin.a5, padding.x5, {height: 45, minWidth: 35, borderRadius: 20}]}
    onPress={onPress}
  >
    <Text style={[white.text, margin.x5]}>
      {input.value.name}
    </Text>
    <Icon
      style={[margin.x5]}
      name="cross"
      size={18}
      color={white.color}
    />
  </TouchableOpacity>
)

export const LocationAdd = ({ onPress }) => (
  <TouchableOpacity
    style={[green.bg, aic, jcc, margin.a5, {height: 45, width: 45, borderRadius: 27}]}
    onPress={onPress}
  >
    <Icon
      name="plus"
      size={20}
      color={white.color}
    />
  </TouchableOpacity>
)

export const Opener = ({ fields, toggle }) => (
  <View
    style={[white.bg, flxRow, aic, grey400.bc, padding.x5, {flexWrap: 'wrap'}]}
  >
    {
      fields.map((field, index) => (
        <Field
          onPress={() => fields.remove(index)}
          key={index}
          name={field}
          component={Location}
        />
      ))
    }
    <LocationAdd onPress={toggle} />
  </View>
)

export const SelectLocationModal = ({ label, options, ...props }) => (
  <ModalFieldArray
    {...props}
    renderValue={(toggle, fields) => <Opener fields={fields} toggle={toggle} />}
    renderModal={(toggle, { fields }) => (
      <View style={[flexGrow1, grey.bg]}>
        <ModalHeader value={label} onPress={toggle} />
        <SearchForm
          placeholder={I18n.t('base.ubiquitous.search-locations')}
          onPress={() => console.log('RRRRRRR')}
        />
        <View style={[flex1]}>
          <SelectLocation
            options={options}
            toggle={toggle}
            onPress={fields.push}
          />
        </View>
        <ExitButton onPress={toggle} />
      </View>
    )}
  />
)

export default SelectLocationModal
