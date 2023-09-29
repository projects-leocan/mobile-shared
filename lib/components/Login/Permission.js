import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  AppState
} from 'react-native';
import RcPermissions from 'rc-mobile-base/lib/utils/Permissions';
import Permissions, { PERMISSIONS, check, request } from 'react-native-permissions';

import UserLogin from './User';


import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { fcmService } from 'rc-mobile-base/lib/utils/FCMService';
import styles from './styles';


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
      displayLogin: false,
      appState: AppState.currentState
    }

    this.onRegister = this.onRegister.bind(this);

  }

  requestCameraPermission = async () => {
    let value = await RcPermissions.requestPermissions('camera');
    if (value === 'restricted' || value === 'blocked') {
      Permissions.openSettings()
    }
    if (value === 'undetermined' || value === 'denied') {
      value = await RcPermissions.requestPermissions("camera");
    }
    
    if (Platform.OS === 'android') {
      this.setState({ cameraValue: value })
      this.setState({ libraryValue: value})
    }else{
      this.setState({ cameraValue: value })
    }
    
  }

  checkCameraPermission = async () => {
    const value = await check(CAMERA_PERMISSION)
    this.setState({ cameraValue: value })
  }

  requestMicroPhonePermission = async () => {
    let value = await RcPermissions.requestPermissions('microphone');
    if (value === 'restricted' || value === 'blocked') {
      Permissions.openSettings()
    }
    if (value === 'undetermined' || value === 'denied') {
      value = await request(MICROPHONE_PERMISSION);
    }
    this.setState({ microPhoneValue: value })
  }

  checkMicroPhonePermission = async () => {
    const value = await check(MICROPHONE_PERMISSION)
    this.setState({ microPhoneValue: value })
  }

  requestLibraryPermission = async () => {
    let value = await RcPermissions.requestPermissions('library');
    if (value === 'restricted' || value === 'blocked') {
      Permissions.openSettings()
    }
    if (value === 'undetermined' || value === 'denied') {
      value = await RcPermissions.requestPermissions('library');
    }
    if (Platform.OS === 'android') {
      this.setState({ libraryValue: value })
      this.setState( {cameraValue: value})
    }else{
      this.setState({ libraryValue: value })
    }
    
  }

  checkLibraryPermission = async () => {
    const value = await check(LIBRARY_PERMISSION) 
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
    this.setState({ notificationValue: value })
    if (value === "granted") {
      fcmService.registerAppWithFCM();
      fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification);
    }
    if (value === 'restricted' || value === 'blocked') {
      Permissions.openSettings()
    }
    if (value === 'undetermined' || value === 'denied') {
      value = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
  }

  checkNotificationPermission = async () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.checkPermissions((data) => {
        data.authorizationStatus === 2 ? this.setState({ notificationValue: "granted" }) : this.setState({ notificationValue: "denied" })
      })
    }
    else {
      if (OsVer >= 13) {
        const value = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
        value === true ? this.setState({ notificationValue: "granted" }) : this.setState({ notificationValue: "denied" })
      }
    }
  }

  setUpFirebaseNotification = async () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.requestPermissions().then(
        (data) => {
          fcmService.registerAppWithFCM();
          fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification);
          if (data.authorizationStatus === 2) {
            this.setState({ notificationValue: "granted" })
          }else{
            this.setState({ notificationValue: "denied" })
            Permissions.openSettings()
          }
        },
        (data) => {
          console.log('PushNotificationIOS.requestPermissions failed', data);
        },
      );
    } else {
      if (OsVer >= 13) {
        this.requestNotificationPermission()
      } else {
        fcmService.registerAppWithFCM();
        fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification);
      }
    }
  }

  handleContinue = () => {
    const { isDisable, cameraValue, libraryValue, microPhoneValue, notificationValue } = this.state;
    if (Platform.OS === 'android' && OsVer <= 12) {
      if (cameraValue === "granted" && libraryValue === "granted" && microPhoneValue === "granted") {
        this.setState({ displayLogin: true })
      }
    } else {
      if (cameraValue === "granted" && (libraryValue === "granted" || libraryValue === "limited")  && microPhoneValue === "granted" && notificationValue === "granted") {
        this.setState({ displayLogin: true })
      }
    }
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.checkCameraPermission()
      this.checkMicroPhonePermission()
      this.checkLibraryPermission()
      this.checkNotificationPermission()
    }
    this.setState({appState: nextAppState});
  }

  componentDidUpdate() {
    const { isDisable, cameraValue, libraryValue, microPhoneValue, notificationValue } = this.state;
    if (Platform.OS === 'android' && OsVer <= 12) {
      if (cameraValue === "granted" && libraryValue === "granted" && microPhoneValue === "granted") {
        this.setState({ isDisable: false })
      }
    } else {
      if (cameraValue === "granted" && (libraryValue === "granted" || libraryValue === "limited") && microPhoneValue === "granted" && notificationValue === "granted") {
        this.setState({ isDisable: false })
      }
    }
  }

  componentDidMount() {
    this.checkCameraPermission()
    this.checkMicroPhonePermission()
    this.checkLibraryPermission()
    this.checkNotificationPermission()
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }


  render() {
    const { appName } = this.props;
    const { isDisable, cameraValue, libraryValue, microPhoneValue, notificationValue, displayLogin } = this.state;
    return (
      <View style={styles.loginRootcontainer}>
        {displayLogin ? <UserLogin {...this.props} /> :
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

export default Permission;