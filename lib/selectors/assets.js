import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { keyBy, groupBy, map, find, filter, sortBy } from 'lodash/collection';
import { uniq, concat } from 'lodash/array';
import { get, extend } from 'lodash/object';
import { map as fpMap, uniq as fpUniq, fpUniqWith, filter as fpFilter, sortBy as fpSortBy, flow } from 'lodash/fp';

const assetsSelector = state => state.assets.hotelAssets;
const virtualAssetsSelector = state => state.assets.hotelVirtualAssets;
export const durableAssetsSelector = state => state.assets.hotelDurableAssets;
const customActionsSelector = state => state.assets.hotelCustomActions;
const assetRoomsSelector = state => state.assets.hotelAssetRooms;
const roomAreasSelector = state => state.assets.hotelRoomAreas;
const activeRoomSelector = state => state.rooms.activeRoom;
const updatesInventorySelector = state => state.updates.inventory;
const rejectsInventorySelector = state => state.updates.rejections;

const getComputedAssets = (hotelAssets, hotelVirtualAssets, hotelDurableAssets, hotelCustomActions) => {
  console.log('running getComputedAssets')

  const aliases = hotelDurableAssets.reduce((pv, asset) => {
    const assetAliases = get(asset, 'aliases', []);
    assetAliases.forEach(alias => {
      if (!!alias) {
        pv.push(extend({}, asset, { name: `${alias} (${asset.name})` }));
      }
    })
    return pv;
  }, []);
  const sortedAssets = sortBy(concat(hotelAssets || [], hotelVirtualAssets || [], hotelDurableAssets || [], aliases || []), 'name');
  const indexedActions = keyBy(hotelCustomActions, action => String(action.id));

  return sortedAssets.map(asset => {
    const customActions = get(asset, 'customActions', [])
      .map(actionId =>  actionId && get(indexedActions, String(actionId)))
      .filter(action => !!action);

    return extend({}, asset, { customActions });
  });
}

const getComputedAssetsIndex = (hotelAssets) => {
  return keyBy(hotelAssets, '_id');
}

const getComputedGroupedAssetRooms = (hotelAssetRooms) => {
  return groupBy(hotelAssetRooms, 'room');
}

const getComputedAssetRoomsByActiveRoom = (hotelAssetsIndex, hotelAssetRoomsGrouped, activeRoom) => {
  return get(hotelAssetRoomsGrouped, activeRoom, []).map(ar => {
    const assetId = get(ar, 'asset');
    return extend({}, ar, { asset: get(hotelAssetsIndex, assetId)});
  });
}

const getComputedInventoryAssetsByActiveRoom = (activeAssetRooms, inventoryUpdates, inventoryRejects) => {
  if (!activeAssetRooms || !activeAssetRooms.length) {
    return [];
  }

  const roomId = get(activeAssetRooms, [0, 'room'], '');
  const roomInventoryUpdates = get(inventoryUpdates, roomId, {});
  const roomInventoryRejects = get(inventoryRejects, roomId, {});

  return flow(
    fpFilter(asset => {
      return get(asset, 'assetType') === 'stock' || get(asset, 'assetType') === 'quantity';
    }),
    fpMap((asset, index) => {
      const assetId = get(asset, '_id');
      return extend({}, asset, {
        update: get(roomInventoryUpdates, assetId, 0),
        rejects: get(roomInventoryRejects, assetId, 0),
        index
      });
    }),
    fpSortBy('asset.name')
  )(activeAssetRooms);
}

const getComputedInventoryRoomAreas = (activeInventoryAssets, hotelRoomAreas) => {
  if (!hotelRoomAreas || !hotelRoomAreas.length) {
    return [];
  }

  const indexRoomAreas = keyBy(hotelRoomAreas, '_id');

  return flow(
    fpMap('asset.roomArea'),
    fpUniq,
    fpMap(id => get(indexRoomAreas, id)),
    fpSortBy('label')
  )(activeInventoryAssets);
}

export const computedAssets = createSelector(
  [assetsSelector, virtualAssetsSelector, durableAssetsSelector, customActionsSelector],
  getComputedAssets
);

export const computedAssetsIndex = createSelector(
  [computedAssets],
  getComputedAssetsIndex
);

export const computedGroupedAssetRooms = createSelector(
  [assetRoomsSelector],
  getComputedGroupedAssetRooms
);

export const computedAssetsByActiveRoom = createSelector(
  [computedAssetsIndex, computedGroupedAssetRooms, activeRoomSelector],
  getComputedAssetRoomsByActiveRoom
);

export const computedInventoryAssetsByActiveRoom = createSelector(
  [computedAssetsByActiveRoom, updatesInventorySelector, rejectsInventorySelector],
  getComputedInventoryAssetsByActiveRoom

)

export const getAssetsByRoomId = (id) => createSelector(
  [computedAssetsIndex, computedGroupedAssetRooms, updatesInventorySelector, rejectsInventorySelector],
  (hotelAssetsIndex, hotelAssetRoomsGrouped, inventoryUpdates, inventoryRejects) => {
    const activeAssetRooms = get(hotelAssetRoomsGrouped, id, []).map(ar => {
      const assetId = get(ar, 'asset._id') || get(ar, 'asset');
      
      if (!assetId) {
        return null;
      }
      
      if (!get(hotelAssetsIndex, assetId)) {
        return null;
      }
      
      return extend({}, ar, { asset: get(hotelAssetsIndex, assetId)});
    }).filter(Boolean);

    if (!activeAssetRooms || !activeAssetRooms.length) {
      return [];
    }

    const roomId = get(activeAssetRooms, [0, 'room'], '');
    const roomInventoryUpdates = get(inventoryUpdates, roomId, {});
    const roomInventoryRejects = get(inventoryRejects, roomId, {});

    return flow(
      fpFilter(asset => {
        return get(asset, 'assetType') === 'stock' || get(asset, 'assetType') === 'quantity';
      }),
      fpMap((asset, index) => {
        const assetId = get(asset, '_id');
        return extend({}, asset, {
          update: get(roomInventoryUpdates, assetId, 0),
          rejects: get(roomInventoryRejects, assetId, 0),
          index
        });
      }),
      fpSortBy('asset.name')
    )(activeAssetRooms);
  }
)

export const computedAvailableRoomAreas = createSelector(
  [computedInventoryAssetsByActiveRoom, roomAreasSelector],
  getComputedInventoryRoomAreas
)

export const getRoomAreasByRoomId = (id) => createSelector(
  [getAssetsByRoomId(id), roomAreasSelector],
  getComputedInventoryRoomAreas
)
