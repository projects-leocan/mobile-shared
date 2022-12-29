import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import * as Sentry from "@sentry/react-native";

Sentry.init({
    dsn: "https://1681c42b227442e085cf8d71f7749879@o4504372118814720.ingest.sentry.io/4504372120190976",
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
  });

const transaction = Sentry.startTransaction({ name: "setUpFirebaseNotification" });
Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));

class FCMService {
    register = (onRegister, onNotification, onOpenNotification, updateRefreshToken) => {
        this.checkPermission(onRegister);
        this.createNotificationListeners(
            onRegister,
            onNotification,
            onOpenNotification,
            updateRefreshToken
        );
    };

    registerAppWithFCM = async () => {
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true);
        }
    };

    checkPermission = onRegister => {
        messaging()
            .hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.getToken(onRegister);
                } else {
                    this.requestPermission(onRegister);
                }
            })
            .catch(error => {
                console.log('[FCMService] Permission rejected', error);
                Sentry.captureMessage('[FCMService] Permission rejected' +  error);
            });
    };

    getToken = onRegister => {
        messaging()
            .getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    Sentry.captureMessage('[FCMService] Device Register '+ fcmToken);
                    onRegister(fcmToken);
                } else {
                    console.log('[FCMService] User does not have a device token');
                    Sentry.captureMessage('[FCMService] User does not have a device token');
                }
            })
            .catch(error => {
                console.log('[FCMService] getToken rejected', error);
                Sentry.captureMessage('[FCMService] getToken rejected' +  error);
            });
    };

    requestPermission = onRegister => {
        messaging()
            .requestPermission()
            .then(() => {
                this.getToken(onRegister);
            })
            .catch(error => {
                console.log('[FCMService] Request Permission rejected', error);
                Sentry.captureMessage('[FCMService] Request Permission rejected'+ error);
            });
    };

    deleteToken = () => {
        console.log('[FCMService] deleteToken');
        messaging()
            .deleteToken()
            .catch(error => {
                console.log('[FCMService] Delete token error', error);
                Sentry.captureMessage('[FCMService] Delete token error'+ error);
            });
    };

    createNotificationListeners = (
        onRegister,
        onNotification,
        onOpenNotification,
        updateRefreshToken
    ) => {
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                '[FCMService] onNotificationOpenedApp Notification caused on to open',
            );
            if (remoteMessage) {
                const notification = remoteMessage.notification;
                onOpenNotification(notification);
            }
        });

        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                console.log(
                    '[FCMService] getInitialNotification Notification caused on to open',
                );
                if (remoteMessage) {
                    const notification = remoteMessage.notification;
                    onOpenNotification(notification);
                }
            });

        this.messageListener = messaging().onMessage(async remoteMessage => {
            console.log('[FCMService] A new FCM message arrived!', remoteMessage);
            Sentry.captureMessage('[FCMService] A new FCM message arrived! ' + remoteMessage);
            
            if (remoteMessage) {
                let notification = null;
                if (Platform.OS === 'ios') {
                    notification = remoteMessage.data.notification;
                } else {
                    notification = remoteMessage.notification;
                }
                onNotification(notification);
            }
        });

        messaging().onTokenRefresh(fcmToken => {
            console.log('[FCMService] New token refresh', fcmToken);
            Sentry.captureMessage('[FCMService] New token refresh'+ fcmToken);
            // onRegister(fcmToken);
            updateRefreshToken(fcmToken)
        });
    };

    unRegister = () => {
        this.messageListener();
    };
}

export const fcmService = new FCMService();