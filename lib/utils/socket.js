import { AppState, InteractionManager } from 'react-native';
import Pusher from 'pusher-js/react-native';
import { get } from 'lodash/object';
import debounce from 'lodash/debounce';

import AuthActions from '../actions/auth';
import RoomsActions from '../actions/rooms';
import UsersActions from '../actions/users';
import AssetsActions from '../actions/assets';
import GlitchesActions from '../actions/glitches';
import { Actions as NetworkActions } from '../network';
import { Actions as OfflineActions } from '../offline';
import { Audits } from 'rc-mobile-base/lib/models';

const API_KEY = '02750edc36b43c0110a3';

class Socket {
  constructor(dispatch, options) {
    this.dispatch = dispatch;
    this.isActive = false;

    this.isEnableRooms = get(options, 'isEnableRooms', true);
    this.isEnableFloors = get(options, 'isEnableFloors', true);
    this.isEnableRoomStatuses = get(options, 'isEnableRoomStatuses', true);
    this.isEnableRoomHousekeepings = get(options, 'isEnableRoomHousekeepings', true);
    this.isEnablePlanning = get(options, 'isEnablePlanning', true);
    this.isEnableCalendar = get(options, 'isEnableCalendar', true);
    this.isEnableRoomNotes = get(options, 'isEnableRoomNotes', true);
    this.isEnableCatalogs = get(options, 'isEnableCatalogs', true);
    this.isEnableTasks = get(options, 'isEnableTasks', true);
    this.isEnableAssets = get(options, 'isEnableAssets', true);
    this.isEnableVirtualAssets = get(options, 'isEnableVirtualAssets', true);
    this.isEnableRoomAreas = get(options, 'isEnableRoomAreas', true);
    this.isEnableCustomActions = get(options, 'isEnableCustomActions', true);
    this.isEnableAssetRooms = get(options, 'isEnableAssetRooms', true);
    this.isEnableInventoryWithdrawal = get(options, 'isEnableInventoryWithdrawal', true);
    this.isEnableUsers = get(options, 'isEnableUsers', true);
    this.isEnableGroups = get(options, 'isEnableGroups', true);
    this.isEnableGlitches = get(options, 'isEnableGlitches', true);
    this.isEnableWSBlock = get(options, 'isEnableWSBlock', false);
    this.isEnableHostPlanning = get(options, 'isEnableHostPlanning', false);
    this.isEnableConfig = get(options, 'isEnableConfig', true);
    this.isEnableLF = get(options, 'isEnableLF', false);
    this.isEnableAudits = get(options, 'isEnableAudits', false);

    this._debounceRoomUpdateLong = debounce(() => {
      this.dispatch(RoomsActions.roomsFetch())
    }, 5000)
    this._debounceRoomUpdateShort = debounce(() => {
      this.dispatch(RoomsActions.roomsFetch())
    }, 1000)
    this._debounceHost = debounce(() => {
      this.dispatch(RoomsActions.planningsHostInFetch());
      this.dispatch(RoomsActions.planningsHostOutFetch());
      if (options.hostActions) {
        this.dispatch(options.hostActions.fetchBookings(this.hotelId));
      }
    }, 2000);

    // this._debounceTaskUpdateLong = debounce(() => {
    //   this.dispatch(RoomsActions.roomsFetch())
    // }, 5000)
    // this._debounceTaskUpdateShort = debounce(() => {
    //   this.dispatch(RoomsActions.roomsFetch())
    // }, 1000)
  }

  activate(userId, hotelId) {
    if (!userId || !hotelId) {
      return;
    }

    const pusher = new Pusher(API_KEY, { cluster: 'mt1' });
    const connection = pusher.connection;

    connection.bind('connected', this._handlePusherConnected, this)
    connection.bind('disconnected', this._handlePusherDisconnected, this)

    const channel = pusher.subscribe(hotelId);

    channel.bind('basic_room_update', this._handleRoomUpdate, this);
    channel.bind('hotel_room_update', this._handleRoomUpdate, this);
    channel.bind('hotel_room', this._handleRoomUpdate, this);
    channel.bind('update', this._handleRoomUpdate, this);
    
    channel.bind('hotel_config', this._handleHotelConfig, this);

    channel.bind('hotel_floor', this._handleFloor, this);

    channel.bind('room_note', this._handleRoomNote, this);
    // channel.bind('lost_found', this._handleLostFound, this);
    channel.bind('hotel_calendar', this._handleCalendar, this);
    channel.bind('hotel_catalog', this._handleCatalog, this);
    channel.bind('hotel_glitch', this._handleGlitch, this);

    channel.bind('hotel_planning', this._handlePlanning, this);
    channel.bind('attendant_planning', this._handlePlanning, this);
    channel.bind('attendant_planning_night', this._handlePlanningNight, this);
    channel.bind('runner_planning', this._handlePlanningRunner, this);
    // channel.bind('host_planning', this._handlePlanningHost, this);

    channel.bind('hotel_task', this._handleTask, this);
    channel.bind('hotel_task_schedule', this._handleTaskSchedule, this);
    channel.bind('hotel_task_schedule_block', this._handleTaskScheduleBlock, this);

    channel.bind('hotel_asset', this._handleAsset, this);
    channel.bind('hotel_virtual_asset', this._handleVirtualAsset, this);
    channel.bind('hotel_asset_one', this._handleAsset, this);
    channel.bind('hotel_virtual_asset_one', this._handleVirtualAsset, this);
    channel.bind('asset_room', this._handleAssetRoom, this);
    channel.bind('hotel_custom_actions', this._handleCustomAction, this);

    channel.bind('hotel_user', this._handleUsers, this);
    channel.bind('host_planning', this._handleHostPlanning, this);
    channel.bind('lost_found', this._handleLF, this);
    channel.bind('audit_create', this._handleAuditCreate, this);

    // channel.bind('attendant_planning_night', this._handlePlanningNight, this);
    // channel.bind('general_maintenance', this._handleGeneralMaintenance, this);
    channel.bind('hotel_inventory', this._handleInventory, this);
    // channel.bind('asset_events', this._handle, this);

    this.isActive = true;
    this.userId = userId;
    this.hotelId = hotelId;

    this.pusher = pusher;
    this.channel = channel;
    this.connection = connection;
  }

