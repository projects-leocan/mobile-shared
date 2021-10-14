import rehydration from './rehydration';
import auth from './auth';
import overlay from './overlay';
import routes from './routes';
import rooms from './rooms';
import assets from './assets';
import users from './users';
import updates from './updates';
import glitches from './glitches';
import checklists from './checklists';
import filters from './filters';
import backend from './backend';
import lostFound from './lost-found';
import planningUpdates from './planning-updates';
import roomUpdates from './room-updates';
import differences from './differences';
import outbound from './outbound';

import { modalReducer } from '../modal';
import { reducer as networkReducer } from '../network';

import tasksLayout from '../layouts/Tasks/reducer';

export default {
  // rehydration,
  auth,
  overlay,
  routes,
  rooms,
  assets,
  users,
  updates,
  glitches,
  checklists,
  backend,
  lostFound,
  filters,
  planningUpdates,
  roomUpdates,
  differences,
  modal: modalReducer,
  network: networkReducer,
  tasksLayout,
  outbound
};
