package com.rcmobilebase.rnpusher;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.pusher.android.PusherAndroid;
import com.pusher.android.PusherAndroidOptions;
import com.pusher.android.notifications.PushNotificationRegistration;
import com.pusher.android.notifications.gcm.GCMPushNotificationReceivedListener;
import com.pusher.android.notifications.tokens.PushNotificationRegistrationListener;
import com.pusher.android.notifications.interests.InterestSubscriptionChangeListener;
import com.pusher.client.connection.ConnectionEventListener;
import com.pusher.client.connection.ConnectionState;
import com.pusher.client.connection.ConnectionStateChange;

import com.pusher.android.notifications.gcm.GCMRegistrationIntentService;

public class RNPusherCore extends ReactContextBaseJavaModule {

    private static final String TAG = "RNPusher";

    ReactContext reactContext;
    PusherAndroid pusher;
    PushNotificationRegistration nativePusher;
    private static boolean isSubscribed;


    public RNPusherCore(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        isSubscribed = false;
    }

    @ReactMethod
    public void requestPermissions(String senderId) {
        Log.d(TAG, "Request Permissions w/ Sender ID: " + senderId);
        ReactContext reactContext = getReactApplicationContext();

        Intent GCMService = new Intent(reactContext, GCMRegistrationIntentService.class);

        GCMService.putExtra("gcm_defaultSenderId", senderId);
        reactContext.startService(GCMService);
    }

    @Override
    public String getName() {
        return TAG;
    }

    @ReactMethod
    public void pusherWithKey(String key) {
        Log.d(TAG, "Pusher Key: " + key);

        PusherAndroidOptions options = new PusherAndroidOptions();
        PusherAndroid pusher = new PusherAndroid(key, options);
        pusher.connect(new ConnectionEventListener() {
            @Override
            public void onConnectionStateChange(ConnectionStateChange change) {
                Log.d(TAG, "Connection success");
            }

            @Override
            public void onError(String message, String code, Exception e) {
                Log.e(TAG, "There was a problem connecting! " + message);
            }
        }, ConnectionState.ALL);
        this.pusher = pusher;

        PushNotificationRegistration nativePusher = pusher.nativePusher();
        nativePusher.setGCMListener(new GCMPushNotificationReceivedListener() {
            @Override
            public void onMessageReceived(String from, Bundle data) {
                String message = data.getString("message");
                Log.d(TAG, "Message received: " + message);
            }
        });
        this.nativePusher = nativePusher;
    }

    @ReactMethod
    public void registerWithDeviceToken(String senderId) {
        Log.d(TAG, "Sender ID: " + senderId);

        PushNotificationRegistrationListener regListener = new PushNotificationRegistrationListener() {
            @Override
            public void onSuccessfulRegistration() {
                Log.d(TAG, "Registration successful");
            }

            @Override
            public void onFailedRegistration(int statusCode, String response) {
                Log.e(TAG, "Registration failed with code " + statusCode + " " + response);
            }
        };
        try {
            this.nativePusher.registerGCM(this.reactContext, senderId, regListener);
        }
        catch(Exception e) {
            Log.e(TAG, "exception", e);
        }
    }

    @ReactMethod
    public void subscribe(String interest) {
        Log.d(TAG, "Interest: " + interest);

        if (!isSubscribed) {
          this.nativePusher.subscribe(interest, new InterestSubscriptionChangeListener() {
              @Override
              public void onSubscriptionChangeSucceeded() {
                  Log.d(TAG, "Subscription successful");
                  isSubscribed = true;
              }

              @Override
              public void onSubscriptionChangeFailed(int statusCode, String response) {
                  Log.e(TAG, "Subscription failed with code " + statusCode + " " + response);
                  isSubscribed = false;
              }
          });
        }
    }

    @ReactMethod
    public void unsubscribe(String interest) {
        if (isSubscribed) {
          this.nativePusher.unsubscribe(interest, new InterestSubscriptionChangeListener() {
              @Override
              public void onSubscriptionChangeSucceeded() {
                  Log.d(TAG, "Unsubscription successful");
                  isSubscribed = false;
              }

              @Override
              public void onSubscriptionChangeFailed(int statusCode, String response) {
                  Log.e(TAG, "Unsubscription failed with code " + statusCode + " " + response);
                  isSubscribed = true;
              }
          });
        }
    }
}
