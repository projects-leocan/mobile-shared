import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Field, reduxForm } from 'redux-form';

import TextField from '../TextField';
import logo from './splash-sm.png';
import {
  opacityWhite,
  transparent,
  margin
} from '../../styles';
import DisplayError from './DisplayError';

import styles from './styles';

export const HotelLogin = ({ submitHotelLogin, handleSubmit, appName, error }) => (
  <ScrollView testID="hotelLogin" style={styles.container} scrollEnabled={false}>
    <View style={styles.hotelContainer}>
      <KeyboardAvoidingView behavior="position">
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logoImage}/>
        </View>
        <View style={styles.hotelInfoContainer}>
          <Text style={[styles.text, styles.header]}>
            RoomChecking {appName}
          </Text>
          <Text style={[styles.text, styles.subheader]}>
            Please enter in your hotel
          </Text>
        </View>
        {error && <DisplayError error={error} />}
        <View style={[styles.inputs, margin.b15]}>
          <View style={styles.inputContainer}>
            <Field
              testID="hotelName"
              autoCapitalize="none"
              returnKeyType="send"
              autoCorrect={false}
              style={styles.inputField}
              underlineColorAndroid={transparent.color}
              placeholderTextColor={opacityWhite.p60.color}
              placeholder='Hotel Name'
              name="hotel"
              component={TextField}
              onSubmitEditing={handleSubmit(submitHotelLogin)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.hotelBtnContainer}>
        <TouchableOpacity testID="submitHotelLogin" style={styles.continueBtn} onPress={handleSubmit(submitHotelLogin)}>
          <Icon name="paper-plane" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
)

export default reduxForm({
  form: 'hotelLogin'
})(HotelLogin)
