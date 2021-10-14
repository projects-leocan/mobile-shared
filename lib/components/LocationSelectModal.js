import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Field, reduxForm  } from 'redux-form';
import Icon from 'react-native-vector-icons/Entypo';
import { get } from 'lodash/object';

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
} from '../styles';

import ModalHeader from './ModalHeader';
import ModalFieldArray from './ModalFieldArray';
import SelectLocation from './SelectLocation';
import ExitButton from './SelectLocation/ExitButton';
import SearchFilter from './SearchFilter';
import SearchSubheader from './SearchSubheader';

const SearchForm = reduxForm({
  form: 'roomSearch',
})(SearchFilter)

export const Location = ({ onPress, value }) => (
  <TouchableOpacity
    style={[flxRow, blue300.bg, aic, jcsb, margin.a5, padding.x5, {height: 45, minWidth: 35, borderRadius: 20}]}
    onPress={onPress}
  >
    <Text style={[white.text, margin.x5]}>
      {value.name}
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

export const Opener = ({ locations, onRemove, toggle }) => (
  <View
    style={[white.bg, flxRow, aic, padding.x5, {flexWrap: 'wrap'}]}
  >
    {
      locations.map((location, index) => (
        <Location
          value={location}
          onPress={() => onRemove(location)}
          key={index}
          />
      ))
    }
    <LocationAdd onPress={toggle} />
  </View>
)

export const LocationSearch = ({ searchQuery, updateQuery, placeholder }) => (
  <View style={[flxRow, white.bg, padding.a10, aic, jcc, { height: 60 }]}>
    <TextInput
      onChangeText={updateQuery}
      value={searchQuery}
      placeholder={placeholder}
      style={[grey.bg, greyDk.text, text.center, text.fw600, flexGrow1, {borderRadius: 20, height: 40}]}
      multiline={false}
      />
  </View>
)

export class SelectLocationModal extends Component {

  state = {
    searchQuery: ''
  }

  _handleUpdateQuery = (t) => this.setState({ searchQuery: t })

  render() {
    const { label, options, selected, selectLocation } = this.props;
    const { searchQuery } = this.state;
    const cleanQuery = searchQuery && searchQuery.toLowerCase().trim();
    const filtered = cleanQuery ?
      options.filter(option => get(option, 'name', '').toLowerCase().includes(cleanQuery)) :
      options;

    return (
      <ModalFieldArray
        {...this.props}
        renderValue={(toggle) => <Opener locations={selected} onRemove={selectLocation} toggle={toggle} />}
        renderModal={(toggle, { fields }) => (
          <View style={[flexGrow1, grey.bg]}>
            <ModalHeader value={label} />
            <SearchSubheader
              updateQuery={this._handleUpdateQuery}
              searchQuery={this.state.searchQuery}
              style={{
                container: { ...white.bg, ...padding.y10 },
                input: { ...jcc, ...aic }
              }}
              >
             Search location 
            </SearchSubheader>

            <SelectLocation
              options={filtered}
              toggle={toggle}
              onPress={(r) => { selectLocation(r); toggle() }}
            />
            <ExitButton onPress={toggle} />
          </View>
        )}
      />
    )
  }
}

export default SelectLocationModal
