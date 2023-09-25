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
import { deviceFCMTokenSelector } from 'rc-mobile-base/lib/selectors/auth';


class Login extends Component {
  render() {
    const {
      isActiveHotel, hotelName, hotelImage, hotelUsers,
      hotelUsername, hotelGroupname, submitUserLogin, submitHotelLogin,
      hotelReset, appName, deviceFCMToken, setFCMToken, requestUpdateFCMToken
    } = this.props;
    const hotel = {
      name: hotelName,
      image: hotelImage,
      users: hotelUsers,
    }
    const loginFormProps = {
      isActiveHotel,
      hotel,
      submitUserLogin: submitUserLogin({hotelGroupname, hotelUsername}),
      submitHotelLogin,
      hotelReset,
      appName,
      hotelName,
      hotelGroupName: hotelGroupname,
      deviceFCMToken: deviceFCMToken,
      setFCMToken:setFCMToken,
      requestUpdateFCMToken: requestUpdateFCMToken
    }
    return <LoginForm {...loginFormProps} />
  }
}

const mapPropsToState = (state) => ({
  ...state.auth,
  deviceFCMToken: deviceFCMTokenSelector(state),

})

const mapDispatchToProps = (dispatch) => ({
  submitHotelLogin: ({ hotel, hotelGroupname }) => dispatch(AuthActions.hotelRequest(hotel, hotelGroupname)),
  submitUserLogin: (hotelGroupname, hotelUsername) => (creds) => dispatch(AuthActions.userRequest({ ...hotelUsername, ...creds, ...hotelGroupname })),
  hotelReset: () => dispatch(AuthActions.hotelReset()),
  setFCMToken: (fcmToken) => dispatch(AuthActions.setFCMToken(fcmToken)),
  requestUpdateFCMToken: () => dispatch(AuthActions.requestUpdateFCMToken()),
  dispatch
})

export default connect(mapPropsToState, mapDispatchToProps)(Login);
