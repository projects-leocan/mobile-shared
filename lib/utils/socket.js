import { AppState, InteractionManager } from 'react-native';
import Pusher from 'pusher-js/react-native';
import { get } from 'lodash/object';
import debounce from 'lodash/debounce';

import AuthActions from '../actions/auth';
import RoomsActions from '../actions/rooms';
import SocketRoomsActions from '../actions/socketRooms';
import UsersActions from '../actions/users';
import AssetsActions from '../actions/assets';
import GlitchesActions from '../actions/glitches';
import HotelsTaskActions from '../actions/hotelsTask';
import { Actions as NetworkActions } from '../network';
import { Actions as OfflineActions } from '../offline';
import { Audits } from 'rc-mobile-base/lib/models';
import _ from 'lodash'
import { parseBodyFunction, writeFileIntoLocal } from 'rc-mobile-base/lib/newLogger';

const createObjectForAddDataInDataDogSocketFire = (endpoint, data, apicalls) => {
  const finalObject = {
    socket: endpoint,
    responseFromSocket: data && parseBodyFunction({ body: data }),
    socketApiCall: apicalls
  }
  return finalObject
}


// const API_KEY = '4dbcea188730d6adb929';
const API_KEY = '289f31833c9b7cfcda5e';

class Socket {
  constructor(dispatch, options) {
    this.dispatch = dispatch;
    this.isActive = false;

    this.isEnableRooms = get(options, 'isEnableRooms', true);
    this.isEnableFloors = get(options, 'isEnableFloors', true);
    this.isEnableRoomStatuses = get(options, 'isEnableRoomStatuses', true);
    this.isEnableRoomHousekeepings = get(options, 'isEnableRoomHousekeepings', true);
    this.isEnablePlanning = get(options, 'isEnablePlanning', true);
    this.isEnableFuturePlanning = get(options, 'isEnableFuturePlanning', true);
    this.isEnableCalendar = get(options, 'isEnableCalendar', true);
    this.isEnableRoomNotes = get(options, 'isEnableRoomNotes', true);
    this.isEnableCatalogs = get(options, 'isEnableCatalogs', true);
    this.isEnableTasks = get(options, 'isEnableTasks', true);
    this.isEnableFutureTasks = get(options, 'isEnableFutureTasks', true);
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
    this.isEnableHotelSetting = get(options, 'isEnableHotelSetting', true);
    this.isEnableLF = get(options, 'isEnableLF', false);
    this.isEnableAudits = get(options, 'isEnableAudits', false);
    this.configureStore = get(options, 'configureStore', []);

    this._debounceRoomUpdateLong = debounce(() => {
      this.dispatch(RoomsActions.roomsFetch())
    }, 5000)
    this._debounceRoomUpdateShort = debounce(() => {
      this.dispatch(RoomsActions.roomsFetch())
      this.dispatch(RoomsActions.roomHousekeepingsFetch())
    }, 1000)
    this._debounceHost = debounce(() => {
      this.dispatch(RoomsActions.planningsHostInFetch());
      this.dispatch(RoomsActions.planningsHostOutFetch());
      if (options.hostActions) {
        this.dispatch(options.hostActions.fetchBookings(this.hotelGroupId));
      }
    }, 2000);
    this._debounceTaskUpdate = debounce(() => {
      this.dispatch(RoomsActions.tasksFetch());
      this.dispatch(HotelsTaskActions.availHotelsTaskFetch());
    }, 1000)
    this._debounceFutureTaskUpdate = debounce(() => {
      this.dispatch(RoomsActions.tasksFetch());
      this.dispatch(RoomsActions.futureTasksFetch());
    }, 1000)
    this.debounceCallSpecificTask = debounce((id, data) => {
      this.dispatch(RoomsActions.tasksFetch(id, data));
      this.dispatch(HotelsTaskActions.availHotelsTaskFetch());
    }, 1000)
    // this._debounceTaskUpdateLong = debounce(() => {
    //   this.dispatch(RoomsActions.roomsFetch())
    // }, 5000)
    // this._debounceTaskUpdateShort = debounce(() => {
    //   this.dispatch(RoomsActions.roomsFetch())
    // }, 1000)
  }

