import React, { Component } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  StyleSheet,
  Dimensions,
  InteractionManager
} from 'react-native';
import Modal from "react-native-modal";
import I18n from 'react-native-i18n';
import _, { filter } from 'lodash'
import ListView from 'rc-mobile-base/lib/components/ListView';

import Icon from 'react-native-vector-icons/FontAwesome';
import { white, grey, blue, greyDk, red } from 'rc-mobile-base/lib/styles/colors';
import { padding, margin, flx1 } from 'rc-mobile-base/lib/styles';

import { connect } from 'react-redux'
import { keyBy, map, find } from 'lodash/collection';
import { get } from 'lodash/object';
import { flatten } from 'lodash/array';

import uniq from "lodash/uniq";

import AuthActions from 'rc-mobile-base/lib/actions/auth';
import RoomsActions from 'rc-mobile-base/lib/actions/rooms';
import AssetsActions from 'rc-mobile-base/lib/actions/assets';
import UsersActions from 'rc-mobile-base/lib/actions/users';
import GlitchesActions from 'rc-mobile-base/lib/actions/glitches';
import FiltersAction from 'rc-mobile-base/lib/actions/filters';

import RoomRow from './RoomRow';
import FloorRow from './FloorRow';
import FilterGrid from './FilterGrid';
import Margin from '../../components/margin';
import moment from 'moment-timezone';
import {
  computedHotelRooms,
  computedAvailableFloors,
  computedFilteredRooms,
  computedFilteredFloors,
} from '../../selectors/rooms';
import ModalContent from 'rc-mobile-base/lib/layouts/BreakFast/ModalContent';
import { acc } from 'react-native-reanimated';
import pickActiveReservation from 'rc-mobile-base/lib/utils/pick-active-reservation';
import { compact } from 'lodash';
import { it } from 'node:test';


const STALE_TIME = 5 * 60 * 1000;
const LONG_STALE_TIME = 60 * 240 * 1000;

