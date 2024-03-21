import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  InteractionManager,
  StyleSheet,
  FlatList
} from 'react-native';
import I18n from 'react-native-i18n';

import ListView from 'rc-mobile-base/lib/components/ListView';
import Button from 'rc-mobile-base/lib/components/Button';
import { filter, map, keyBy } from 'lodash/collection';
import { get, keys, mapKeys } from 'lodash/object';
import { defer, delay } from 'lodash/function';
import { isEmpty } from 'lodash/lang';
import { flatten } from 'lodash';

import { connect } from 'react-redux';

import { tokenSelector, hotelGroupKeySelector, apiSelector } from 'rc-mobile-base/lib/selectors/auth';
import { getRoomById } from 'rc-mobile-base/lib/selectors/rooms';
import { getAssetsByRoomId, getRoomAreasByRoomId } from 'rc-mobile-base/lib/selectors/assets';
import { getWithdrawalsIndexById } from './selectors';
import UpdatesActions from 'rc-mobile-base/lib/actions/updates';
import DropDownMenu from 'rc-mobile-base/lib/components/DropDownMenu';

import { externalAPIService } from "rc-mobile-base/lib/utils";


import InventoryUpdateRow from './InventoryUpdateRow';
import InventoryArea from './InventoryArea';
import SearchSubheader from 'rc-mobile-base/lib/components/SearchSubheader';
import ConfirmationModal from './ConfirmationModal';
import _ from 'lodash';
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
      confirmationItems: [],
      inventorySets: []
    }
  }

  componentDidMount() {
    this.getRoomInventory()
  }



  getRoomInventory = async () => {
    const { token, hotel_group_key, baseUrl, room } = this.props;
    const roomId = get(room, 'id', null);
    const hotelId = get(room, 'hotelId', null);
    const roomIds = [roomId]
    const payload = {
      token,
      hotel_group_key,
      baseUrl,
      roomIds,
      hotelId
    }
    // const inventorySets1 = await externalAPIService.getInventorySetAndAssets(payload);
    const inventorySets = await externalAPIService.getMinibarInventory(payload);
    // const mapMinibarInventoryData = map(inventorySets1, function (obj) {
    //   const assets = map(get(obj, 'assets', []), function (asset) {
    //     return { ...asset, isUpdate: false, update: 0 }
    //   })
    //   return { ...obj, isSetSelected: false, assets: assets }
    // })

    const mapInventoryMinibarData = map(inventorySets, function (obj) {
      const minibarAssets = map(get(obj, 'minibarAssets', []), function (minibarAssets) {
        return { ...minibarAssets, isUpdate: false, update: 0 }
      })
      return { ...obj, isSetSelected: false, assets: minibarAssets, categoryName:"Minibar", id:"00000000-0000-0000-0000-000000000000" }
    })

    let groupedAssets
    let categoryName 
    let id
    map(inventorySets, function (obj) {
       groupedAssets = map(get(obj, 'groupedAssets', []), function (groupedAsset) {
          const regularAssets = !_.isEmpty(groupedAsset.regularAssets) && groupedAsset.regularAssets.map((regularAsset) => {
            categoryName = groupedAsset.categoryName 
            id = groupedAsset.categoryId
              return { ...regularAsset, isUpdate: false, update: 0};
          });
          return {assets:regularAssets, isSetSelected: false, categoryName: categoryName, id: id};
      });
      
  });
    if (!isEmpty(inventorySets)) {
      // this.setState({ inventorySets: mapMinibarInventoryData})
      this.setState({ inventorySets: [...mapInventoryMinibarData , ...groupedAssets]})
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({
      confirmBack: this._handleBack,
    });
  }

  componentWillUnmount() {
    const { inventorySets } = this.state;
    const { room, inventoryAssetConsumationUpdate } = this.props;

    const roomId = get(room, 'id', null);
    const hotelId = get(room, 'hotelId', null);

    const filterSelectedSet = filter(inventorySets, ['isSetSelected', true]);

    const mapScheduledAssets = map(filterSelectedSet, function (sets) {
      const assetSetId = get(sets, 'id', null);
      const filterScheduledSetAssets = filter(get(sets, 'assets', []), ['isUpdate', true]);
      const mapScheduledSetAssets = map(filterScheduledSetAssets, function (asset) {
        return {
          assetSetId: assetSetId,
          assetId: get(asset, 'id', null),
          quantity: get(asset, 'update', 0)
        }
      })

      return mapScheduledSetAssets
    })

    const scheduledAssetsPayload = {
      hotelId: hotelId,
      roomId: roomId,
      scheduledAssets: flatten(mapScheduledAssets)
    }

    if (!isEmpty(flatten(mapScheduledAssets))) {
      inventoryAssetConsumationUpdate(scheduledAssetsPayload)
    }
    // this.props.flushInventory(this.props.navigation.state.params.roomId)

  }

  _handleBack = () => {
    const { isConfirmationNeeded, inventoryUpdates, inventory, navigation: { state: { params: { roomId } } } } = this.props;
    const { inventorySets } = this.state;

    const updatedInventory = get(inventoryUpdates, 'updateInventoryData[0].assets', []).filter((item) => item.isUpdate == true);

    if (isConfirmationNeeded) {
      return this.props.navigation.goBack();
    }

    // if (isEmpty(updatedInventory) || isEmpty(get(updatedInventory, roomId))) {
    //   return this.props.navigation.goBack();
    // }

    if (isEmpty(updatedInventory)) {
      return this.props.navigation.goBack();
    }

    const confirmationItems = updatedInventory.map((asset, index) => {
      return {
        image: get(asset, 'imageUrl'),
        name: get(asset, 'name'),
        change: get(asset, 'update'),
        isWithdrawal: true
      }
    });

    // const roomUpdates = get(inventoryUpdates, roomId);

    // const confirmationItems = inventory.map(asset => {
    //   const assetId = get(asset, '_id');
    //   return get(roomUpdates, assetId) && {
    //     image: get(asset, 'asset.image'),
    //     name: get(asset, 'asset.name'),
    //     change: get(roomUpdates, assetId),
    //     isWithdrawal: true
    //   }
    // }).filter(Boolean);

    this.setState({ isConfirmationShown: true, confirmationItems })
  }

  _handleConfirm = () => {
    this.props.navigation.goBack();
    this.props.resetInventory();
  }

  _updateSearch = (t) => this.setState({ searchQuery: t })

  updateInventoryList = (setId, setassetId) => {
    const { inventorySets } = this.state;

    const updateInventoryData = inventorySets.map((obj) => {
      if (get(obj, 'id', null) === setId) {
        const mapObjAsset = get(obj, 'assets', []);
        const updateSetAsset = mapObjAsset.map((assets) => {
          // const updateSetAsset = map(mapObjAsset, function (assets) {
          if (get(assets, 'id', null) === setassetId) {
            return { ...assets, isUpdate: true, update: (get(assets, 'update', 0) + 1) }
          } else {
            return assets
          }
        })

        const areaUpdatedInventory = { ...obj, isSetSelected: true, assets: updateSetAsset }
        this.setState({ activeRoomArea: areaUpdatedInventory })
        return areaUpdatedInventory
      } else {
        return obj
      }
    })
    this.setState({ inventorySets: updateInventoryData })
  }

  _adjustInventory = (activeRoomArea, asset) => {
    const { inventorySets } = this.state;
    const { room } = this.props;
    const setId = get(activeRoomArea, 'id', null);
    const setassetId = get(asset, 'id', null);
    const roomId = get(room, 'id', null);

    const updateInventoryData = inventorySets.map((obj) => {
      if (get(obj, 'id', null) === setId) {
        const mapObjAsset = get(obj, 'assets', []);
        const updateSetAsset = mapObjAsset.map((assets) => {
          // const updateSetAsset = map(mapObjAsset, function (assets) {
          if (get(assets, 'id', null) === setassetId) {
            return { ...assets, isUpdate: true, update: (get(assets, 'update', 0) + 1) }
          } else {
            return assets
          }
        })

        const areaUpdatedInventory = { ...obj, isSetSelected: true, assets: updateSetAsset }
        this.setState({ activeRoomArea: areaUpdatedInventory })
        return areaUpdatedInventory
      } else {
        return obj
      }     
    })

    this.props.adjustInventory(roomId, setassetId, updateInventoryData)
    this.setState({ inventorySets: updateInventoryData })
  }

  _rejectInventory = (asset) => {
    const { room: roomId, _id: assetRoomId } = asset;
    InteractionManager.runAfterInteractions(() => {
      this.props.rejectInventory(roomId, assetRoomId);
    })
  }

  _resetInventory = (activeRoomArea, asset) => {
    // const { room: roomId, _id: assetRoomId } = asset;
    // this.props.resetInventory(roomId, assetRoomId);
    
    const { inventorySets } = this.state;
    const { room } = this.props;
    const setId = get(activeRoomArea, 'id', null);
    const setassetId = get(activeRoomArea, 'id', null);
    const roomId = get(room, 'id', null);

    const updateInventoryData = inventorySets.map((obj) => {
        const mapObjAsset = get(obj, 'assets', []);
      const updateSetAsset = mapObjAsset.map((assets) => {
        if (get(assets, 'id', null) === setassetId) {
          return { ...assets, isUpdate: false, update: 0 }
        }
         else{
          return assets
         }
      })

      const areaUpdatedInventory = { ...obj, isSetSelected: true, assets: updateSetAsset }
      this.setState({ activeRoomArea: areaUpdatedInventory })
      return areaUpdatedInventory
    })
    this.props.adjustInventory(roomId, setassetId, updateInventoryData)
    this.setState({ inventorySets: updateInventoryData })
  }

  _handleScroll = (scrollEnabled) => {
    this.setState({ scrollEnabled });
  }

  _handleSelectArea = (area) => this.setState({ activeRoomArea: area })
  // _handleCloseArea = () => { this.setState({ activeRoomArea: null }), this._handleBack() }
  _handleCloseArea = () => { this._handleBack() }

  render() {
    const { inventory, roomAreas, room } = this.props;
    const { activeRoomArea, searchQuery, inventorySets } = this.state;
    const cleanQuery = searchQuery && searchQuery.toLowerCase();
    const areaAsset = get(activeRoomArea, 'assets', [])
    const filteredInventory = get(activeRoomArea, 'assets', []).filter(asset => {
      if (!cleanQuery) { return true; }

      return get(asset, 'name').toLowerCase().includes(cleanQuery);
    });

    return (
      <View style={styles.container}>
        {activeRoomArea ?
          <View style={[flx1]}>
            <SearchSubheader
              searchQuery={this.state.searchQuery}
              updateQuery={this._updateSearch}
              style={{
                container: { ...white.bg, ...padding.t10 }
              }}
            >
              {I18n.t('base.inventory.index.search-items')}
            </SearchSubheader>
            <View style={[flx1]}>
              <FlatList
                data={filteredInventory}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                  <InventoryUpdateRow
                    data={item}
                    index={index}
                    activeRoomArea={activeRoomArea}
                    roomWithdrawals={this.props.roomWithdrawals}
                    adjustInventory={this._adjustInventory}
                    rejectInventory={this._rejectInventory}
                    resetInventory={this._resetInventory}
                    onScroll={this._handleScroll}
                  />}
              />
            </View>
            <Button style={[{ borderRadius: 0 }, red.bg]} onPress={this._handleCloseArea}>
              <Text style={[white.text]}>{I18n.t('base.inventory.index.close-area').toUpperCase()}</Text>
            </Button>
          </View>
          :
          <FlatList
            data={inventorySets}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => <InventoryArea area={item} onPress={this._handleSelectArea} />}
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
    isConfirmationNeeded: isAttendantApp ? get(state, 'auth.config.isRequireAttendantInventoryConfirmation', false) : get(state, 'auth.config.isRequireRunnerInventoryConfirmation', false),
    token: tokenSelector(state),
    hotel_group_key: hotelGroupKeySelector(state),
    baseUrl: apiSelector(state)
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    flushInventory: (roomId) => dispatch(UpdatesActions.flushInventory({ roomId })),
    rejectInventory: (roomId, assetRoomId) => dispatch(UpdatesActions.rejectInventory({ roomId, assetRoomId })),
    adjustInventory: (roomId, assetRoomId, updateInventoryData) => dispatch(UpdatesActions.adjustInventory({ roomId, assetRoomId, updateInventoryData })),
    resetInventory: (roomId, assetRoomId) => dispatch(UpdatesActions.resetInventory({ roomId, assetRoomId })),
    inventoryAssetConsumationUpdate: (assetConsumationPayload) => dispatch(UpdatesActions.inventoryAssetConsumationUpdate(assetConsumationPayload)),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InventoryLayout);
