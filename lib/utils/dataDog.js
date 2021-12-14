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

  initializeDataDog(ddConfig) {
    const { CLIENT_TOKEN, ENVIRONMENT_NAME, RUM_APPLICATION_ID } = ddConfig;

    return new Promise((resolve, reject) => {
      const config = new DdSdkReactNativeConfiguration(
        CLIENT_TOKEN,
        RUM_APPLICATION_ID,
        ENVIRONMENT_NAME,
        false, // track User interactions (e.g.: Tap on buttons).
        false, // track XHR Resources
        false // track Errors
      )
      // config.nativeCrashReportEnabled = true
      config.sampleRate = 100
      config.site = "EU"
      // config.serviceName = "com.datadoghq.reactnative.sample"
  
      DdSdkReactNative.initialize(config).then(() => {
        this.isActive = true;
        console.log('The DataDog Sdk was properly initialized');
        resolve(true)
      });
    })
  }

  deactivate() {
    this.isActive = false;
  }

  setUserToDD(userInfo) {
    return new Promise((resolve, reject) => {
      DdSdkReactNative.setUser(userInfo).then(() => {
        resolve(true)
      })
    })
  }

  sendLogtoDD(logItem) {
    DdLogs.debug(logItem)
  }

}

export default DataDog;
