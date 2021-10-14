import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n'
import { Field, FieldArray, reduxForm } from 'redux-form';
import { get } from 'lodash/object';

import {
  padding,
  margin,
  white,
  green,
  grey400
} from '../../styles';

import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';
import Button from 'rc-mobile-base/lib/components/Button';
import FormField from '../../components/FormField';

const QuickMessageForm = ({ notification, handleSubmit, onSubmit }) => {
  const user = get(notification, 'creator');

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ModalHeader value={`${user.first_name} ${user.last_name}`} />
      <View style={[white.bg, margin.x10, margin.y20, grey400.bc, {height: 95}]}>
        <FormField
          multiline
          numberOfLines={4}
          placeholder={I18n.t('base.ubiquitous.enter-a-message')}
          style={[padding.x15, {borderWidth: 2}]}
          name="message"
          />
      </View>
      <Button style={[{ borderRadius: 0}, margin.x10, green.bg]} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>{ I18n.t('base.notifications.quicknotificationform.send-message').toUpperCase() }</Text>
      </Button>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...margin.x10,
    ...margin.t20,
    ...padding.b20,
    ...white.bg
  },
  btnText: {
    ...white.text,
    fontSize: 15,
    fontWeight: 'bold'
  }
});

export const Form = reduxForm({
  form: 'quickNotification',
  enableReinitialize: true
})(QuickMessageForm)

export default Form;