class BreakFast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFloor: null,
      isFilterOpen: false,
      isFilterActive: false,
      isVisible: false,
      activeRoomId: null
    }
  }

  componentWillMount() {
    this.props.deactivateRoom();
  }
  componentDidMount() {
    const hotelTimeZone = this.props.auth?.ianaTimeZoneId
    moment.tz.setDefault(hotelTimeZone)
  }

  _handleRoomNavigation = (id) => {
    this.setState({ isVisible: true })
    this.setState({ activeRoomId: id })
    // this.props.navigation.navigate('Room', {roomId: id});
  }
  _handleDismissRoom = () => {
    this.setState({ isVisible: false })
    this.setState({ activeRoomId: null })
  }
  componentDidMount(){
    this.props.breakfastFetch()
  }
  // _renderFloorRooms() {
  //   const { floors } = this.props;
  //   const { activeFloor } = this.state;
  //   const selectedFloor = find(floors, { floor: { _id: activeFloor }});

  //   return (
  //     <View style={styles.rowsView}>
  //       <ListView
  //         data={selectedFloor.rooms}
  //         renderHeader={() => <Margin top={10} />}
  //         renderRow={(data) => <RoomRow room={data} roomNavigation={this._handleRoomNavigation} />}
  //         />
  //     </View>
  //   )
  // }

  _renderFloorRooms() {
    const { floors } = this.props;
    const { activeFloor } = this.state;
    const selectedFloor = find(floors, { floor: { id: activeFloor } });
    const totalRooms = !_.isEmpty(selectedFloor) && selectedFloor?.rooms
    let breakfastArr = []
    let totalAdults = 0
    let totalChildren = 0
    let breakFastAdults = 0
    let breakFastChildren = 0
    let breakfastOccupants = 0
    let allBreakfast = this.props.allBreakfast

    let selectedFloorRooms = totalRooms.filter((data) => {
      if (data.roomCategoryName.toLowerCase() == 'public' || data.roomCategoryName.toLowerCase() == 'public spaces') {
        return
      }
      return data
    })


    let roomCalendar = !_.isEmpty(selectedFloorRooms) && selectedFloorRooms.map((data) => {
      return data?.roomCalendar?.map((item) => {
        if (!(item?.status === "arrival" || item?.status === "arrived") && (!(item.occupants === 0))) {
          !_.isEmpty(item?.otherProperties) && item.otherProperties.map((product) => {
            let brekfastValue = product?.value.toUpperCase()
            if (product?.key === "product_name" && ((brekfastValue?.includes("PDJ")) || (brekfastValue?.includes("ALLCOUNT")))) {
              breakfastArr.push(data)
              return
            }
          })
        }
      })
    })

    let totalPeople = !_.isEmpty(selectedFloorRooms) && selectedFloorRooms.map((data) => {
      return data?.roomCalendar?.map((item) => {
        totalAdults = totalAdults + item.adults
        totalChildren = totalChildren + item.children
      })
    })

   let selectedRoomBreakFastPersonn = 0 
   let testArray = []
    !_.isEmpty(selectedFloorRooms) && selectedFloorRooms.map((data) => {
      return data?.roomCalendar?.map((item) => {
        !_.isEmpty(allBreakfast) && allBreakfast.map((breakfast) => {
          if (breakfast.reservationId === item.id) {
            selectedRoomBreakFastPersonn = selectedRoomBreakFastPersonn + breakfast.numberOfGuests
          }
       })
      })
    })
  
    let uniqBreakfastArray = uniq(breakfastArr)

    !_.isEmpty(uniqBreakfastArray) && uniqBreakfastArray.map((data) => {
      return data?.roomCalendar?.map((item) => {
        if (!(item?.status === "arrival" || item?.status === "arrived") && (!(item.occupants === 0)) ) {
          !_.isEmpty(item?.otherProperties) && item.otherProperties.map((product) => {
            let brekfastValue = product?.value.toUpperCase()
            if (product?.key === "product_name" && ((brekfastValue?.includes("PDJ")) || (brekfastValue?.includes("ALLCOUNT")))) {
              // breakFastAdults = breakFastAdults + item.adults
              // breakFastChildren = breakFastChildren + item.children
              breakfastOccupants = breakfastOccupants + item.occupants
            }
          })
        }
      })
    })
    return (
      <View style={styles.rowsView}>
        <View style={styles.countView}>
          <Text style={styles.breakfastCountText}>{uniq(breakfastArr).length + ' rooms / ' + selectedFloorRooms?.length + ' rooms'}</Text>
          <Text style={styles.breakfastCountText}>{selectedRoomBreakFastPersonn + " " + "/" + " " + breakfastOccupants}</Text>

          {/* <Text style={styles.breakfastCountText}>{breakFastAdults + 'A' + " " + breakFastChildren + 'C' + " " + "/" + " " + totalAdults + 'A' + " " + totalChildren + 'C'}</Text> */}
        </View>
        <FlatList
          data={selectedFloorRooms}
          renderItem={({ item }) => <RoomRow room={item} isEnableAdvancedMessages={this.props.isEnableAdvancedMessages} roomNavigation={this._handleRoomNavigation} allBreakfast={this.props.allBreakfast} updatedBreakfastArray={this.props.updatedBreakfastArray} />}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => <Margin top={10} />}
        />
      </View>
    )

    // return (
    //   <View style={styles.rowsView}>
    //     <ListView
    //       data={selectedFloor.rooms}
    //       renderHeader={() => <Margin top={10} />}
    //       renderRow={(data) => <RoomRow room={data} roomNavigation={this._handleRoomNavigation.bind(this)} />}
    //       />
    //   </View>
    // )
  }

  _renderFloorOptions() {
    const { floors } = this.props;

    return (
      <ListView
        data={floors}
        renderHeader={() => <Margin top={10} />}
        renderRow={(data) => <FloorRow data={data} handlePress={this._handleFloorSelect.bind(this)} />}
      />
    )
  }

  // _renderFloorCards() {
  //   const { floors } = this.props;
  //   const { activeFloor } = this.state;

  //   return (
  //     <View style={{ flex: 1 }}>
  //       { activeFloor ? this._renderFloorRooms() : this._renderFloorOptions() }

  //       { activeFloor ?
  //         <View style={styles.closeFloorContainer}>
  //           <TouchableOpacity style={styles.closeFloorBtn} onPress={this._handleCloseFloor.bind(this)}>
  //             <Text style={styles.closeFloorText}>{ I18n.t('attendant.main.index.close-floor').toUpperCase() }</Text>
  //           </TouchableOpacity>
  //         </View>
  //         : null
  //       }
  //     </View>
  //   )
  // }

  _renderFloorCards() {
    const { floors } = this.props;
    const { activeFloor } = this.state;
    let totalRooms = []
    let breakfastArr = []
    let allRooms = []
    let totalAdults = []
    let totalChildren = []
    let roomCount = 0
    let breakfastOccupants = 0
    let breakFastAdults = 0
    let breakFastChildren = 0
    let totalAdultsCount = 0
    let totalChildrenCount = 0
    let allBreakfast = this.props.allBreakfast
    let cameBreakFastPerson = 0
    !_.isEmpty(floors) && floors.map((data) => {
      let rooms = data.rooms

      //total rooms length
      !_.isEmpty(rooms) && totalRooms.push(rooms.length)

      //push all floor rooms
      !_.isEmpty(rooms) && allRooms.push(rooms)
      //breakfast package room count
      !_.isEmpty(rooms) && rooms.map((room) => {
        if (room.roomCategoryName.toLowerCase() != 'public' || room.roomCategoryName.toLowerCase() != 'public spaces') {
        !_.isEmpty(room.roomCalendar) && room.roomCalendar.map((item) => {
          if (!(item?.status === "arrival" || item?.status === "arrived") && (!(item.occupants === 0)) ) {
            totalAdults.push(item.adults)
            totalChildren.push(item.children)
            !_.isEmpty(item?.otherProperties) && item.otherProperties.map((product) => {
              let brekfastValue = product?.value.toUpperCase()
              if (product?.key === "product_name" && ((brekfastValue?.includes("PDJ")) || (brekfastValue?.includes("ALLCOUNT")))) {
                breakfastArr.push(room)
                return
              }
            })
          }
        })
      }
      })
    })


    let uniqBreakfastArray = uniq(breakfastArr)

    //adult and children count for breakfast package
    !_.isEmpty(uniqBreakfastArray) && uniqBreakfastArray.map((data) => {
      return data?.roomCalendar?.map((item) => {
        if (!(item?.status === "arrival" || item?.status === "arrived") && (!(item.occupants === 0))) {
          !_.isEmpty(item?.otherProperties) && item.otherProperties.map((product) => {
            let brekfastValue = product?.value.toUpperCase()
            if (product?.key === "product_name" && ((brekfastValue?.includes("PDJ")) || (brekfastValue?.includes("ALLCOUNT")))) {
              breakfastOccupants = breakfastOccupants + item.occupants
              // breakFastAdults = breakFastAdults + item.adults
              // breakFastChildren = breakFastChildren + item.children
            }
          })
        }
      })
    })

    !_.isEmpty(allBreakfast) && allBreakfast.map((data) =>{
      cameBreakFastPerson = cameBreakFastPerson + data.numberOfGuests
    })
    //totalAdults Array sum for display total adults
    !_.isEmpty(totalAdults) && totalAdults.map((data) => {
      totalAdultsCount = totalAdultsCount + data
    })

    //totalChildren Array sum for display total children
    !_.isEmpty(totalChildren) && totalChildren.map((data) => {
      totalChildrenCount = totalChildrenCount + data
    })

    //totalRooms Array sum for display total rooms
    !_.isEmpty(totalRooms) && totalRooms.map((data) => {
      roomCount = roomCount + data
    })

    let filterTotalRoom = []
    !_.isEmpty(allRooms) && allRooms.map((data) => {
      data.map((item) => {
        if (item.roomCategoryName.toLowerCase() == 'public' || item.roomCategoryName.toLowerCase() == 'public spaces') {
          return
        }
        filterTotalRoom.push(item)
      })
    })
    return (
      <View style={[flx1]}>

        {
          activeFloor ? <></> : <View style={styles.countView}>
            <Text style={styles.breakfastCountText}>{uniq(breakfastArr).length + ' rooms / ' + filterTotalRoom.length + ' rooms'}</Text>
            <Text style={styles.breakfastCountText}>{ cameBreakFastPerson + " " + "/" + " " + breakfastOccupants}</Text>

            {/* <Text style={styles.breakfastCountText}>{breakFastAdults + 'A' + " " + breakFastChildren + 'C' + " " + "/" + " " + totalAdultsCount + 'A' + " " + totalChildrenCount + 'C'}</Text> */}
          </View>
        }

        {activeFloor ?
          this._renderFloorRooms() :
          <FlatList
            data={floors}
            renderItem={({ item }) => <FloorRow data={item} handlePress={this._handleFloorSelect} />}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={() => <Margin top={10} />}
          />
        }

        {activeFloor ?
          <View style={styles.closeFloorContainer}>
            <TouchableOpacity style={styles.closeFloorBtn} onPress={this._handleCloseFloor}>
              <Text style={styles.closeFloorText}>{I18n.t('attendant.main.index.close-floor').toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
          : null
        }
      </View>
    )
  }

  _renderRoomsByFloor() {
    const { rooms, filteredRooms, filteredFloors, isActiveFilter } = this.props;
    const orderedRooms = flatten(filteredFloors.map(f => f.rooms));
    let filterOrderedRoom = orderedRooms.filter((data) => {
      if (data.roomCategoryName.toLowerCase() == 'public' || data.roomCategoryName.toLowerCase() == 'public spaces') {
        return
      }
      return data
    })
    return (
      <ListView
        data={filterOrderedRoom}
        renderRow={(data) => <RoomRow room={data} isEnableAdvancedMessages={this.props.isEnableAdvancedMessages} roomNavigation={this._handleRoomNavigation.bind(this)} updatedBreakfastArray={this.props.updatedBreakfastArray} />}
        renderSectionHeader={(secId) => this._renderFloorSection(secId)}
        getSectionId={(data) => { return get(data, 'floor.id') }}
      />
    )
  }

  _renderFloorSection(secId) {
    const { floors } = this.props;
    const floor = find(floors, { id: secId });

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionText}>{`${I18n.t('attendant.main.index.floor')} ${floor.floor.number}`}</Text>
      </View>
    )
  }

  _handleFloorSelect = (floorId) => this.setState({ activeFloor: floorId })
  _handleCloseFloor = () => this.setState({ activeFloor: null })

  _handleToggleFilter() {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      isFilterOpen: !this.state.isFilterOpen
    });
  }

  _handleFilterRooms(rooms) {
    this._handleToggleFilter();
    this.props.filterRooms(rooms.map(room => room.id));
  }

  _handleResetFilters() {
    this._handleToggleFilter();
    this.props.resetFilters();
  }

  _getRoom = () => find(this.props.rooms, { id: this.state.activeRoomId })

  render() {
    const { rooms, filteredRooms, isActiveFilter } = this.props;
    const { isFilterOpen, isFilterActive } = this.state;
    const activeRoom = this._getRoom();
    let totalFloorRooms = filteredRooms.filter((data) => {
      if (data.roomCategoryName.toLowerCase() == 'public' || data.roomCategoryName.toLowerCase() == 'public spaces') {
        return
      }
      return data
    })
    return (
      <View style={styles.container}>
        <View style={[{ ...white.bg }]}>
          <View style={[styles.subheader, isFilterOpen ? null : { borderBottomColor: '#E0E0E0', borderBottomWidth: 1 }]}>
            <View style={styles.roomsCountContainer}>
              {/* {
                this.props.searchQuery === null ? <Text style={styles.roomsCountText}>{`${filteredRooms.length} ${I18n.t('attendant.main.index.rooms')}`}</Text> :
                <Text style={styles.roomsCountText}>{`${totalFloorRooms.length} ${I18n.t('attendant.main.index.rooms')}`}</Text>
              } */}
              <Text style={styles.roomsCountText}>{`${totalFloorRooms.length} ${I18n.t('attendant.main.index.rooms')}`}</Text>
              
            </View>
          </View>
          <FilterGrid
            rooms={rooms}
            filterRooms={this._handleFilterRooms.bind(this)}
            searchQuery={this.props.searchQuery}
            searchRooms={this.props.searchRooms}
            resetRooms={this._handleResetFilters.bind(this)}
            closeFilters={this._handleToggleFilter.bind(this)}
          />
        </View>

        {!isActiveFilter && filteredRooms.length > 50 ?
          this._renderFloorCards() :
          this._renderRoomsByFloor()
        }

        <Modal
          style={styles.modal}
          backdropPressToClose={false}
          swipeToClose={false}
          backdropColor={'#4a4a4a'}
          isVisible={this.state.isVisible}
        >
          <ModalContent
            activeRoom={activeRoom}
            dismiss={this._handleDismissRoom}
            cameTobreakfast={this.props.cameTobreakfast}
            allBreakfast={this.props.allBreakfast}
            getBreakFast={this.props.breakfastFetch}
          />
        </Modal>

      </View>
    )
  }
}
const window = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    // backgroundColor: '#F7F7F7',
    backgroundColor: '#F0F0F0'
  },
  countView: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between"
  },
  subheader: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    ...white.bg
  },
  taskAlertContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50
  },
  roomsCountContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    alignSelf: "center"
  },
  roomsCountText: {
    ...greyDk.text,
    fontWeight: '500',
    fontSize: 13
  },
  filterContainer: {
    justifyContent: 'flex-end',
    width: 50
  },
  filterBtn: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  rowsView: {
    flex: 1,
  },
  closeFloorContainer: {
    height: 60,
    backgroundColor: 'white',
    padding: 4,
    borderTopColor: '#E0E0E0',
    borderTopWidth: 1,
  },
  closeFloorBtn: {
    height: 50,
    backgroundColor: '#C93C46',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  closeFloorText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600'
  },
  sectionHeader: {
  },
  sectionText: {
    ...padding.t10,
    ...padding.b5,
    ...padding.x10,
    ...greyDk.text,
    fontWeight: '600',
    fontSize: 13
  },
  alertTasksBtn: {
    ...white.bg,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    ...padding.x5
  },
  alertTasksText: {
    ...red.text,
    marginLeft: 2,
    fontSize: 17
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 12,
    width: window.width * 0.85,
    overflow: 'hidden',
    paddingVertical: window.height * 0.10,
  },
  breakfastCountText: {
    color: '#4a4a4a',
    fontSize: 15
  },
  peopleCountText: {
    color: '#4a4a4a',
    fontSize: 15
  }
});

