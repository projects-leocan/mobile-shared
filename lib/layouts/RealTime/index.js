import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  SectionList,
  StyleSheet,
  LayoutAnimation
} from 'react-native';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect';

import ModalHeader from '../../components/ModalHeader';
import OutboundItem from './OutboundItem';
import OutboundHeader from './OutboundHeader';

import { Selectors as OfflineSelectors, Actions as OfflineActions } from '../../offline';
import { Actions as NetworkActions, Selectors as NetworkSelectors } from '../../network';
import OutboundActions from '../../actions/outbound';
import {
  offlineOutboxSelector,
  offlineRetrySelector,
  outboundFailedSelector,
  offlineListSelector,
  networkMessageSelector
} from './selectors';

import {
  margin,
  padding,
  red,
  white
} from 'rc-mobile-base/lib/styles';

import {
  OnlineGood,
  OnlineRunning,
  OnlineWarning,
  OnlineError,
  OfflineGood,
  OfflinePending,
  OfflineError
} from './States';

class RealTimeLayout extends Component {

  state = {
    isScreenShown: false
  }
  
  _handleForce = () => {
    const { queue } = this.props;

    if (!queue || !queue.length) {
      return;
    }
    // console.log('forced offline', queue);

    this.props.forceOffline();
  }

  _toggleScreen = () => this.setState({ isScreenShown: !this.state.isScreenShown })

  render() {
    const { network, queue, outbox, meta, retryCount, outboundFailed, offlineList, isHidePending, networkMessage } = this.props;
    const { isScreenShown } = this.state;
    const isOffline = !network.isOnline;
    const itemsToSync = queue.length + outbox.length;
    let currentState;
    let messageLevel = 3;
    const configLevel = networkMessage === "high" ? 3 
      : networkMessage === "low" ? 1
      : 2;
    
    if (isOffline && itemsToSync) {
      currentState = <OfflinePending onPress={this._toggleScreen} itemsToSync={itemsToSync} />
      messageLevel = 1;
    } else if (isOffline && outboundFailed && outboundFailed.length) {
      currentState = <OfflineError onPress={this._toggleScreen} failedItems={outboundFailed} />
      messageLevel = 1;
    } else if (isOffline) {
      currentState = <OfflineGood onPress={this._toggleScreen} />
      messageLevel = 2;
    } else if (!isOffline && itemsToSync && retryCount < 3) {
      currentState = <OnlineRunning onPress={this._toggleScreen} itemsToSync={itemsToSync} />
      messageLevel = 1;
    } else if (!isOffline && itemsToSync) {
      currentState = <OnlineWarning onPress={this._toggleScreen} itemsToSync={itemsToSync} />
      messageLevel = 2;
    } else if (!isOffline && outboundFailed && outboundFailed.length) {
      currentState = <OnlineError onPress={this._toggleScreen} failedItems={outboundFailed} />
      messageLevel = 1;
    } else if (!isOffline && !itemsToSync) {
      currentState = <OnlineGood onPress={this._toggleScreen} />
      messageLevel = 3;
    }

    return (
      <View style={styles.container}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={isScreenShown}
          onRequestClose={this._toggleScreen}
          >
          <View style={styles.screen}>
            <ModalHeader
              value={"Failed requests"}
              onPress={this._toggleScreen}
              />

            <SectionList
              renderItem={({ item, index }) => <OutboundItem data={item} retry={this.props.retry} remove={this.props.remove} />}
              renderSectionHeader={({ section }) => <OutboundHeader title={section.title} type={section.title} />}
              sections={offlineList}
              keyExtractor={(item) => item.index}
              />
          </View>
        </Modal>

        { configLevel >= messageLevel ? currentState : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    
  },
  realTimeContainer: {
    height: 38,
    ...padding.x10,
    flexDirection: 'row',
    alignItems: 'center',
    ...red.bg
  },
  realTimeText: {
    ...white.text,
    fontSize: 14
  },
  screen: {
    backgroundColor: 'white'
  }
});

const mapStateToProps = createStructuredSelector({
  queue: OfflineSelectors.offlineQueueSelector,
  meta: OfflineSelectors.offlineMetaSelector,
  network: NetworkSelectors.network,
  outbox: offlineOutboxSelector,
  retryCount: offlineRetrySelector,
  outboundFailed: outboundFailedSelector,
  offlineList: offlineListSelector,
  networkMessage: networkMessageSelector
});

const mapDispatchToProps = (dispatch) => {
  return {
    forceOffline: () => dispatch(OfflineActions.start()),
    retry: (data) => dispatch(OutboundActions.retryFailed(data)),
    remove: (data) => dispatch(OutboundActions.removeFailed(data)),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(RealTimeLayout);
