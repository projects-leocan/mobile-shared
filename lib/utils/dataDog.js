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
    // console.log("sendLogtoDD", JSON.parse(logItem));
    const data = JSON.parse(logItem)
    if (data?.MessageStatus?.apiCallSuccess === false) {
      DdLogs.error(logItem)
    }
    else if (data?.MessageStatus?.apiCallSuccess === true) {
      DdLogs.debug(logItem)
    }
    else {
      DdLogs.info(logItem)
    }
  }

}

export default DataDog;