  deactivate() {
    this.channel.unbind_all
      ? this.channel.unbind_all()
      : this.channel.unbind();

    this.connection.unbind_all
      ? this.connection.unbind_all()
      : this.connection.unbind();
  
    delete this.channel;
    delete this.pusher;
    delete this.connection;
  }

  _handleRoomUpdate(data) {
    const { isEnableRooms, isEnableWSBlock } = this;

    if (!isEnableRooms) {
      return;
    }
    if (isEnableWSBlock && data && get(data, 'session.user._id') === this.userId) {
      return this._debounceRoomUpdateLong();
    }

    return this._debounceRoomUpdateShort();
  }

  _handleHotelConfig() {
    const { isEnableConfig } = this;

    if (!isEnableConfig) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.roomNotesFetch());
    });    
  }

  _handleRoomNote() {
    const { isEnableRoomNotes } = this;

    if (!isEnableRoomNotes) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.roomNotesFetch());
    });
  }

  _handleFloor() {
    const { isEnableFloors } = this;

    if (!isEnableFloors) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.floorsFetch());
    });
  }

  _handleLostFound() {

  }

  _handleCalendar() {
    const { isEnableCalendar } = this;

    if (!isEnableCalendar) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.calendarFetch());
    });
  }

  _handleCatalog() {
    const { isEnableCalendar } = this;

    if (!isEnableCalendar) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.catalogsFetch());
    });
  }

  _handleGlitch() {
    const { isEnableGlitches } = this;

    if (!isEnableGlitches) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(GlitchesActions.glitchesFetch());
    });
  }

  _handlePlanning() {
    const { isEnablePlanning } = this;

    if (!isEnablePlanning) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.planningsFetch());
    });
  }

  _handlePlanningNight() {
    const { isEnablePlanning } = this;

    if (!isEnablePlanning) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.planningsNightFetch());
    });
  }

  _handlePlanningRunner() {
    const { isEnablePlanning } = this;

    if (!isEnablePlanning) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.planningsRunnerFetch());
    });
  }

  _handlePlanningHost() {

  }

  _handleTask() {
    const { isEnableTasks } = this;

    if (!isEnableTasks) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.tasksFetch());
    });
  }

  _handleTaskSchedule() {

  }

  _handleTaskScheduleBlock() {

  }

  _handleAsset() {
    const { isEnableAssets } = this;

    if (!isEnableAssets) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AssetsActions.assetsFetch());
    });
  }
  _handleVirtualAsset() {
    const { isEnableVirtualAssets } = this;

    if (!isEnableVirtualAssets) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AssetsActions.virtualAssetsFetch());
    });
  }

  _handleAssetRoom() {
    const { isEnableAssetRooms } = this;

    if (!isEnableAssetRooms) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AssetsActions.assetRoomsFetch());
    });
  }

  _handleCustomAction() {
    const { isEnableCustomActions } = this;

    if (!isEnableCustomActions) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AssetsActions.customActionsFetch());
    });
  }

  _handleUsers() {
    const { isEnableUsers } = this;

    if (!isEnableUsers) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      // this.dispatch(UsersActions.usersFetch());
      this.dispatch(AuthActions.userFetch());
    });
  }

  _handleHostPlanning() {
    const { isEnableHostPlanning } = this;
    
    if (!isEnableHostPlanning) {
      return;
    }

    return this._debounceHost();
  }

  _handleInventory() {
    const { isEnableInventoryWithdrawal } = this;
    
    if (!isEnableInventoryWithdrawal) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AssetsActions.inventoryWithdrawalFetch());
    });
  }

  _handleLF() {
    const { isEnableLF } = this;

    if (!isEnableLF) return;

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.lostFetch());
      this.dispatch(RoomsActions.foundFetch());
    });
  }

  _handleAuditCreate() {
    const { isEnableAudits } = this;

    if (!isEnableAudits) return;

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(Audits.load.tap())
    });
  }

  _handlePusherConnected() {
    // console.log('pusher connected');
    this.dispatch(NetworkActions.socketStatusOnline());
  }

  _handlePusherDisconnected() {
    // console.log('pusher disconnected');
    this.dispatch(NetworkActions.socketStatusOffline());
  }
}

export default Socket;
