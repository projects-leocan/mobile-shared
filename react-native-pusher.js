'use strict';

const { NativeModules, Platform, Alert } = require('react-native');
const DeviceInfo = require('react-native-device-info');
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import RNPusherPushNotifications from 'react-native-pusher-push-notifications';

const Pusher = NativeModules.RNPusher;

const nativePusher = function (options) {
  const { deviceId, pusherKey, PUSHER_BEAMS_INSTANCE_ID } = options;
  const onRegister = (deviceToken) => {
    Pusher.registerWithDeviceToken(deviceToken);
  };
  const onRegistrationError = (error) => {
    console.error(error);
    Alert.alert('PN Error', error, [{ text: 'OK', onPress: () => console.log('OK Pressed') },]);
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
    },

    subscribePPN(interest) {
      RNPusherPushNotifications.subscribe(
        interest,
        (statusCode, response) => {
          console.log(statusCode, response);
        },
        () => {
          console.log('Push Notifications Success');
        }
      );
    },

    unsubscribePPN(interest) {
      RNPusherPushNotifications.unsubscribe(
        interest,
        (statusCode, response) => {
          console.log(statusCode, response);
        },
        () => {
          console.log('Success');
        }
      );
    },

    subscriptionsChangedListener() {
      return RNPusherPushNotifications.setOnSubscriptionsChangedListener((interests) => {
        return interests;
      });
    }
  };
}

// module.exports = nativePusher;
export default nativePusher;
