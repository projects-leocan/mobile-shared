import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StatusBar,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import AuthActions from '../../actions/auth';
import LoginForm from '../../components/Login';

class Login extends Component {
  render() {
    const {
      isActiveHotel, hotelName, hotelImage, hotelUsers,
      hotelUsername, submitUserLogin, submitHotelLogin,
      hotelReset, appName, loginHotelName
    } = this.props;
    const hotel = {
      name: hotelName,
      image: hotelImage,
      users: hotelUsers,
    }
    const loginFormProps = {
      isActiveHotel,
      hotel,
      submitUserLogin: submitUserLogin(hotelUsername),
      submitHotelLogin,
      hotelReset,
      appName,
      hotelName,
      loginHotelName
    }
    return <LoginForm {...loginFormProps} />
  }
}

const mapPropsToState = (state) => ({
  ...state.auth
})

const mapDispatchToProps = (dispatch) => ({
  submitHotelLogin: ({ hotel, hotelGroupname }) => dispatch(AuthActions.hotelRequest(hotel, hotelGroupname)),
  submitUserLogin: (hotelUsername, loginHotelName) => (creds) => dispatch(AuthActions.userRequest({ hotelUsername, ...creds, loginHotelName })),
  hotelReset: () => dispatch(AuthActions.hotelReset()),
  dispatch
})

export default connect(mapPropsToState, mapDispatchToProps)(Login);
