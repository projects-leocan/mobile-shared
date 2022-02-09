import React from 'react';
import {
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import { Field, reduxForm } from 'redux-form';

import SearchTextField from '../SearchTextField';
import styles from './styles';
import { mergeStyles } from '../../utils/styles';

export const SearchFormField = ({ style, ...props }) => (
  <View>
    <Field
      style={mergeStyles(styles.input, style)}
      component={SearchTextField}
      {...props}
    />
  </View>
)

export default SearchFormField;