  activate(userId, hotelGroupId) {
    if (!userId || !hotelGroupId) {
      return;
    }

    const pusher = new Pusher(API_KEY, { cluster: 'eu' });
    const connection = pusher.connection;

    connection.bind('connected', () => this._handlePusherConnected('connected'), this)
    connection.bind('disconnected', () => this._handlePusherDisconnected('disconnected'), this)

    const channel = pusher.subscribe(hotelGroupId);

    channel.bind('basic_room_update', (data) => this._handleRoomUpdate('basic_room_update', data), this);
    channel.bind('hotel_room_update', (data) => this._handleRoomUpdate('hotel_room_update', data), this);
    channel.bind('hotel_room', (data) => this._handleRoomUpdate('hotel_room', data), this);
    channel.bind('update', (data) => this._handleRoomUpdate('update', data), this);

    channel.bind('hotel_config', () => this._handleHotelConfig('hotel_config'), this);
    channel.bind('hotel_settings', () => this._handleHotelSettings('hotel_settings'), this);

    channel.bind('hotel_floor', () => this._handleFloor('hotel_floor'), this);

    channel.bind('room_note', () => this._handleRoomNote('room_note'), this);
    // channel.bind('lost_found', this._handleLostFound, this);
    channel.bind('hotel_calendar', () => this._handleCalendar('hotel_calendar'), this);
    channel.bind('hotel_catalog', () => this._handleCatalog('hotel_catalog'), this);
    channel.bind('hotel_glitch', () => this._handleGlitch('hotel_glitch'), this);

    channel.bind('hotel_planning', () => this._handlePlanning('hotel_planning'), this);
    channel.bind('attendant_planning', () => this._handlePlanning('attendant_planning'), this);
    channel.bind('attendant_nightly_planning', () => this._handleNightPlanning('attendant_nightly_planning'), this);
    channel.bind('attendant_planning_night', () => this._handlePlanningNight('attendant_planning_night'), this);
    channel.bind('runner_planning', () => this._handlePlanningRunner('runner_planning'), this);
    channel.bind('attendant_planning_future', () => this._handleFuturePlanning('attendant_planning_future'), this);
    // channel.bind('host_planning', this._handlePlanningHost, this);

    channel.bind('hotel_task', (data) => this._handleTask('hotel_task', data), this);
    channel.bind('hotel_future_task', () => this._handleFutureTask('hotel_future_task'), this);
    channel.bind('hotel_task_schedule', () => this._handleTaskSchedule('hotel_task_schedule'), this);
    channel.bind('hotel_task_schedule_block', () => this._handleTaskScheduleBlock('hotel_task_schedule_block'), this);

    channel.bind('hotel_asset', () => this._handleAsset('hotel_asset'), this);
    channel.bind('hotel_virtual_asset', () => this._handleVirtualAsset('hotel_virtual_asset'), this);
    channel.bind('hotel_asset_one', () => this._handleAsset('hotel_asset_one'), this);
    channel.bind('hotel_virtual_asset_one', () => this._handleVirtualAsset('hotel_virtual_asset_one'), this);
    channel.bind('asset_room', () => this._handleAssetRoom('asset_room'), this);
    channel.bind('hotel_custom_actions', () => this._handleCustomAction('hotel_custom_actions'), this);

    channel.bind('hotel_user', () => this._handleUsers('hotel_user'), this);
    channel.bind('host_planning', () => this._handleHostPlanning('host_planning'), this);
    channel.bind('lost_found', () => this._handleLF('lost_found'), this);
    channel.bind('audit_create', () => this._handleAuditCreate('audit_create'), this);

    // channel.bind('attendant_planning_night', this._handlePlanningNight, this);
    // channel.bind('general_maintenance', this._handleGeneralMaintenance, this);
    channel.bind('hotel_inventory', () => this._handleInventory('hotel_inventory'), this);
    channel.bind('room_message', () => this._handleRoomMessages('room_message'), this)
    // channel.bind('asset_events', this._handle, this);

    this.isActive = true;
    this.userId = userId;
    this.hotelGroupId = hotelGroupId;

    this.pusher = pusher;
    this.channel = channel;
    this.connection = connection;
  }

