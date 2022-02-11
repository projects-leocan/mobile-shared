import React, { Component } from 'react';
import { StyleSheet, View, } from 'react-native';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { reduxForm } from 'redux-form';
import FormField from 'rc-mobile-base/lib/components/FormField';

import {
  Search
} from './styles';

import {
  white,
  grey,
  greyDk,
  text,
  splashBg,
  padding,
  flxRow,
  aic
} from 'rc-mobile-base/lib/styles';
const buttonBorderColor = '#cfd4de';

const SearchAssignments = () => (
  <View style={[flxRow, white.bg, padding.a10, aic, { height: 80, width: '100%' }]}>
    <View style={styles.searchContainer}>
      <View style={styles.searchIconContainer}>
        <Feather
          name='search'
          size={30}
          color={splashBg.color}
        />
      </View>

      <View style={styles.searchFieldContainer}>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          style={[white.bg, greyDk.text, text.fw600, { height: '100%', width: '100%', paddingLeft: 8 }]}
          name="search"
          placeholder={I18n.t('maintenance.createtask.assignment.search-assignments')}
        />
      </View>

    </View>
  </View>
)

const SearchForm = reduxForm({
  form: 'assignmentSearch',
})(SearchAssignments)

export default SearchForm;

const styles = StyleSheet.create({
  searchContainer: {
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: buttonBorderColor
  },
  searchIconContainer: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchFieldContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f'
  }
})