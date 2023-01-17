import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilesystemStorage from 'redux-persist-filesystem-storage'
import { offlineTransform } from './offline/utils';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'

import { createTransform as createSchemasTransform } from './utils/redux-tools';

const schemasTransform = createSchemasTransform(['audit', 'audit_source', 'inspection', 'inspection_source'])
export const MAIN_BLACKLIST = [
  'rehydration',
  'overlay',
  'form',
  'filters',
  'inspectorFilters',
  'layouts',
  'modal',
  'appGlobal',
  'network',
  'roomUpdates',
  'planningUpdates',
  'tasksLayout',
  'differences',
  'outbound',
  'wifi',
  'hotelsTask',
  'roomAudit'
]

const REDUX_PERSIST = {
  active: true,
  version: '1',
  storeConfig: {
    key: 'root',
    // debug: true,
    storage: Platform.OS === 'ios' ? AsyncStorage : FilesystemStorage,
    stateReconciler: hardSet,
    debounce: Platform.OS === 'ios' ? 1000 : 5000,
    // transforms: [offlineTransform, schemasTransform],
    transforms: [schemasTransform],
    blacklist: MAIN_BLACKLIST
  }
};

export default REDUX_PERSIST;

export const configurePersist = (key) => {
  return {
    ...REDUX_PERSIST.storeConfig,
    key: `${key}-root`,
    blacklist: []
  }
}