import React from 'react';
import {
  StyleSheet,
  TextInput
} from 'react-native';
import { Field, reduxForm } from 'redux-form';

import TextField from '../TextField';
import styles from './styles';
import { mergeStyles } from '../../utils/styles';

export const FormField = ({style, ...props}) => (
  <Field
    style={mergeStyles(styles.input, style)}
    component={TextField}
    {...props}
  />
)

export default FormField;
