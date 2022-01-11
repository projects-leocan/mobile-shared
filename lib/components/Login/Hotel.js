import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Field, reduxForm, formValueSelector } from 'redux-form';

import TextField, { TextFieldWithRef } from '../TextField';
import Button from './Button';
import logo from '../../images/splash_logo.png';
import {
  opacityWhite,
  transparent,
  margin,
  splashBgColor,
  black,
  isTab,
  padding,
  jcc,
} from '../../styles';
import DisplayError from './DisplayError';
import { connect } from 'react-redux';

import styles from './styles';
import UserTypeSelect from './UserTypeSelect';

const userTypes = [
  { type: 'attendant', img: require('../../images/attendantUserPlaceholder.png') },
  { type: 'maintenance', img: require('../../images/maintenanceUserPlaceholder.png') },
  { type: 'runner', img: require('../../images/runnerUserPlaceholder.png') },
]

export class HotelLogin extends Component {
  constructor(props) {
    super(props);

  }

  focusHotel = () => {
    this.hotelNameRef.focus()
  }


  render() {
    const { submitHotelLogin, handleSubmit, appName, error, userType, hotel } = this.props;

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
            <Text>Hopr {userType}</Text>

            <View style={styles.userTypeContainer}>
              <FlatList
                horizontal={true}
                data={userTypes}
                renderItem={({ item, index }) => <Field testID={`user${index}`} name="usertype" item={item} component={UserTypeSelect} focusHotel={this.focusHotel} />}
              // renderItem={({ item, index }) => this.renderUserType(item, index)}
              />
            </View>

            <KeyboardAvoidingView behavior="position">

              <View style={styles.loginActionContainer}>
                <Text style={styles.fieldText}>Hotel Name</Text>
                <View style={styles.loginInputContainer}>
                  <Field
                    testID="hotelName"
                    refName={(ref) => this.hotelNameRef = ref}
                    autoCapitalize="none"
                    returnKeyType="send"
                    autoCorrect={false}
                    style={styles.loginInputField}
                    underlineColorAndroid={transparent.color}
                    placeholderTextColor={black.bg}
                    placeholder='Hotel Name'
                    name="hotel"
                    component={TextFieldWithRef}
                    onSubmitEditing={handleSubmit(() => submitHotelLogin(hotel, userType))}
                  // onSubmitEditing={handleSubmit(submitHotelLogin)}
                  />
                </View>

                <View style={styles.loginButtonContainer} >
                  <Button label={'Next'} isDisable={hotel == null} onPress={handleSubmit(submitHotelLogin)} />
                </View>

              </View>
            </KeyboardAvoidingView>

          </View>
          <View style={styles.bottomContainer}>
            {/* <TouchableOpacity style={{ padding: 8 }}>
              <Text>Forget hotel name?</Text>
            </TouchableOpacity> */}
          </View>

        </View>
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
  userType: selector(state, 'usertype')
});

export default connect(mapStateToProps)(LoginForm);