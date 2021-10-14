'use strict';

const { NativeModules, Platform, Alert } = require('react-native');
const DeviceInfo = require('react-native-device-info');
import PushNotificationIOS from '@react-native-community/push-notification-ios';


const Pusher = NativeModules.RNPusher ;

const nativePusher = function(options) {
  const { deviceId, pusherKey } = options;
  const onRegister = (deviceToken) => {
    Pusher.registerWithDeviceToken(deviceToken);
  };
  const onRegistrationError = (error) => {
    console.error(error);
    Alert.alert('PN Error', error, [{text: 'OK', onPress: () => console.log('OK Pressed')},]);
  };

  return {
    register() {
      if (Platform.OS === 'ios' && DeviceInfo.isEmulator()) { return; }

      Pusher.pusherWithKey(pusherKey);
      if (Platform.OS === 'ios') {
        PushNotificationIOS.addEventListener('register', onRegister);
        PushNotificationIOS.addEventListener('registrationError', onRegistrationError);

        PushNotificationIOS.requestPermissions();
      } else {
        Pusher.registerWithDeviceToken(deviceId);

        Pusher.requestPermissions(deviceId);
      }
    },

    unregister() {
      if (Platform.OS === 'ios' && DeviceInfo.isEmulator()) { return; }

      if (Platform.OS === 'ios') {
        try {
          PushNotificationIOS.removeEventListener('register', onRegister);
          PushNotificationIOS.removeEventListener('registrationError', onRegistrationError);
        } catch (error) {
          console.log(error)
        }
      }
    },

    subscribe(interest) {
      if (Platform.OS === 'ios' && DeviceInfo.isEmulator()) { return; }

      Pusher.subscribe(interest);
    },

    unsubscribe(interest) {
      if (Platform.OS === 'ios' && DeviceInfo.isEmulator()) { return; }
      
      try {
        Pusher.unsubscribe(interest);
      } catch (error) {
        console.log(error)
      }
    }
  };
}

module.exports = nativePusher;
