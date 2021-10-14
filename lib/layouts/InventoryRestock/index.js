import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet
} from 'react-native';
import ListView from 'rc-mobile-base/lib/components/ListView';
import Icon from 'react-native-vector-icons/FontAwesome';

import { groupBy } from 'lodash/collection';
import { get, has } from 'lodash/object';

import { connect } from 'react-redux';

import { computedHotelRooms } from 'rc-mobile-base/lib/selectors/rooms';
import UpdatesActions from 'rc-mobile-base/lib/actions/updates';
import AssetsActions from 'rc-mobile-base/lib/actions/assets';
import SectionHeading from 'rc-mobile-base/lib/components/section-heading';
import WithdrawalRow from './WithdrawalRow';

class InventoryRestock extends Component {

  componentWillMount() {
    this.props.fetchWithdrawals();
  }

  _handleRestock(assetRoomId, id) {
    // console.log(assetRoomId, id);
    this.props.restockInventory(assetRoomId, id);
  }

  _renderRow(room) {
    const withdrawals = room.items.map((item, index) => {
      return (
        <WithdrawalRow
          key={get(item, 'id')}
          id={get(item, 'id')}
          asset={get(item, 'asset_name')}
          assetId={get(item, 'asset_id')}
          index={index}
          withdrawal={get(item, 'withdrawal')}
          isReplaced={get(item, 'is_restocked')}
          handleRestock={this._handleRestock.bind(this)}
          />
      )
    });

    return (
      <View>
        <SectionHeading style={{ marginTop: 15, paddingLeft: 10 }}>{ room.name }</SectionHeading>
        { withdrawals }
      </View>
    )
  }

  render() {
    const { withdrawals, rooms } = this.props;
    const groupedWithdrawals = groupBy(withdrawals, 'room_id');
    const RestocksByRoom = rooms.map(room => {
      const roomId = get(room, '_id');
      if (!has(groupedWithdrawals, roomId)) {
        return null;
      }

      return {
        name: get(room, 'name'),
        items: get(groupedWithdrawals, roomId, [])
      }
    })
    .filter(room => !!room);

    return (
      <ScrollView style={styles.container}>
        <ListView
          data={RestocksByRoom}
          renderRow={this._renderRow.bind(this)}
          />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: '#F7F7F7'
  },
});

const mapStateToProps = (state) => {
  return {
    withdrawals: state.assets.hotelInventoryWithdrawals,
    rooms: computedHotelRooms(state),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    restockInventory: (assetRoomId, id) => dispatch(UpdatesActions.restockInventory({ assetRoomId, id })),
    fetchWithdrawals: () => dispatch(AssetsActions.inventoryWithdrawalFetch()),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InventoryRestock);
