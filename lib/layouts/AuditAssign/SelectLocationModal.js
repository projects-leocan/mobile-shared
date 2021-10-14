import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal
} from 'react-native';
import I18n from 'react-native-i18n';
import { Field, reduxForm } from 'redux-form';
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
  flexGrow1,
  grey
} from 'rc-mobile-base/lib/styles';

import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';
import ModalFieldArray from 'rc-mobile-base/lib/components/ModalFieldArray';
import ModalField from 'rc-mobile-base/lib/components/ModalField';
import SelectLocation from 'rc-mobile-base/lib/components/SelectLocation';
import ExitButton from 'rc-mobile-base/lib/components/SelectLocation/ExitButton';
import SearchFilter from 'rc-mobile-base/lib/components/SearchFilter';
import SectionHeader from 'rc-mobile-base/lib/components/SectionHeader';

const SearchForm = reduxForm({
  form: 'roomSearch',
})(SearchFilter)

export const Opener = ({ location, onPress }) => (
  <TouchableOpacity
    style={[white.bg, flxRow, aic, jcsb, padding.x15, { flexWrap: 'wrap', height: 50 }]}
    onPress={onPress}
  >
    { location ?
      <Text>{ location.name }</Text>
      :
      <Text>{ I18n.t('base.ubiquitous.select-location') }</Text>
    }
    
    <Icon
      name="chevron-down"
      size={14}
      color={slate.color}
      />
  </TouchableOpacity>
)

export const SelectLocationModal = ({ label, options, ...props }) => (
  <ModalField
    {...props}
    renderValue={(onPress, location) => <Opener location={location} onPress={onPress} />}
    renderModal={(onPress) => (
      <View style={[flexGrow1, grey.bg]}>
        <ModalHeader value={label} onPress={onPress} />
        <SearchForm
          placeholder={I18n.t('base.ubiquitous.search-locations')}
          onPress={() => console.log('RRRRRRR')}
        />
        <SelectLocation
          options={options}
          onPress={onPress}
        />
        {/* <ExitButton onPress={onPress} /> */}
      </View>
    )}
  />
)

const Form = ({ handleSubmit, locations }) => (
  <View>
    <SectionHeader value={I18n.t('base.ubiquitous.select-location')} />
    <Field
      options={locations}
      label={I18n.t('base.ubiquitous.select-location')}
      name="location"
      component={SelectLocationModal}
    />
  </View>
)

// const Form = ({ handleSubmit, locations }) => (
//   <View>
//     <SectionHeader value={I18n.t('base.ubiquitous.locations')} />
//     <FieldArray
//       onPress={handleSubmit(() => {})}
//       name="locations"
//       options={locations}
//       label={I18n.t('base.ubiquitous.select-locations')}
//       component={SelectLocationModal}
//     />
//   </View>
// )

export default reduxForm({
  form: 'auditLocation'
})(Form)
