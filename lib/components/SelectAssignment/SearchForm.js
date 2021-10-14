import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/FontAwesome';

import { reduxForm  } from 'redux-form';
import FormField from 'rc-mobile-base/lib/components/FormField';

import {
  Search
} from './styles';

import {
  white,
  grey,
  greyDk,
  text,
} from 'rc-mobile-base/lib/styles';

const SearchAssignments = () => (
  <Search>
    <FormField
      autoCapitalize="none"
      autoCorrect={false}
      style={[white.bg, greyDk.text, text.center, text.fw600, {borderRadius: 20, height: 40}]}
      name="search"
      placeholder={I18n.t('maintenance.createtask.assignment.search-assignments')}
    />
  </Search>
)

const SearchForm = reduxForm({
  form: 'assignmentSearch',
})(SearchAssignments)

export default SearchForm;
