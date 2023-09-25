import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from 'react-native';
import Permissions from 'rc-mobile-base/lib/utils/Permissions';
import { PERMISSIONS, request } from 'react-native-permissions';
import UserLogin from './User';



import Icon from 'react-native-vector-icons/FontAwesome'
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { fcmService } from 'rc-mobile-base/lib/utils/FCMService';

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
import RealTime from 'rc-mobile-base/lib/layouts/RealTime';

import styles from './styles';

const MICROPHONE_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.MICROPHONE,
  android: PERMISSIONS.ANDROID.RECORD_AUDIO,
});

const OsVer = Platform.constants['Release'];


export class Permission extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cameraValue: "",
      libraryValue: "",
      microPhoneValue: "",
      notificationValue: "",
      isDisable: true,
      displayLogin: false
    }

    this.onRegister = this.onRegister.bind(this);

  }

  requestCameraPermission = async () => {
    const value = await Permissions.requestPermissions('camera');
    this.setState({ cameraValue: value })
  }

  requestMicroPhonePermission = async () => {
    const value = await request(MICROPHONE_PERMISSION);
    this.setState({ microPhoneValue: value })
  }

  requestLibraryPermission = async () => {
    const value = await Permissions.requestPermissions('library');
    this.setState({ libraryValue: value })
  }

  onRegister(token) {
    const { deviceFCMToken, setFCMToken, requestUpdateFCMToken } = this.props;
    if (deviceFCMToken !== token) {
      setFCMToken(token);
      requestUpdateFCMToken()
    }
  }

  onNotification(notify) {
    console.log('[App] onNotification', notify);
  }

  onOpenNotification(notify) {
    console.log('[App] onOpenNotification', notify);
  }

  requestNotificationPermission = async () => {
     const value = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
     this.setState({notificationValue: value})
    if (value === "granted") {
      fcmService.registerAppWithFCM();
      fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification);
    }
  }

  setUpFirebaseNotification = async () => {
    if (Platform.OS === 'ios') {
      const value = await PushNotificationIOS.requestPermissions()
      PushNotificationIOS.requestPermissions().then(
        (data) => {
          fcmService.registerAppWithFCM();
          fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification);
          data.authorizationStatus === 2 ? this.setState({notificationValue: "granted"}) : this.setState({notificationValue: "denied"})
        },
        (data) => {
          console.log('PushNotificationIOS.requestPermissions failed', data);
        },
      );
    } else {
      if (OsVer >= 13) {
        this.requestNotificationPermission()
      }else{
      fcmService.registerAppWithFCM();
      fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification);
      }
    }
  }

  handleContinue = () => {
    const { isDisable, cameraValue, libraryValue, microPhoneValue, notificationValue } = this.state;
    if (cameraValue === "granted" && libraryValue === "granted" && microPhoneValue === "granted" && notificationValue === "granted") {
      this.setState({displayLogin: true})
    }else{
      this.setState({displayLogin: false})
    }
  }

  componentDidUpdate(){
    const { isDisable, cameraValue, libraryValue, microPhoneValue, notificationValue } = this.state;

    if (cameraValue === "granted" && libraryValue === "granted" && microPhoneValue === "granted" && notificationValue === "granted") {
      this.setState({isDisable: false})
    }
  }


  render() {
    const { appName } = this.props;
    const { isDisable, cameraValue, libraryValue, microPhoneValue, notificationValue, displayLogin } = this.state;
    return (
      <View style={styles.loginRootcontainer}>
        {displayLogin ? <UserLogin {...this.props}/> :
      <ScrollView testID="hotelLogin" style={styles.loginRootcontainer} scrollEnabled={false}>
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <View style={styles.hotelContainer}>
            <View style={styles.permissionheaderContainer}>
              <Image source={require('../../images/splash_logo.png')} style={styles.logoImg} />
            </View>
            <View style={styles.bodyContainer}>
              <Text style={[styles.permissionTitle, { lineHeight: 30 }]}>To get started,</Text>
              <Text style={styles.permissionTitle}>Hopr {appName} needs access to:</Text>
              <View style={styles.PermissionView}>
                <View style={styles.Box}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <TouchableOpacity style={styles.ckeckBoxView} onPress={this.requestCameraPermission}>
                      {this.state.cameraValue === "granted" ? <Image style={{ height: 30, width: 30 }} source={require("../../images/right.png")} /> : <></>}
                    </TouchableOpacity> 
                    <Text style={styles.checkBoxRightText}>Camera</Text>
                  </View>
                  <Text style={styles.checkBoxDescriptionText}>Allow Hopr {appName} to access your camera to take picture and record video</Text>
                </View>

                <View style={styles.Box}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <TouchableOpacity style={styles.ckeckBoxView} onPress={this.requestMicroPhonePermission}>
                      {this.state.microPhoneValue === "granted" ? <Image style={{ height: 30, width: 30 }} source={require("../../images/right.png")} /> : <></>}
                    </TouchableOpacity>
                    <Text style={styles.checkBoxRightText}>Microphone</Text>
                  </View>
                  <Text style={styles.checkBoxDescriptionText}>Allow Hopr {appName} to access your microphone to record audio</Text>
                </View>

                <View style={styles.Box}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <TouchableOpacity style={styles.ckeckBoxView} onPress={this.requestLibraryPermission}>
                    {this.state.libraryValue === "granted" || this.state.libraryValue === "limited" ? <Image style={{ height: 30, width: 30 }} source={require("../../images/right.png")} /> : <></>}
                    </TouchableOpacity>
                    <Text style={styles.checkBoxRightText}>Photo Library</Text>
                  </View>
                  <Text style={styles.checkBoxDescriptionText}>Allow Hopr {appName} to access your photo library to submit photos and videos </Text>
                </View>

                {
                  Platform.OS === "android" && OsVer <= 12 ? <></> 
                  : 
                  <View style={styles.Box}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <TouchableOpacity style={styles.ckeckBoxView} onPress={this.setUpFirebaseNotification}>
                    {this.state.notificationValue === "granted" ? <Image style={{ height: 30, width: 30 }} source={require("../../images/right.png")} /> : <></>}
                    </TouchableOpacity>
                    <Text style={styles.checkBoxRightText}>Notification</Text>
                  </View>
                  <Text style={styles.checkBoxDescriptionText}>Allow Hopr {appName} to send you  notification</Text>
                </View>
                }
              </View>

              <TouchableOpacity style={[styles.permissionButtonView, { backgroundColor: isDisable ? `rgba(239,115,115, 0.6)` : `rgb(239,115,115)` }]} onPress={this.handleContinue}>
                <Text style={styles.permissionButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
      }
      </View>
    )
  }
}

// const LoginForm = reduxForm({
//   form: 'hotelLogin'
// })(HotelLogin)

// const selector = formValueSelector('hotelLogin')

// const mapStateToProps = (state) => ({
//   hotel: selector(state, 'hotel'),
//   hotelGroupname: selector(state, 'hotelGroupname'),
// });
// export default connect(mapStateToProps)(Permission);

export default Permission;