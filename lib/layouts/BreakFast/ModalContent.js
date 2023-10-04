import React, { Component, useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'react-native-i18n'
import ReservationComponent from 'rc-mobile-base/lib/components/Reservation';
// import CleaningInfo from './CleaningInfo';

import {
    flx1,
    lCenterCenter,
    margin,
    green,
    white,
    slate,
    red,
    orange,
    flxRow,
    flexGrow1,
    splashBg,
    greyDk,
    themeTomato
} from 'rc-mobile-base/lib/styles';
import { get, compact, flatten, map } from 'lodash';
import _ from "lodash"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import pickActiveReservation from 'rc-mobile-base/lib/utils/pick-active-reservation';


const ModalContent = ({ activeRoom, dismiss, submit, rooms }) => {
    const { name, roomCalendar } = activeRoom || {};

    let [breakFastCount, setBreakFastCount] = useState(0);
    const [atBreakFast, setAtBreakFast] = useState("white");
    const [leftBreakFast, setLeftBreakFast] = useState("white");
    const activeReservationId = pickActiveReservation(get(activeRoom, 'guests', []), false);
    let activeRoomCalender = !_.isEmpty(roomCalendar) && roomCalendar.filter((data) => {
        if (data?.id === activeReservationId) {
            return data
        }
    })
    let guest_name = get(activeRoomCalender[0], 'guest_name', "")
    
    let adults = get(activeRoomCalender[0], 'adults', 0)
    let children = get(activeRoomCalender[0], 'children', 0)
    let infants = get(activeRoomCalender[0], 'infants', 0)
    let occupants = get(activeRoomCalender[0], 'occupants', 0)
    let groupName = get(activeRoomCalender[0], 'group_name', "")
    let vip = get(activeRoomCalender[0], 'vip', "")
    let guestOccupants 
    if (children || infants) {
      guestOccupants = `${adults}+${children}+${infants}`;
    }else{
      guestOccupants = occupants
    }
    let addBreakFastCount = () => {
        setBreakFastCount(Number(breakFastCount) + 1);
    };
    let minusBreakFastCount = () => {
        if (breakFastCount > 0) {
            setBreakFastCount(breakFastCount - 1);
        }
    }
    let handleAtBreakFast = () => {
        setAtBreakFast("#c1e4c3")
        setLeftBreakFast("white")
    }
    let handleLeftBreakFast = () => {
        setLeftBreakFast("#f1b0b0")
        setAtBreakFast("white")
    }

    return (
        <View style={[styles.taskModalInnerContainer]}>
            <View style={styles.headerContainer}>
                <View style={styles.horizontalContainer}>
                    <Text style={[styles.headerTitle, { flex: 1 }]}>Breakfast</Text>
                </View>
                <View style={styles.closeButtonContainer}>
                    <TouchableOpacity style={[flexGrow1, { alignItems: 'center', justifyContent: 'center' }]} onPress={dismiss}>
                        <Ionicons name="ios-close-outline" color="white" size={38} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={{ flexGrow: 1, alignContent: 'flex-start' }} showsVerticalScrollIndicator={false}>
                <View style={[styles.alertBodyContainer]}>
                    <View style={styles.roomLabelHeader}>
                        <Text style={styles.roomTitle}>{"Room " + name}</Text>
                        <View style={{ flexDirection: "row",alignItems:"center",justifyContent:"space-between"}}>
                            <Text style={styles.guestName}>{guest_name ? guest_name : ""}</Text>
                            {guestOccupants ?
                                <View style={styles.adultsChildrenIconView}>
                                    <Icon style={{ alignSelf: "center" }} name="user" size={15} color={slate.color} />
                                    <Text style={styles.adultsText}>{" " + guestOccupants}</Text>
                                </View> : <></>}
                        </View>
                        <Text style={styles.pmsTitle}>PMS</Text>
                    </View>
                    <View style={styles.numberOfBreakFastView}>
                        <TouchableOpacity style={styles.circleView} onPress={minusBreakFastCount}>
                            <Entypo name='minus' size={30} color={"#1D2F58"} />
                        </TouchableOpacity>
                        <Text style={styles.numberOfBreakFastText}>{breakFastCount <= 9 ? "0" + breakFastCount : breakFastCount}</Text>
                        <TouchableOpacity style={styles.circleView} onPress={addBreakFastCount}>
                            <Entypo name='plus' size={30} color={"#1D2F58"} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.borderView}></View>
                    <View style={styles.bottomView}>
                        <Text style={styles.breakFastTitle}>Send to Housekeeping that :</Text>
                        <TouchableOpacity style={styles.guestStatusView} onPress={() => handleAtBreakFast()}>
                            <View style={[styles.atBreakFast, { backgroundColor: atBreakFast }]}>
                                <MaterialIcons name="free-breakfast" size={25} color={slate.color} />
                            </View>
                            <Text style={styles.breakfastStatus}>Guest is at breakfast</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.guestStatusView} onPress={() => handleLeftBreakFast()}>
                            <View style={[styles.leftBreakFast, { backgroundColor: leftBreakFast }]}>
                                <MaterialIcons name="free-breakfast" size={25} color={slate.color} />
                            </View>
                            <Text style={styles.breakfastStatus}>Guest left breakfast</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.confirmBtn]}>
                            <Text style={styles.btnText}>{I18n.t('base.popup.index.accept').toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    taskModalInnerContainer: {
        justifyContent: 'flex-start',
        // alignSelf: 'center',
        // alignItems: 'center',
        height: 'auto',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    headerContainer: {
        padding: 18,
        flexGrow: 1,
        width: '100%',
        ...splashBg.bg,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    horizontalContainer: {
        flexDirection: 'row'
    },
    headerTitle: {
        fontSize: 28,
        lineHeight: 48,
        ...white.text,
        fontWeight: '700',
        textAlign: 'center'
    },
    closeButtonContainer: {
        height: 44,
        width: 44,
        borderRadius: 22,
        alignSelf: 'center',
        right: 22,
        position: 'absolute',
        // backgroundColor: 'rgba(255,255,255,0.15)'
    },
    alertBodyContainer: {
        flexGrow: 1,
        width: '100%',
        padding: 18,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        paddingLeft: 35,
        paddingRight: 35
    },
    roomLabelHeader: {
        width: "100%",
    },
    roomTitle: {
        fontSize: 25,
        lineHeight: 40,
        ...splashBg.text,
        textAlign: 'left',
        fontWeight: '700'
    },
    guestName: {
        fontSize: 20,
        // lineHeight: 40,
        paddingVertical: 10,
        textAlign: 'left',
        fontWeight: '500',
    },
    breakFastTitle: {
        fontSize: 20,
        lineHeight: 40,
        textAlign: 'left',
        fontWeight: '500'
    },
    pmsTitle: {
        fontSize: 16,
        lineHeight: 20,
        ...greyDk.text,
        textAlign: 'left',
        fontWeight: '500',
        marginTop: 5
    },
    numberOfBreakFastView: {
        flexDirection: "row",
        marginTop: 25,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    circleView: {
        width: 70,
        height: 70,
        borderColor: "#1D2F58",
        borderWidth: 1,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center"
    },
    numberOfBreakFastText: {
        fontSize: 40,
        lineHeight: 50,
        ...splashBg.text,
        textAlign: 'left',
        fontWeight: '700'
    },
    borderView: {
        width: "100%",
        backgroundColor: "#1D2F58",
        height: 1,
        marginTop: 20,
        alignSelf: "center"
    },
    bottomView: {
        marginTop: 15
    },
    atBreakFast: {
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#c1e4c3",
        borderWidth: 2
    },
    leftBreakFast: {
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#f1b0b0",
        borderWidth: 2
    },
    breakfastStatus: {
        fontSize: 16,
        marginLeft: 15,
        fontWeight: "500"
    },
    guestStatusView: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingTop: 25
    },
    confirmBtn: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderRadius: 5,
        margin: 3,
        backgroundColor: themeTomato.color,
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    adultsText: {
        color: slate.color
      },
      adultsChildrenIconView:{
        flexDirection: "row",
        justifyContent:"center" ,
      }
});

export default ModalContent;