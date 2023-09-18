import NetInfo from "@react-native-community/netinfo";
// import { NetInfo } from 'react-native';
import Actions from './actions';
import { Actions as OfflineActions } from '../offline';
import request from '../utils/request';
import { INTERVAL_TIME, OFFLINE_INTERVAL_TIME, PING_URL } from './config';

import { networkStatusChanged, scheduleRetry } from '@redux-offline/redux-offline/lib/actions';
import { powerToggle } from '../wifi/actions';
import { get } from 'lodash';
import { AppState } from "react-native";

let unsubscribe = null
class Network {
  constructor(dispatch, options) {
    this.dispatch = dispatch;
    this.isActive = false;
  }

  offlineRetries = 0

  _checkStatus = () => {
    NetInfo.fetch().then(state => {
      const netInfo = {
        isConnectionExpensive: null,
      }

      if (state) {
        const isConnected = get(state, 'isConnected', false);
        netInfo.reach = state || null

        if (isConnected) {
          this.dispatch(Actions.statusOnline());
          this.dispatch(networkStatusChanged({
            online: true,
            netInfo,
          }));

          this.dispatch(OfflineActions.start());
          this.dispatch(scheduleRetry());
          this._runOnline();
          this.offlineRetries = 0;
        } else {
          this.dispatch(networkStatusChanged({
            online: false,
            netInfo,
          }));
          this.dispatch(Actions.statusOffline());
          this._runOffline();
          this.offlineRetries++;
        }

      }
    })
  }

  fetchStatus(state,value) {
    const netInfo = {
      isConnectionExpensive: null,
    }

    if (state) {
      const isConnected = get(state, 'isConnected', false);
      netInfo.reach = state || null

      if (isConnected) {
        this.dispatch(Actions.statusOnline());
        this.dispatch(networkStatusChanged({
          online: true,
          netInfo,
        }));

        this.dispatch(OfflineActions.start());
        this.dispatch(scheduleRetry());
        this._runOnline(value);
        this.offlineRetries = 0;
      } else {
        this.dispatch(networkStatusChanged({
          online: false,
          netInfo,
        }));
        this.dispatch(Actions.statusOffline());
        this._runOffline(value);
        this.offlineRetries++;
      }

    }
  }

  activate(value) {
    NetInfo.configure({
      reachabilityUrl: value.reachabilityUrl === "" ? "https://clients3.google.com/generate_204" : value.reachabilityUrl,
      reachabilityTest: async (response) => response.status === 204,
      reachabilityLongTimeout: 20 * 1000,
      reachabilityShortTimeout: 5 * 1000,
      reachabilityRequestTimeout: 5 * 1000,
      reachabilityShouldRun: () => true,
      shouldFetchWiFiSSID: true, // met iOS requirements to get SSID. Will leak memory if set to true without meeting requirements.
      useNativeReachability: false
    });

    unsubscribe = NetInfo.addEventListener(state => {
      this.fetchStatus(state,value)
    });

    AppState.addEventListener("change", async (nextAppState) => {
      if (nextAppState == 'active') {
        NetInfo.fetch().then(state => {
          this.fetchStatus(state,value)
        })
      }
    });
  }

  // activate() {
  //     this._checkStatus();
  //     // unsubscribe = NetInfo.addEventListener('connectionChange', this._checkStatus.bind(this));
  //     unsubscribe = NetInfo.addEventListener(state => {
  //       this._checkStatus()
  //     });
  //   }

  _runOffline(value) {
    let OFFLINE_INTERVAL_TIME = parseInt(value.offlineIntervalTime)
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      this._checkStatus();
    }, OFFLINE_INTERVAL_TIME);
  }

  _runOnline(value) {
    let INTERVAL_TIME = parseInt(value.intervalTime)
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      this._checkStatus();
    }, INTERVAL_TIME);
  }

  deactivate() {
    clearInterval(this.timer);
    if (unsubscribe != null) unsubscribe()
    // NetInfo.removeEventListener('connectionChange', this._checkStatus.bind(this));
  }
}

export default Network;
