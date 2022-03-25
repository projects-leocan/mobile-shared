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
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import TextField, { TextFieldWithRef } from '../TextField';
import Button from './Button';
import logo from '../../images/splash_logo.png';
import {
  opacityWhite,
  transparent,
  margin,
  splashBgColor,
  black,
  isTab
} from '../../styles';
import DisplayError from './DisplayError';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

import styles from './styles';

export class HotelLogin extends Component {
  constructor(props) {
    super(props);

  }

  focusHotelnameInput = () => this.hotelnameInput.focus()

  render() {
    const { submitHotelLogin, handleSubmit, appName, error, hotel, hotelGroupname } = this.props;

    return (
      <ScrollView testID="hotelLogin" style={styles.loginRootcontainer} scrollEnabled={false}>
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <View style={styles.hotelContainer}>
            <View style={styles.headerContainer}>
              <Image source={require('../../images/splash_logo.png')} style={styles.logoImg} />
            </View>

            <View style={styles.absoluteTriangle}>
              <Image source={require('../../images/trangle_icon.png')} style={styles.trangleImage} />
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.screenTitle}>Login</Text>
              <Text>Hopr {appName}</Text>


              {/* <View style={styles.loginActionContainer}>
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

                {error ? <Text style={styles.hotelError}>{error}</Text> : null}
                
                <View style={styles.loginButtonContainer} >
                  <Button label={'Next'} isDisable={hotel == null} onPress={handleSubmit(submitHotelLogin)} />
                </View>

              </View> */}

              <View style={styles.loginActionContainer}>
                <View style={styles.inputFieldCell}>
                  <Text style={styles.fieldText}>Hotel Group Name</Text>
                  <View style={styles.loginInputContainer}>
                    <Field
                      testID="hotelGroupname"
                      autoCapitalize="none"
                      returnKeyType="next"
                      autoCorrect={false}
                      style={styles.loginInputField}
                      underlineColorAndroid={transparent.color}
                      placeholderTextColor={black.bg}
                      placeholder='hotel group name'
                      name="hotelGroupname"
                      component={TextField}
                      onSubmitEditing={this.focusHotelnameInput}
                    />
                  </View>
                </View>

                <View style={styles.inputFieldCell}>
                  <Text style={styles.fieldText}>Hotel Name</Text>
                  <View style={styles.loginInputContainer}>
                    <Field
                      testID="hotelName"
                      refName={(ref) => this.hotelnameInput = ref}
                      autoCapitalize="none"
                      returnKeyType="send"
                      autoCorrect={false}
                      style={styles.loginInputField}
                      underlineColorAndroid={transparent.color}
                      placeholderTextColor={black.bg}
                      placeholder='Hotel Name'
                      name="hotel"
                      component={TextFieldWithRef}
                      onSubmitEditing={handleSubmit(submitHotelLogin)}
                    />
                  </View>
                </View>

                {error ? <Text style={styles.hotelError}>{error}</Text> : null}


                <View style={styles.loginButtonContainer} >
                  <Button label={'Next'} isDisable={hotel == null} onPress={handleSubmit(submitHotelLogin)} />
                </View>

              </View>

            </View>
            <View style={styles.bottomContainer}>
              {/* <TouchableOpacity style={{ padding: 8 }}>
              <Text>Forget hotel name?</Text>
            </TouchableOpacity> */}
            </View>

            <View style={styles.appVersionContainer}>
              <Text style={{ color: '#808080', textAlign: 'center' }}>version {DeviceInfo.getVersion()}</Text>
            </View>


          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    )
  }
}

const LoginForm = reduxForm({
  form: 'hotelLogin'
})(HotelLogin)

const selector = formValueSelector('hotelLogin')

const mapStateToProps = (state) => ({
  hotel: selector(state, 'hotel'),
  hotelGroupname: selector(state, 'hotelGroupname'),
});

export default connect(mapStateToProps)(LoginForm);