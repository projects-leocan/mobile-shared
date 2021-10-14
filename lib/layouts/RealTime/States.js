import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  SectionList,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n'
import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo';

import {
  margin,
  padding,
  red,
  white,
  notificationSuccess,
  notificationInfo,
  notificationWarning,
  notificationDanger
} from '../../styles';

export const OfflineGood = ({ onPress }) => (
  <View>
    <View style={[styles.realTimeContainer, notificationWarning.bg]}>
      <Spinner style={[margin.r5]} isVisible={true} size={24} type={'Pulse'} color={"#FFFFFF"}/>
      <Text style={styles.realTimeText}>Searching for internet</Text>
    </View>
  </View>
)

export const OfflinePending = ({ onPress, itemsToSync }) => (
  <View>
    <TouchableOpacity style={[styles.realTimeContainer, notificationDanger.bg]} onPress={onPress}>
      <Spinner style={[margin.r5]} isVisible={true} size={24} type={'Pulse'} color={"#FFFFFF"}/>
      <Text style={styles.realTimeText}>{ `Offline · ${I18n.t('base.realtime.index.pending-requests-itemstosync')}` }: { itemsToSync }</Text>
    </TouchableOpacity>
  </View>
)

export const OfflineError = ({ onPress, failedItems }) => (
  <View>
    <TouchableOpacity style={[styles.realTimeContainer, notificationDanger.bg]} onPress={onPress}>
      <Icon name="exclamation-triangle" size={16} color="white" style={[margin.r10]} />
      <Text style={styles.realTimeText}>{ `Offline · Failed items: ${failedItems.length}` }</Text>
    </TouchableOpacity>
  </View>
)

export const OnlineGood = ({ onPress }) => (
  <View>
    <View style={[styles.realTimeContainer, notificationSuccess.bg]}>
      <Entypo name="signal" size={22} color="white" style={[margin.r10]} />
      <Text style={styles.realTimeText}>Good network connection</Text>
    </View>
  </View>
)

export const OnlineRunning = ({ onPress, itemsToSync }) => (
  <View>
    <TouchableOpacity style={[styles.realTimeContainer, notificationInfo.bg]} onPress={onPress}>
      <Spinner style={[margin.r5]} isVisible={true} size={24} type={'Wave'} color={"#FFFFFF"}/>
      <Text style={styles.realTimeText}>{ I18n.t('base.realtime.index.pending-requests-itemstosync') }: { itemsToSync }</Text>
    </TouchableOpacity>
  </View>
)

export const OnlineWarning = ({ onPress, itemsToSync }) => (
  <View>
    <TouchableOpacity style={[styles.realTimeContainer, notificationWarning.bg]} onPress={onPress}>
      <Spinner style={[margin.r5]} isVisible={true} size={24} type={'Wave'} color={"#FFFFFF"}/>
      <Text style={styles.realTimeText}>{ I18n.t('base.realtime.index.pending-requests-itemstosync') }: { itemsToSync } {`· Some network issues`}</Text>
    </TouchableOpacity>
  </View>
)

export const OnlineError = ({ onPress, failedItems }) => (
  <View>
    <TouchableOpacity style={[styles.realTimeContainer, notificationDanger.bg]} onPress={onPress}>
      <Icon name="exclamation-triangle" size={16} color="white" style={[margin.r10]} />
      <Text style={styles.realTimeText}>{ `Failed items: ${failedItems.length}` }</Text>
    </TouchableOpacity>
  </View>
)

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

export default {
  OnlineGood,
  OnlineRunning,
  OnlineWarning,
  OnlineError,
  OfflineGood,
  OfflinePending,
  OfflineError,
}