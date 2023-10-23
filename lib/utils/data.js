import { AppState, InteractionManager } from 'react-native';
import moment from 'moment';
import { defer, delay } from 'lodash/function';

import AuthActions from '../actions/auth';
import RoomsActions from '../actions/rooms';
import UsersActions from '../actions/users';
import AssetsActions from '../actions/assets';
import GlitchesActions from '../actions/glitches';
import ChecklistsActions from '../actions/checklists';
import BackendActions from '../actions/backend';
import { Audits, AuditSources, Inspections, InspectionSources } from '../models';

const CHECK_TIME = 2 * 60 * 1000;
const LONG_STALE_TIME = 60 * 240 * 1000;
const PAUSE_TIME = 0;

class Data {
  constructor(dispatch, options = {}) {
    this.dispatch = dispatch;
    this.options = options;
    this.isActive = false;
    this.lastInactive = null;
  }

  activate(userId, hotelId) {
    if (!userId || !hotelId) {
      return;
    }

    this.isActive = true;
    this.load();

    this.timer = setInterval(() => {
      this._runCheck();
    }, CHECK_TIME);
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  deactivate() {
    this.isActive = false;
    clearInterval(this.timer);
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleAppStateChange(currentAppState) {
    if (currentAppState === 'background') {
      this.lastInactive = moment().unix();
    }

    if (currentAppState === 'active') {
      const currentTs = moment().unix();
      if (currentTs - this.lastInactive > PAUSE_TIME) {
        this._forceRun();
      }
      this.lastInactive = null;
    }
  }

  _forceRunForHotelChange() {
    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.roomsFetch())
      this.dispatch(RoomsActions.breakfastFetch())
      this.dispatch(RoomsActions.calendarFetch())
      this.dispatch(RoomsActions.planningsFetch())
      this.dispatch(RoomsActions.futurePlanningsFetch())
      this.dispatch(RoomsActions.tasksFetch())
      this.dispatch(RoomsActions.historyFetch())
      this.dispatch(RoomsActions.lostFetch());
      this.dispatch(RoomsActions.foundFetch());
      this.dispatch(GlitchesActions.glitchesOptionsFetch());
    })
  }

  _forceRun() {
    if (!this.isActive) return;
    const { options } = this;
    InteractionManager.runAfterInteractions(() => {
      if (!options.disableRooms) {
        this.dispatch(RoomsActions.roomsFetch())
      }
      if (!options.disableBreakfast) {
        this.dispatch(RoomsActions.breakfastFetch())
      }
      if (!options.disableCalendar) {
        this.dispatch(RoomsActions.calendarFetch())
      }
      if (!options.disablePlannings) {
        this.dispatch(RoomsActions.planningsFetch())
      }
      if (!options.disableFuturePlannings) {
        this.dispatch(RoomsActions.futurePlanningsFetch())
      }
      if (!options.disableTasks) {
        this.dispatch(RoomsActions.tasksFetch())
      }
      if (!options.disableHistory) {
        this.dispatch(RoomsActions.historyFetch())
      }
      if (!options.disableLF) {
        this.dispatch(RoomsActions.lostFetch());
        this.dispatch(RoomsActions.foundFetch());
      }
      if (!options.disableGlitchOptions) {
        this.dispatch(GlitchesActions.glitchesOptionsFetch());
      }
    })
  }

  _runCheck() {
    if (!this.isActive) return;
    const { options } = this;

    InteractionManager.runAfterInteractions(() => {
      if (!options.disableRooms) {
        this.dispatch(BackendActions.roomsBackend());
      }
      if (!options.disableCalendar) {
        this.dispatch(BackendActions.calendarBackend());
      }
      if (!options.disablePlannings) {
        this.dispatch(BackendActions.planningsBackend());
      }
      if (!options.disableFuturePlannings) {
        this.dispatch(BackendActions.futurePlanningsBackend());
      }
      if (!options.disableTasks) {
        this.dispatch(BackendActions.tasksBackend());
      }
      if (!options.disableHistory) {
        this.dispatch(BackendActions.historyBackend());
      }

      if (!options.disableLF) {
        this.dispatch(RoomsActions.lostFetch());
        this.dispatch(RoomsActions.foundFetch());
      }
    })
  }

  load() {
    const { options } = this;
    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AuthActions.hotelFetch());

      if (!options.disableRooms) {
        // this.dispatch(BackendActions.roomsBackend());
        this.dispatch(RoomsActions.roomsFetch())
      }
      if (!options.disableBreakfast) {
        this.dispatch(RoomsActions.breakfastFetch())
      }
      if (!options.disableFloors) {
        this.dispatch(BackendActions.floorsBackend());
      }
      if (!options.disableRoomStatuses) {
        this.dispatch(BackendActions.roomStatusesBackend());
      }
      if (!options.disableRoomHousekeepings) {
        this.dispatch(BackendActions.roomHousekeepingsBackend());
      }
      if (!options.disableRoomCategories) {
        this.dispatch(BackendActions.roomCategoriesBackend());
      }
      if (!options.disableCalendar) {
        this.dispatch(BackendActions.calendarBackend());
      }
      if (!options.disablePlannings) {
        this.dispatch(BackendActions.planningsBackend());
      }
      if (!options.disableFuturePlannings) {
        this.dispatch(BackendActions.futurePlanningsBackend());
      }
      if (!options.disablePlanningsRunner) {
        this.dispatch(RoomsActions.planningsRunnerFetch());
      }
      if (!options.disablePlanningsNight) {
        this.dispatch(RoomsActions.planningsNightFetch());
      } if (!options.disableInspectionClean) {
        this.dispatch(BackendActions.roomInspectionCleanBackend());
      }
      if (!options.disableRoomNotes) {
        this.dispatch(BackendActions.roomNotesBackend());
      }
      if (!options.disableRoomMessages) {
        this.dispatch(BackendActions.roomMessagesBackend());
      }
      if (!options.disableHotelsTask) {
        this.dispatch(BackendActions.availHotelsTaskBackend());
      }
      if (!options.disableAvailHotelsRooms) {
        this.dispatch(BackendActions.availHotelsRoomsBackend());
      }
      if (!options.disableCatalogs) {
        this.dispatch(BackendActions.catalogsBackend());
      }
      if (!options.disableTasks) {
        // this.dispatch(BackendActions.tasksBackend());
        this.dispatch(RoomsActions.tasksFetch())
      }
      if (!options.disableFutureTasks) {
        this.dispatch(RoomsActions.futureTasksFetch())
      }
      if (!options.disableHistory) {
        this.dispatch(BackendActions.historyBackend());
      }
      if (!options.disableUsers) {
        this.dispatch(BackendActions.usersBackend());
      }
      if (!options.disableGroups) {
        this.dispatch(BackendActions.groupsBackend());
      }
      if (!options.disableAssets) {
        this.dispatch(BackendActions.assetsBackend());
      }
      if (!options.disableVirtualAssets) {
        this.dispatch(BackendActions.virtualAssetsBackend());
      }
      if (!options.disableDurableAssets) {
        this.dispatch(BackendActions.durableAssetsBackend());
      }
      if (!options.disableAssetRooms) {
        this.dispatch(BackendActions.assetRoomsBackend());
      }
      if (!options.disableRoomAreas) {
        this.dispatch(BackendActions.roomAreasBackend());
      }
      if (!options.disableCustomActions) {
        this.dispatch(BackendActions.customActionsBackend());
      }
      if (!options.disabledInventoryWithdrawal) {
        this.dispatch(BackendActions.inventoryWithdrawalBackend());
      }
      if (!options.disableGlitches) {
        this.dispatch(BackendActions.glitchesBackend());
        // this.dispatch(BackendActions.glitchesOptionsBackend());
      }
      if (!options.disableSublocations) {
        this.dispatch(BackendActions.sublocationsBackend());
      }

      if (!options.disableAudits) {
        this.dispatch(RoomsActions.auditsFetch())

        // this.dispatch(Audits.load.tap())
        // this.dispatch(AuditSources.load.tap())
        // this.dispatch(Inspections.load.tap())
        // this.dispatch(InspectionSources.load.tap())
      }

      if (!options.disableChecklists) {
        // this.dispatch(ChecklistsActions.checklistsFetch());
        // this.dispatch(ChecklistsActions.activeChecklistsFetch());
      }

      if (!options.disableLF) {
        // this.dispatch(RoomsActions.lostFetch());
        this.dispatch(RoomsActions.foundFetch());
      }
      if (!options.disableGlitchOptions) {
        this.dispatch(GlitchesActions.glitchesOptionsFetch());
      }
      if (options.isHost) {
        this.dispatch(RoomsActions.guestBookFetch());
        this.dispatch(RoomsActions.planningsHostInFetch());
        this.dispatch(RoomsActions.planningsHostOutFetch());
      }
    });
  }
}

export default Data;