  deactivate() {
    if (this.channel) {
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
  }

  subscribeStore = async () => {
    return new Promise((resolve, reject) => {
      const { configureStore } = this
      const { store } = configureStore();
      const unsubscribe = store.subscribe(() => {
        resolve(store.getState()?.rooms?.isSocketFireOnInspectionUpdate)
      })
    });

  }

  _handleRoomUpdate = async (socket, data) => {
    const { isEnableRooms, isEnableWSBlock, configureStore } = this;

    let socketApiCallConditions = []
    if (isEnableWSBlock && data && get(data, 'session.user._id') === this.userId) {
      socketApiCallConditions = ['/Room/GetListOfRooms']
    }
    if (!(isEnableWSBlock && data && get(data, 'session.user._id') === this.userId)) {
      socketApiCallConditions = ['/Room/GetListOfRooms', '/Room/GetListOfRoomHousekeepings']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, data, socketApiCallConditions))

    if (!isEnableRooms) {
      return;
    }
    if (!Array.isArray(configureStore)) {
      let subcriptedValue = await this.subscribeStore()
      if (subcriptedValue === false) {
        return this.dispatch(RoomsActions.isSocketFireOnUpdateInspection({ isFire: true })), this._debounceRoomUpdateLong();
      }
    }
    if (isEnableWSBlock && data && get(data, 'session.user._id') === this.userId) {
      return this._debounceRoomUpdateLong();
    }

    return this._debounceRoomUpdateShort();
  }

  _handleHotelConfig(socket) {
    const { isEnableConfig } = this;

    let socketApiCallConditions = []
    if (isEnableConfig) {
      socketApiCallConditions = ['/Room/GetListOfNotes']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))

