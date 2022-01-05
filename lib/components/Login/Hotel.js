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

import TextField, { TextFieldWithRef } from '../TextField';
import Button from './Button';
import logo from '../../images/splash_logo.png';
import {
  opacityWhite,
  transparent,
  margin,
  splashBgColor,
  black
} from '../../styles';
import DisplayError from './DisplayError';

import styles from './styles';

export class HotelLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hotelName: null
    }
  }

  render() {
    const { hotelName } = this.state;
    const { submitHotelLogin, handleSubmit, appName, error, hotel } = this.props;
    return (
      <ScrollView testID="hotelLogin" style={styles.loginRootcontainer} scrollEnabled={false}>
        <View style={styles.hotelContainer}>
          <View style={styles.headerContainer}>
            <Image source={require('../../images/splash_logo.png')} style={styles.logoImg} />
          </View>

          <View style={styles.absoluteTriangle}>
            <Image source={require('../../images/trangle_icon.png')} style={styles.trangleImage} />
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.screenTitle}>Login</Text>
            <Text>Hopr Attendant</Text>

            <KeyboardAvoidingView behavior="position">

              <View style={styles.loginActionContainer}>
                <Text style={styles.fieldText}>Hotel Name</Text>
                <View style={styles.loginInputContainer}>
                  <Field
                    testID="hotelName"
                    autoCapitalize="none"
                    returnKeyType="send"
                    autoCorrect={false}
                    style={styles.loginInputField}
                    underlineColorAndroid={transparent.color}
                    placeholderTextColor={black.bg}
                    placeholder='Hotel Name'
                    name="hotel"
                    component={TextField}
                    onSubmitEditing={handleSubmit(submitHotelLogin)}
                  />
                </View>

                <View style={styles.loginButtonContainer} >
                  <Button label={'Next'} isDisable={false} onPress={handleSubmit(submitHotelLogin)} />
                </View>

              </View>
            </KeyboardAvoidingView>

          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={{ padding: 8 }}>
              <Text>Forget hotel name?</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    )
  }
}

export default reduxForm({
  form: 'hotelLogin'
})(HotelLogin)
