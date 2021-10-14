import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal
} from 'react-native';
import I18n from 'react-native-i18n';
import { Field, FieldArray, reduxForm } from 'redux-form';
import Icon from 'react-native-vector-icons/Entypo';

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
  flx1,
  flexGrow1,
  grey
} from 'rc-mobile-base/lib/styles';

import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';
import ModalFieldArray from 'rc-mobile-base/lib/components/ModalFieldArray';
import SelectLocation from 'rc-mobile-base/lib/components/SelectLocation';
import ExitButton from 'rc-mobile-base/lib/components/SelectLocation/ExitButton';
import SearchFilter from 'rc-mobile-base/lib/components/SearchFilter';

import SectionHeader from '../SectionHeader';

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
    style={[white.bg, flxRow, aic,  padding.x5, {flexWrap: 'wrap'}]}
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

export const SelectLocationModal = ({ label, options, onPress, ...props }) => (
  <ModalFieldArray
    {...props}
    renderValue={(toggle, fields) => <Opener fields={fields} toggle={toggle} />}
    renderModal={(toggle, { fields }) => (
      <View style={[flx1, grey.bg,]}>
        <ModalHeader value={label} onPress={toggle} />
        <SearchForm
          onSubmit={null}
          placeholder={I18n.t('base.ubiquitous.search-locations')}
          onPress={() => console.log('RRRRRRR')}
        />
        <SelectLocation
          options={options}
          toggle={toggle}
          onPress={fields.push}
        />
        <ExitButton onPress={toggle} />
      </View>
    )}
  />
)

const Form = ({ handleSubmit, locations }) => (
  <View>
    <SectionHeader value={I18n.t('base.ubiquitous.locations')} />
    <FieldArray
      onPress={handleSubmit(() => {})}
      name="locations"
      options={locations}
      label={I18n.t('base.ubiquitous.select-locations')}
      component={SelectLocationModal}
    />
  </View>
)

export default reduxForm({
  form: 'taskLocations'
})(Form)