    if (!isEnableConfig) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.roomNotesFetch());
    });
  }

  _handleHotelSettings(socket) {
    const { isEnableHotelSetting } = this;

    let socketApiCallConditions = []
    if (isEnableHotelSetting) {
      socketApiCallConditions = ['/AppConfiguration/GetAttendantMobileAppConfiguration']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))

    if (!isEnableHotelSetting) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AuthActions.configFetch());
    });
  }

  _handleRoomNote(socket) {
    const { isEnableRoomNotes } = this;
    let socketApiCallConditions = []
    if (isEnableRoomNotes) {
      socketApiCallConditions = ['/Room/GetListOfNotes']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))
    if (!isEnableRoomNotes) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.roomNotesFetch());
    });
  }

  _handleFloor(socket) {
    const { isEnableFloors } = this;
    let socketApiCallConditions = []
    if (isEnableFloors) {
      socketApiCallConditions = ['Floor/GetListOfFloors']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))
    if (!isEnableFloors) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.floorsFetch());
    });
  }

  _handleLostFound() {

  }

  _handleCalendar(socket) {
    const { isEnableCalendar } = this;
    let socketApiCallConditions = []
    if (isEnableCalendar) {
      socketApiCallConditions = ['Reservation/GetListOfReservations']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))

    if (!isEnableCalendar) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.calendarFetch());
    });
  }

  _handleCatalog(socket) {
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket))

    const { isEnableCalendar } = this;

    if (!isEnableCalendar) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.catalogsFetch());
    });
  }

  _handleGlitch(socket) {
    const { isEnableGlitches } = this;
    let socketApiCallConditions = []
    if (isEnableGlitches) {
      socketApiCallConditions = ['Experience/GetListOfExperiences']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))

    if (!isEnableGlitches) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(GlitchesActions.glitchesFetch());
    });
  }

  _handlePlanning(socket) {
    const { isEnablePlanning } = this;
    let socketApiCallConditions = []
    if (isEnablePlanning) {
      socketApiCallConditions = ['/Cleaning/GetListOfCleanings']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))

    if (!isEnablePlanning) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.planningsFetch());
    });
  }

  _handleNightPlanning(socket) {
    const { isEnablePlanning } = this;
    let socketApiCallConditions = []
    if (isEnablePlanning) {
      socketApiCallConditions = ['/Cleaning/GetListOfCleanings']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))

    if (!isEnablePlanning) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.planningsFetch());
    });
  }

  _handleFuturePlanning(socket) {
    const { isEnableFuturePlanning } = this;
    let socketApiCallConditions = []
    if (isEnableFuturePlanning) {
      socketApiCallConditions = ['/Cleaning/GetListOfFutureCleanings']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))
    if (!isEnableFuturePlanning) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.futurePlanningsFetch());
    });
  }

  _handlePlanningNight(socket) {
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket))

    const { isEnablePlanning } = this;

    if (!isEnablePlanning) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.planningsNightFetch());
    });
  }

  _handlePlanningRunner(socket) {
    const { isEnablePlanning } = this;
    let socketApiCallConditions = []
    if (isEnablePlanning) {
      socketApiCallConditions = ['/runner_plannings']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))

    if (!isEnablePlanning) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.planningsRunnerFetch());
    });
  }

  _handlePlanningHost() {

  }

  _handleTask(socket, data) {
    const { isEnableTasks } = this;
    let socketApiCallConditions = []
    if (isEnableTasks) {
      socketApiCallConditions = ['/Task/GetListOfTasks']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, data, socketApiCallConditions))

    if (!isEnableTasks) {
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      const mapIdsForTask = !_.isEmpty(data) && data?.map((d) => d.id)
      this.debounceCallSpecificTask(mapIdsForTask, data)
    });
  }

  _handleFutureTask(socket) {
    const { isEnableFutureTasks } = this;
    let socketApiCallConditions = []
    if (isEnableFutureTasks) {
      socketApiCallConditions = ['/Task/GetListOfTasks', `/Task/GetListOfFutureTasks`]
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))
    if (!isEnableFutureTasks) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this._debounceFutureTaskUpdate();
    });
  }

  _handleTaskSchedule(socket) {
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket))
  }

  _handleTaskScheduleBlock(socket) {
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket))
  }

  _handleAsset(socket) {
    const { isEnableAssets } = this;
    let socketApiCallConditions = []
    if (isEnableAssets) {
      socketApiCallConditions = ['/Asset/GetListOfAssets']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))

    if (!isEnableAssets) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AssetsActions.assetsFetch());
    });
  }
  _handleVirtualAsset(socket) {
    const { isEnableVirtualAssets } = this;
    let socketApiCallConditions = []
    if (isEnableVirtualAssets) {
      socketApiCallConditions = ['/virtual_assets']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))

    if (!isEnableVirtualAssets) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AssetsActions.virtualAssetsFetch());
    });
  }

  _handleAssetRoom(socket) {
    const { isEnableAssetRooms } = this;
    let socketApiCallConditions = []
    if (isEnableAssetRooms) {
      socketApiCallConditions = ['/asset_rooms?quantity=true']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))

    if (!isEnableAssetRooms) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AssetsActions.assetRoomsFetch());
    });
  }

  _handleCustomAction(socket) {
    const { isEnableCustomActions } = this;
    let socketApiCallConditions = []
    if (isEnableCustomActions) {
      socketApiCallConditions = ['/Asset/GetListOfAssetActions']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))
    if (!isEnableCustomActions) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AssetsActions.customActionsFetch());
    });
  }

  _handleUsers(socket) {
    const { isEnableUsers } = this;
    let socketApiCallConditions = []
    if (isEnableUsers) {
      socketApiCallConditions = ['/User/GetDetails']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))
    if (!isEnableUsers) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      // this.dispatch(UsersActions.usersFetch());
      this.dispatch(AuthActions.userFetch());
    });
  }

  _handleHostPlanning(socket) {
    const { isEnableHostPlanning } = this;
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket))

    if (!isEnableHostPlanning) {
      return;
    }

    return this._debounceHost();
  }

  _handleInventory(socket) {
    const { isEnableInventoryWithdrawal } = this;
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket))

    if (!isEnableInventoryWithdrawal) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(AssetsActions.inventoryWithdrawalFetch());
    });
  }

  _handleRoomMessages(socket) {
    const socketApiCallConditions = ['/Room/GetListOfAllMessages']
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))
    InteractionManager.runAfterInteractions(() => {
      this.dispatch(SocketRoomsActions.socketRoomMessagesFetch());
      this.dispatch(RoomsActions.roomMessagesFetch());
    });
  }

  _handleLF(socket) {
    const { isEnableLF } = this;
    let socketApiCallConditions = []
    if (isEnableLF) {
      socketApiCallConditions = ['/lost_found/losts', '/FoundItem/GetListOfFoundItems']
    }
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket, null, socketApiCallConditions))
    if (!isEnableLF) return;

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(RoomsActions.lostFetch());
      this.dispatch(RoomsActions.foundFetch());
    });
  }

  _handleAuditCreate(socket) {
    const { isEnableAudits } = this;
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket))

    if (!isEnableAudits) return;

    InteractionManager.runAfterInteractions(() => {
      this.dispatch(Audits.load.tap())
    });
  }

  _handlePusherConnected(socket) {
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket))
    this.dispatch(NetworkActions.socketStatusOnline());
  }

  _handlePusherDisconnected(socket) {
    writeFileIntoLocal(createObjectForAddDataInDataDogSocketFire(socket))
    this.dispatch(NetworkActions.socketStatusOffline());
  }
}

export default Socket;
