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
      hotelReset, appName
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
    }
    return <LoginForm {...loginFormProps} />
  }
}

const mapPropsToState = (state) => ({
  ...state.auth
})

const mapDispatchToProps = (dispatch) => ({
  submitHotelLogin: ({ hotel }) => dispatch(AuthActions.hotelRequest(hotel)),
  submitUserLogin: (hotelUsername) => (creds) => dispatch(AuthActions.userRequest({ hotelUsername, ...creds })),
  hotelReset: () => dispatch(AuthActions.hotelReset()),
  dispatch
})

export default connect(mapPropsToState, mapDispatchToProps)(Login);
