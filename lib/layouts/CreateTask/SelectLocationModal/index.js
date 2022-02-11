import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView
} from 'react-native';
import I18n from 'react-native-i18n';
import { Field, FieldArray, reduxForm } from 'redux-form';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
  blue100,
  green,
  jcsb,
  flex1,
  flx1,
  flexGrow1,
  grey,
  splashBg,
  themeBorderColor,
  lightBlueBorder
} from 'rc-mobile-base/lib/styles';
import styles from './styles';

// import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';
import ModalFieldArray from 'rc-mobile-base/lib/components/ModalFieldArray';
import SelectLocation from 'rc-mobile-base/lib/components/SelectLocation';
import ExitButton from 'rc-mobile-base/lib/components/SelectLocation/ExitButton';
import SearchRoomFilter from 'rc-mobile-base/lib/components/SearchRoomFilter';

import SafeAreaHeader from 'rc-mobile-base/lib/components/SafeAreaHeader';
import ModalHeader from 'rc-mobile-base/lib/layouts/CreateTask/SelectLocationModal/ModalHeader';

import SectionHeader from '../SectionHeader';

const SearchForm = reduxForm({
  form: 'roomSearch',
})(SearchRoomFilter)

export const Location = ({ value, onPress, input }) => (
  <TouchableOpacity
    style={[flxRow, white.bg, aic, jcsb, margin.a5, padding.x5, { height: 35, minWidth: 35, borderRadius: 5, borderWidth: 1, borderColor: lightBlueBorder.color }]}
    onPress={onPress}
  >
    <Text style={[splashBg.text, margin.x5, { fontWeight: '600' }]}>
      {input.value.name}
    </Text>
    <Icon
      style={[margin.x5]}
      name="cross"
      size={18}
      color={splashBg.color}
    />
  </TouchableOpacity>
)

export const LocationAdd = ({ onPress }) => (
  <TouchableOpacity
    style={[blue100.bg, aic, jcc, margin.a5, { height: 45, width: 45, borderRadius: 27 }]}
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
  <View>
    {fields.length > 0
      ? <Text style={styles.sectionLabel}>Asset</Text>
      : null}

    <View
      style={[white.bg, flxRow, { flexWrap: 'wrap' }]}
    >
      <View style={[flex1, flxRow, { flexWrap: 'wrap' }]}>
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
      </View>

      {fields.length > 0
        ?
        <TouchableOpacity style={styles.smallAddRoomRoundContainer} activeOpacity={0.7} onPress={toggle}>
          <Ionicons name='add' size={wp('7%')} color={splashBg.color} />
        </TouchableOpacity>
        :
        <View style={styles.addRoomSection}>
          <TouchableOpacity style={styles.addRoomRoundContainer} activeOpacity={0.7} onPress={toggle}>
            <Ionicons name='add' size={wp('7%')} color={splashBg.color} />
          </TouchableOpacity>
          <Text style={styles.addRoomLabel}>Add Room</Text>
        </View>
      }

      {/* <LocationAdd onPress={toggle} /> */}
    </View>
  </View>

)

export const SelectLocationModal = ({ label, options, onPress, ...props }) => (
  <ModalFieldArray
    {...props}
    renderValue={(toggle, fields) => <Opener fields={fields} toggle={toggle} />}
    renderModal={(toggle, { fields }) => (
      <View style={[flx1, grey.bg,]}>
        <SafeAreaHeader />
        <ModalHeader value={label} onLeftAction={toggle} rightIconName="ios-reload-sharp" />
        <SafeAreaView style={[styles.rootContainer,]}>
          <View style={[white.bg]}>
            <SearchForm
              onSubmit={null}
              fields={fields}
              placeholder={I18n.t('base.ubiquitous.search-locations')}
              onPress={() => console.log('RRRRRRR')}
            />

            {fields.length > 0
              ?
              <View style={styles.selctedPreviewContainer}>
                {fields.map((field, index) => (
                  <Field
                    onPress={() => fields.remove(index)}
                    key={index}
                    name={field}
                    component={Location}
                  />
                ))}
              </View> : null}
          </View>

          <SelectLocation
            options={options}
            toggle={toggle}
            onPress={fields.push}
          />
          {/* <ExitButton onPress={toggle} /> */}
        </SafeAreaView>
      </View>
    )}
  />
)

const Form = ({ handleSubmit, locations }) => (
  <View>
    {/* <SectionHeader value={I18n.t('base.ubiquitous.locations')} /> */}
    <FieldArray
      onPress={handleSubmit(() => { })}
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
