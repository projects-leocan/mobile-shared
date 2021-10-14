import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  InteractionManager,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';

import ListView from 'rc-mobile-base/lib/components/ListView';
import Button from 'rc-mobile-base/lib/components/Button';
import { filter, map, keyBy } from 'lodash/collection';
import { get, keys, mapKeys } from 'lodash/object';
import { defer, delay } from 'lodash/function';
import { isEmpty } from 'lodash/lang';

import { connect } from 'react-redux';

import { getRoomById } from 'rc-mobile-base/lib/selectors/rooms';
import { getAssetsByRoomId, getRoomAreasByRoomId } from 'rc-mobile-base/lib/selectors/assets';
import { getWithdrawalsIndexById } from './selectors';
import UpdatesActions from 'rc-mobile-base/lib/actions/updates';
import DropDownMenu from 'rc-mobile-base/lib/components/DropDownMenu';

import InventoryUpdateRow from './InventoryUpdateRow';
import InventoryArea from './InventoryArea';
import SearchSubheader from 'rc-mobile-base/lib/components/SearchSubheader';
import ConfirmationModal from './ConfirmationModal';

import { Back } from '../../navigation/helpers';

import {
  margin,
  padding,
  flx1,
  white,
  red
} from 'rc-mobile-base/lib/styles';

class InventoryLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeRoomArea: null,
      searchQuery: null,
      isConfirmationShown: false,
      confirmationItems: []
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({
      confirmBack: this._handleBack,
    });
  }

  componentWillUnmount() {
    this.props.flushInventory(this.props.navigation.state.params.roomId)
  }

  _handleBack = () => {
    const { isConfirmationNeeded, inventoryUpdates, inventory, navigation: { state: { params: { roomId }}}} = this.props;

    if (!isConfirmationNeeded) {
      return this.props.navigation.goBack();
    }
    
    if (isEmpty(inventoryUpdates) || isEmpty(get(inventoryUpdates, roomId))) {
      return this.props.navigation.goBack();
    }

    const roomUpdates = get(inventoryUpdates, roomId);

    const confirmationItems = inventory.map(asset => {
      const assetId = get(asset, '_id');
      return get(roomUpdates, assetId) && {
        image: get(asset, 'asset.image'),
        name: get(asset, 'asset.name'),
        change: get(roomUpdates, assetId),
        isWithdrawal: true
      }
    }).filter(Boolean);
    
    this.setState({ isConfirmationShown: true, confirmationItems })
  }

  _handleConfirm = () => {
    console.log('confirmed!')
    this.props.navigation.goBack();
  }

  _updateSearch = (t) => this.setState({ searchQuery: t })

  _adjustInventory = (asset) => {
    const { room: roomId, _id: assetRoomId } = asset;
    InteractionManager.runAfterInteractions(() => {
      this.props.adjustInventory(roomId, assetRoomId);
    })
  }

  _rejectInventory = (asset) => {
    const { room: roomId, _id: assetRoomId } = asset;
    InteractionManager.runAfterInteractions(() => {
      this.props.rejectInventory(roomId, assetRoomId);
    })
  }

  _resetInventory = (asset) => {
    const { room: roomId, _id: assetRoomId } = asset;
    this.props.resetInventory(roomId, assetRoomId);
  }

  _handleScroll = (scrollEnabled) => {
    this.setState({ scrollEnabled });
  }

  _handleSelectArea = (area) => this.setState({ activeRoomArea: area })
  _handleCloseArea = () => this.setState({ activeRoomArea: null })

  render() {
    const { inventory, roomAreas } = this.props;
    const { activeRoomArea, searchQuery } = this.state;
    const cleanQuery = searchQuery && searchQuery.toLowerCase();
    const filteredInventory = filter(inventory, asset => get(asset, 'asset.roomArea') === get(activeRoomArea, '_id'))
      .filter(asset => {
        if (!cleanQuery) { return true; }
        
        return get(asset, 'asset.name').toLowerCase().includes(cleanQuery);
      });

    return (
      <View style={styles.container}>
        { activeRoomArea ?
          <View style={[flx1]}>
            <SearchSubheader
              searchQuery={this.state.searchQuery}
              updateQuery={this._updateSearch}
              style={{
                container: { ...white.bg, ...padding.t10 }
              }}
              >
              { I18n.t('base.inventory.index.search-items') }
            </SearchSubheader>
            <View style={[flx1]}>
              <ListView
                data={filteredInventory}
                renderRow={(rowData, secId, index) => 
                  <InventoryUpdateRow
                    data={rowData}
                    index={index}
                    roomWithdrawals={this.props.roomWithdrawals}
                    adjustInventory={this._adjustInventory}
                    rejectInventory={this._rejectInventory}
                    resetInventory={this._resetInventory}
                    onScroll={this._handleScroll}
                    />
                }
                />
            </View>
            <Button style={[{ borderRadius: 0 }, red.bg]} onPress={this._handleCloseArea}>
              <Text style={[white.text]}>{ I18n.t('base.inventory.index.close-area').toUpperCase() }</Text>
            </Button>
          </View>
          :
          <ListView
            data={roomAreas.filter(area => !!area)}
            renderRow={(rowData, secId, rowIndex) => <InventoryArea area={rowData} onPress={this._handleSelectArea} />}
            />
        }

        <ConfirmationModal
          isShown={this.state.isConfirmationShown}
          items={this.state.confirmationItems}
          onCancel={() => this.setState({ isConfirmationShown: false })}
          onConfirm={this._handleConfirm}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    backgroundColor: '#F7F7F7'
  },
});

const mapStateToProps = (state, props) => {
  const roomId = props.navigation.state.params.roomId
  const isAttendantApp = get(props, 'screenProps.isAttendantApp') || false;
  
  return {
    room: getRoomById(roomId)(state),
    inventory: getAssetsByRoomId(roomId)(state),
    roomAreas: getRoomAreasByRoomId(roomId)(state),
    inventoryUpdates: state.updates.inventory,
    inventoryRejections: state.updates.rejections,
    roomWithdrawals: getWithdrawalsIndexById(roomId)(state),
    isConfirmationNeeded: isAttendantApp ? get(state, 'auth.config.isRequireAttendantInventoryConfirmation', false) : get(state, 'auth.config.isRequireRunnerInventoryConfirmation', false)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    flushInventory: (roomId) => dispatch(UpdatesActions.flushInventory({ roomId })),
    rejectInventory: (roomId, assetRoomId) => dispatch(UpdatesActions.rejectInventory({ roomId, assetRoomId })),
    adjustInventory: (roomId, assetRoomId) => dispatch(UpdatesActions.adjustInventory({ roomId, assetRoomId })),
    resetInventory: (roomId, assetRoomId) => dispatch(UpdatesActions.resetInventory({ roomId, assetRoomId })),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InventoryLayout);
