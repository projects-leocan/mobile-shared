import React, { Component, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform
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
  lightBlueBorder,
  isTab
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
import { get, findIndex, forEach, filter } from 'lodash';

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
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionLabel}>{I18n.t("base.components.assetactiondescription.location")}</Text>
    <TouchableOpacity style={styles.sectionButton} onPress={toggle}>
      <View style={styles.selectionPlaceholderContainer}>
        {fields.length > 0
          ?
          <View style={[flxRow, { flexWrap: 'wrap' }]}>
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
          :
          <Text style={styles.selectionPlaceholder}>{I18n.t("base.ubiquitous.select-location")}</Text>
        }
      </View>
      <View style={styles.sectionButtonRightContainer}>
        <MaterialIcons name='chevron-right' size={26} color={splashBg.color} />
      </View>
    </TouchableOpacity>
  </View>

)

const deselectLocation = (fields, data) => {
  const selectedID = get(data, 'id', null);
  const removeIndex = findIndex(fields.getAll(), function (o) { return o.id == selectedID; })

  fields.remove(removeIndex);
  return;
}

export const SelectLocationModal = ({ label, options, onPress, ...props }) => {
  const [newSelected, setNewSelected] = useState([0]);

  const setSelectedData = (fields, data) => {
    setNewSelected([...newSelected, data])
    fields.push(data)
  }

  const onCloseModal = (fields, toggle) => {
    forEach(newSelected, function (obj) {
      deselectLocation(fields, obj);
    })
    toggle()
  }

  const onConfirmLocation = (toggle) => {
    setNewSelected([])
    toggle()
  }

  const onResetLocation = (fields) => {
    setNewSelected([])
    fields.removeAll()
  }

  return (
    <ModalFieldArray
      {...props}
      renderValue={(toggle, fields) => <Opener fields={fields} toggle={toggle} />}
      isTransperent = {"true"}
      renderModal={(toggle, { fields }) => (
        <>
          {Platform.OS === 'ios' ? <SafeAreaHeader /> : null}
          <SafeAreaView style={[styles.rootContainer,]}>
            <ModalHeader value={label} isExtraButton={true} onExtraAction={() => onResetLocation(fields)} onLeftAction={() => onCloseModal(fields, toggle)} onRightAction={() => onConfirmLocation(toggle)} />
            <View style={[flx1, white.bg,]}>
              <View style={[white.bg]}>
                <SearchForm
                  onSubmit={null}
                  fields={fields}
                  placeholder={I18n.t('base.ubiquitous.search-locations')}
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
                onPress={(data, isSelected) => isSelected ? deselectLocation(fields, data) : setSelectedData(fields, data)}
              />
              {/* <ExitButton onPress={toggle} /> */}
            </View>
          </SafeAreaView>
        </>
      )}
    />
  )
}

class Form extends React.Component {
  componentDidMount() {
    const { currentRoom } = this.props;
    if (currentRoom) {
      this.props.initialize({ locations: [currentRoom] });
    }
  }

  render() {
    const { handleSubmit, locations, multiple, currentRoom } = this.props;
    const validateLocations = filter(locations, ['isTemporaryRoom', false]);

    return (
      <FieldArray
        onPress={handleSubmit(() => { })}
        name="locations"
        options={validateLocations}
        label={I18n.t('base.ubiquitous.locations')}
        component={SelectLocationModal}
      />
    )
  }
}

export default reduxForm({
  form: 'taskLocations'
})(Form)
