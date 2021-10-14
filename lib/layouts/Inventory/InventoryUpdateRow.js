import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';

import { get } from 'lodash';

import {
  red,
  green,
  orange
} from 'rc-mobile-base/lib/styles';

import {
  RowCountsContainner
} from './styles';

import Swipeable from 'react-native-swipeable';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'react-native-i18n';

import checkEqual from 'rc-mobile-base/lib/utils/check-equal';

const ResetBtn = () => (
  <TouchableOpacity style={[{ backgroundColor: '#E8AC4D', height: 60, flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10 }]}>
    <Text style={{ color: 'white' }}>{ I18n.t('base.ubiquitous.reset-entry') }</Text>
  </TouchableOpacity>
)

const RejectBtn = () => (
  <TouchableOpacity style={[ red.bg, { height: 60, flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }]}>
    <Text style={{ color: 'white' }}>{ I18n.t('base.ubiquitous.reject') }</Text>
  </TouchableOpacity>
)

class InventoryUpdateRow extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !checkEqual(this.props, nextProps, 'data.update')
        || !checkEqual(this.props, nextProps, 'data.rejects');
  }

  render() {
    const { data, index, roomWithdrawals, adjustInventory, rejectInventory, resetInventory, onScroll } = this.props;
    console.log(data)
    const isUpdate = !!data.update;
    const isReject = !!data.rejects;
    const sent = get(roomWithdrawals, data._id, []);
    const sentTotal = sent.reduce((pv, i) => { pv = pv + get(i, 'withdrawal'); return pv; }, 0);
    const isSent = sentTotal !== 0;
    const count = (isFinite(Number(data.assetStatus)) ? Number(data.assetStatus) : 0)  - (data.update || 0);
    console.log(isReject)

    return (
      <Swipeable
        onSwipeStart={() => onScroll && onScroll(false)}
        onSwipeRelease={() => onScroll && onScroll(true)}
        onLeftActionRelease={() => resetInventory(data)}
        onRightActionRelease={() => rejectInventory(data)}
        rightContent={<RejectBtn />}
        leftContent={<ResetBtn />}>
        <View style={[styles.container, { backgroundColor: index % 2 ? '#F7F7F7' : '#EDEDED' }]}>
          <View style={styles.imageContainer}>
            <Image style={styles.assetImage} source={{ uri: data.asset.image }} resizeMethod='resize' />
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>{ data.asset.name }</Text>
            <RowCountsContainner>
              <Text style={[styles.labelCount, isUpdate ? styles.activeLabelCount : null]}>{ count }</Text>
              { isReject && !isSent ?
                <Text style={[styles.labelCount, red.bg]}>{ data.rejects }</Text>
                : null
              }
            </RowCountsContainner>
          </View>
          <View style={[styles.btnContainer, { backgroundColor: data.index % 2 ? '#E2E4E5' : '#D9DBDC' }, isSent && green.bg, isUpdate && orange.bg]}>
            <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustInventory(data)}>
              { isUpdate ?
                <Text style={styles.adjustmentText}>{ `-${data.update}` }</Text>
                : isSent ?
                <Text style={styles.adjustmentText}>{ sentTotal }</Text>
                :
                <Icon name="plus" size={30} color="white" />
              }
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  assetImage: {
    height: 60,
    width: 60
  },
  labelContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  labelText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4a4a4a'
  },
  labelCount: {
    marginLeft: 10,
    backgroundColor: '#3F81BA',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 1,
    color: 'white'
  },
  btnContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  adjustBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  activeLabelCount: {
    backgroundColor: 'green'
  },
  adjustmentText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '800'
  }
});

export default InventoryUpdateRow;
