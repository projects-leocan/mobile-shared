#RC MOBILE BASE

It is a package that provides shared functionality for all Roomchecking mobile apps.

##Installation

1. Add to package.json
```
"rc-mobile-base": "git+ssh://git@github.com/opula/rc-mobile-base.git",
```
2. `npm i` or `yarn`

##Native packages

###Installation

1. Please prefer manuall installation for now.
2. Please make all APN and GCM specific actions before use RNPusher. Find more info here (https://pusher.com/docs/push_notifications/android/gcm) and (https://pusher.com/docs/push_notifications/ios/apns)

####iOS

#####Automatically

1. Run `react-native link rc-mobile-base`

#####Manually

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `rc-mobile-base` and add `RNPusher.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNPusher.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Click `RNPusher.xcodeproj` in the project navigator and go the `Build Settings` tab. Make sure 'All' is toggled on (instead of 'Basic'). Look for `Header Search Paths` and make sure it contains `$(SRCROOT)/../react-native/React`, `$(SRCROOT)/../../React`, `${SRCROOT}/../../ios/Pods/Headers/Public` and `${SRCROOT}/../../ios/Pods/Headers/Public/libPusher` - all marked as `recursive`.
5. Inside your `ios` directory add a file named `Podfile`
6. Add `pod 'libPusher', git: 'https://github.com/pusher/libPusher.git', branch: 'push-notifications'` and specify your target (your xcode project name)
7. Install `PushNotificationIOS` as described [here](https://facebook.github.io/react-native/docs/pushnotificationios.html)
8. Run `pod install --project-directory=ios`
9. Run `react-native run-ios`

If you used to run project with `react-native run-ios`, please change `Build Configuration` to `Debug` under `Run` tab in project's scheme editor.

####Android

#####Automatically

1. Run `react-native link rc-mobile-base`
2. Change `AndroidManifest.xml` same as while manual installation.

#####Manual

In your file `android/settings.gradle` add the following

```gradle
include ':rc-mobile-base'
project(':rc-mobile-base').projectDir = new File(rootProject.projectDir, '../node_modules/rc-mobile-base/android')
```

In the file `android/app/build.gradle` add a new dependency

```gradle
dependencies {
  compile 'com.android.support:multidex:1.0.1'
  compile 'com.google.android.gms:play-services-gcm:9.4.0'
  compile 'com.pusher:pusher-websocket-android:0.3.1'

  compile project(':rc-mobile-base')
}
```

And in the same file inside the `android:defaultConfig ` section
```gradle
multiDexEnabled true
```

And at the bottom of the file
```gradle
apply plugin: 'com.google.gms.google-services'
```

Don't forget to set
```gradle
minSdkVersion 23
targetSdkVersion 23
```
as it is required by native pusher lib.

In the file `android/build.gradle` add a new classpath dependency
```gradle
classpath 'com.google.gms:google-services:3.0.0'
```

And new repository
```gradle
maven { url 'http://clojars.org/repo' }
```

Then in the file `MainApplication.java` add the following Java imports

```java
import android.content.Context;
import android.support.multidex.MultiDex;

import com.rcmobilebase.rnpusher.RNPusher;
```

and add Native module

```java
    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            //Other RN modules
            new RNPusher()
        );
    }
```

and also add multidex support

```java
@Override
protected void attachBaseContext(Context base) {
  super.attachBaseContext(base);
  MultiDex.install(this);
}
```

Then in your `android/app/src/main/AndroidManifest.xml` add the following inside `<application>` tag

```xml
<!-- Pusher's GCM listeners and services -->
<receiver
    android:name="com.google.android.gms.gcm.GcmReceiver"
    android:exported="true"
    android:permission="com.google.android.c2dm.permission.SEND" >
    <intent-filter>
        <action android:name="com.google.android.c2dm.intent.RECEIVE" />
        <category android:name="gcm.play.android.samples.com.gcmquickstart" />
    </intent-filter>
</receiver>

<service
    android:name="com.pusher.android.notifications.gcm.PusherGCMListenerService"
    android:exported="false" >
    <intent-filter>
        <action android:name="com.google.android.c2dm.intent.RECEIVE" />
    </intent-filter>
</service>

<service
    android:name="com.pusher.android.notifications.gcm.GCMInstanceIDListenerService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.android.gms.iid.InstanceID"/>
    </intent-filter>
</service>

<service
    android:name="com.pusher.android.notifications.gcm.GCMRegistrationIntentService"
    android:exported="false">
</service>
```

Then copy your `google-services.json` file to `android/app`.

And finally run `react-native run-android`.

###Usage

1. Required package
```javascript
import nativePusher from 'rc-mobile-base/react-native-pusher'; 
```
2. Define pusher api key and gcm sender id (which is your project number)
```javascript
const pusherKey = '02750edc36b43c0110a3';
const senderId = '912214320959';
```
3. Init  native pusher
```javascript
const pusherPN = nativePusher({ deviceId: senderId, pusherKey });
```
4. Register your client and subscribe to some interest
```javascript
this.pusherPN.register();
this.pusherPN.subscribe('roomcheckingsystem');
```
5. You have to unregister your instance when app has done it's job
```javascript
this.pusherPN.unregister();
this.pusherPN.unsubscribe('roomcheckingsystem');
```

Please reference [runner](https://github.com/opula/rc-mobile-runner) for more detailed example.
