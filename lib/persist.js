import { Platform, AsyncStorage } from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import FilesystemStorage from 'redux-persist-filesystem-storage'
import { offlineTransform } from './offline/utils';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'

import { createTransform as createSchemasTransform } from './utils/redux-tools';

const schemasTransform = createSchemasTransform(['audit', 'audit_source', 'inspection', 'inspection_source'])

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
    blacklist: [
      'rehydration',
      'overlay',
      'form',
      'filters',
      'layouts',
      'modal',
      'appGlobal',
      'network',
      'roomUpdates',
      'planningUpdates',
      'tasksLayout',
      'differences',
      'outbound',
      'wifi'
    ]
  }
};

export default REDUX_PERSIST;
