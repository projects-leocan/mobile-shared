import {
  DdSdkReactNative,
  DdSdkReactNativeConfiguration,
  DdLogs,
  TrackingConsent
} from '@datadog/mobile-react-native';

class DataDog {
  constructor(dispatch) {
    this.isActive = false;

  }

  initializeDataDog(config) {
    // const config = new DdSdkReactNativeConfiguration(
    //   "<CLIENT_TOKEN>",
    //   "<ENVIRONMENT_NAME>",
    //   "<RUM_APPLICATION_ID>",
    //   false, // track User interactions (e.g.: Tap on buttons).
    //   true, // track XHR Resources
    //   true // track Errors
    // )
    // // config.nativeCrashReportEnabled = true
    // // config.sampleRate = 100
    // // config.serviceName = "com.datadoghq.reactnative.sample"

    // DdSdkReactNative.initialize(config).then(() => {
    //   this.isActive = true;
    //   console.info('The DataDog Sdk was properly initialized')
    // });
  }

  setUserToDD(userInfo) {
    return new Promise((resolve, reject) => {
      // DdSdkReactNative.setUser(userInfo).then(() => {
      //   resolve(true)
      // })
      resolve(true)
    })

  }

  sendLogtoDD(logItem) {
    // DdLogs.debug()
  }

}

export default DataDog;