const mapStateToProps = (state) => {
  return {
    rooms: computedHotelRooms(state),
    filteredRooms: computedFilteredRooms(state),
    floors: computedAvailableFloors(state),
    filteredFloors: computedFilteredFloors(state),
    roomUpdates: state.updates.rooms,
    backend: state.backend,
    isActiveFilter: state.filters.isActiveFilter,
    searchQuery: state.filters.roomsSearchQuery,
    isEnableAdvancedMessages: get(state, 'auth.config.isEnableAdvancedMessages') || false,
    auth: state.auth,
    allBreakfast: state.rooms.hotelBreakfastPackage,
    updatedBreakfastArray: state.rooms.updatedBreakfastArray
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    cameTobreakfast: (data) => dispatch(RoomsActions.guestCameToBreakFast(data)),
    deactivateRoom: () => dispatch(RoomsActions.deactivateRoom()),
    searchRooms: (searchQuery) => dispatch(FiltersAction.updateSearchRooms({ searchQuery })),
    filterRooms: (activeRooms) => dispatch(FiltersAction.setActiveRooms({ activeRooms })),
    resetFilters: () => dispatch(FiltersAction.resetRoomsFilters()),
    breakfastFetch: () => dispatch(RoomsActions.breakfastFetch()),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BreakFast);
