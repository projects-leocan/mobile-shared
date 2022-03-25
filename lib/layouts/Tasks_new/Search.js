import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { reduxForm } from 'redux-form';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  flxRow,
  margin,
  padding,
  aic,
  text,
  white,
  grey,
  greyDk,
} from 'rc-mobile-base/lib/styles';
import FormField from 'rc-mobile-base/lib/components/FormField';

export const SearchFormContent = () => (
  <FormField
    style={[grey.bg, greyDk.text, text.center, text.fw600, margin.x10, margin.y5, {borderRadius: 20, height: 40}]}
    name="search"
    placeholder="Search tasks"
  />
)

export const SearchForm = reduxForm({
  form: 'tasksLayoutSearch',
})(SearchFormContent)

export default SearchForm
