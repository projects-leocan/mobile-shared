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
  StyleSheet,
  PermissionsAndroid
} from 'react-native';
import { connect } from 'react-redux';
import AuthActions from '../../actions/auth';
import AuthLoaderAction from "../../actions/authLoader"
import LoginForm from '../../components/Login';
import { deviceFCMTokenSelector } from 'rc-mobile-base/lib/selectors/auth';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { PERMISSIONS, check, checkNotifications, request } from 'react-native-permissions';
import { stopAsyncValidation, reset, stopSubmit } from 'redux-form'

const OsVer = Platform.constants['Release'];

const MICROPHONE_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.MICROPHONE,
  android: PERMISSIONS.ANDROID.RECORD_AUDIO,
});

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA
});

const LIBRARY_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.CAMERA
});

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayLogin: false
    }


  }
  checkCameraPermission = async () =>{
    const value = await check(CAMERA_PERMISSION)
    return value
  }

  checkMicroPhonePermission = async () =>{
    const value = await check(MICROPHONE_PERMISSION)
   return value
  }

  checkLibraryPermission = async () =>{
    const value = await check(LIBRARY_PERMISSION)
    return value
  }

  checkNotificationPermission = async  ()  =>{
    const value = await checkNotifications()
    return value.status
  }

  async componentDidMount(){
   const cameraValue = await this.checkCameraPermission()
   const libraryValue = await this.checkLibraryPermission()
   const microPhoneValue = await this.checkMicroPhonePermission()
   const notificationValue = await this.checkNotificationPermission()
    if (Platform.OS === 'android' && OsVer <= 12) {
      if (cameraValue === "granted" && libraryValue === "granted" && microPhoneValue === "granted") {
         this.setState({isDisplayLogin: true})
      }
    }else{
      if (cameraValue === "granted" && (libraryValue === "granted" || libraryValue === 'limited') && microPhoneValue === "granted" && notificationValue === "granted") {
        this.setState({isDisplayLogin: true})
      }
    }
    this.props.hotelLoaderSuccess()
  }
  render() {
    const {
      isActiveHotel, hotelName, hotelImage, hotelUsers,
      hotelUsername, hotelGroupname, submitUserLogin, submitHotelLogin,
      hotelReset, appName, deviceFCMToken, setFCMToken, requestUpdateFCMToken, hotelLoader, hotelLoaderSuccess
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
      hotelLoader,
      hotelLoaderSuccess,
      hotelReset,
      appName,
      hotelName,
      hotelGroupName: hotelGroupname,
      deviceFCMToken: deviceFCMToken,
      setFCMToken:setFCMToken,
      requestUpdateFCMToken: requestUpdateFCMToken,
      isDisplayLogin: this.state.isDisplayLogin,
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
  hotelLoader: () => dispatch(AuthLoaderAction.loaderHotelRequest()),
  hotelLoaderSuccess: () => dispatch(AuthLoaderAction.loaderHotelSuccess()),

  dispatch
})

export default connect(mapPropsToState, mapDispatchToProps)(Login);
