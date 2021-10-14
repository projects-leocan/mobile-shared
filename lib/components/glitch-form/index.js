import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import { reduxForm, Field } from 'redux-form';
import I18n from 'react-native-i18n';

import Section from './section';
import TextField from './text-field';
import GlitchCategorySelector from './glitch-category-selector';
import AutoExpandingTextField from './auto-expanding-text-field';
import * as Colors from 'rc-mobile-base/lib/styles';

class GlitchForm extends Component {
  render() {
    const { handleSubmit } = this.props;

    return (
      <View>
        <Section title="GUEST INFORMATION">
          <View style={styles.row}>
            <Text style={styles.label}>{ I18n.t('base.glitch-form.index.room') }</Text>
            <Field
              name="room_name"
              placeholder={I18n.t('base.glitch-form.index.enter-room-number')}
              placeholderTextColor={Colors.greyLt.color}
              component={TextField}
              maxLength={10}
              style={styles.rowInput}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{ I18n.t('base.glitch-form.index.name') }</Text>
            <Field
              name="guest_info.name"
              placeholder={I18n.t('base.glitch-form.index.enter-guest-name')}
              placeholderTextColor={Colors.greyLt.color}
              component={TextField}
              style={styles.rowInput}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{ I18n.t('base.glitch-form.index.vip') }</Text>
            <Text style={styles.input}>Premiere Club</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{ I18n.t('base.glitch-form.index.email') }</Text>
            <Field
              name="guest_info.email"
              placeholder={I18n.t('base.glitch-form.index.enter-guest-email')}
              placeholderTextColor={Colors.greyLt.color}
              component={TextField}
              style={styles.rowInput}
            />
          </View>
        </Section>
        <Section title={I18n.t('base.glitch-form.index.select-glitch-category')}>
          <Field
            name="category"
            placeholder='Select a Glitch Category...'
            placeholderTextColor={Colors.greyLt.color}
            component={GlitchCategorySelector}
          />
        </Section>
        <Section title={I18n.t('base.glitch-form.index.glitch-information')}>
          <Text style={styles.inputHeader}>{ I18n.t('base.glitch-form.index.incident-description') }</Text>
          <View style={styles.textAreaContainer}>
            <Field
              name="description"
              placeholder='Insert Description...'
              placeholderTextColor={Colors.greyLt.color}
              component={AutoExpandingTextField}
              minHeight={50}
              style={styles.textArea}
            />
          </View>

          <Text style={styles.inputHeader}>ACTIONS TO RESOLVE</Text>
          <View style={styles.textAreaContainer}>
            <Field
              name="action"
              placeholder='Insert Description...'
              placeholderTextColor={Colors.greyLt.color}
              component={AutoExpandingTextField}
              minHeight={50}
              style={styles.textArea}
            />
          </View>

          <Text style={styles.inputHeader}>FOLLOW UP WITH GUEST</Text>
          <View style={styles.textAreaContainer}>
            <Field
              name="followup"
              placeholder='Insert Follow Up Instructions...'
              placeholderTextColor={Colors.greyLt.color}
              component={AutoExpandingTextField}
              minHeight={50}
              style={styles.textArea}
            />
          </View>

          <Text style={styles.inputHeader}>COMPENSATION COST</Text>
          <View style={styles.compensationCostContainer}>
            <Field
              name="cost"
              placeholder="100"
              placeholderTextColor={Colors.greyLt.color}
              component={TextField}
              maxLength={5}
              style={styles.compensationCostInput}
            />
          <Text style={styles.currency}>USD</Text>
          </View>
        </Section>
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>SUBMIT NEW EXPERIENCE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    width: 80,
    fontWeight: 'bold',
  },
  rowInput: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: Colors.greyLt.color,
    borderRadius: 4,
    paddingVertical: 0,
    fontSize: 16,
    paddingLeft: 10,
    height: 45,
  },
  inputHeader: {
    marginBottom: 5,
    color: 'black'
  },
  textAreaContainer: {
    borderWidth: 1,
    padding: 8,
    borderColor: Colors.greyLt.color,
    borderRadius: 4,
    marginBottom: 30,
  },
  textArea: {
    fontSize: 16,
  },
  compensationCostContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  compensationCostInput: {
    fontSize: 16,
    height: 40,
    paddingRight: 10,
    textAlign: 'right',
    borderWidth: 1,
    width: 100,
    marginRight: 7,
    borderColor: Colors.greyLt.color,
    borderRadius: 4,
    paddingVertical: 0,
  },
  currency: {
  },
  submitButtonContainer: {
    padding: 15,
  },
  submitButton: {
    backgroundColor: Colors.green.color,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.white.color,
    fontWeight: 'bold',
    fontSize: 18
  }
});

GlitchForm = reduxForm()(GlitchForm);

export default GlitchForm;
