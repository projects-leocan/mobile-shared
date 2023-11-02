import React, { Component, useEffect, useRef, useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'react-native-i18n'
import ReservationComponent from 'rc-mobile-base/lib/components/Reservation';
import SignatureScreen from "react-native-signature-canvas";

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
import { log } from 'console';


const ModalContent = ({ activeRoom, dismiss, submit, rooms, cameTobreakfast, allBreakfast, getBreakFast }) => {
    const { name, roomCalendar } = activeRoom || {};
    const ref = useRef();
    const [atBreakFast, setAtBreakFast] = useState("white");
    const [leftBreakFast, setLeftBreakFast] = useState("white");
    const [signature, setSignature] = useState(null)
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const activeReservationId = pickActiveReservation(get(activeRoom, 'guests', []), false);
    const style = `body {
        background: url("data:image/png;base64,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") repeat scroll center center rgb(255,255,255));
        font-family: Helvetica, Sans-Serif;
      
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
      }
      .m-signature-pad--body {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        border: 1px solid #f4f4f4;
      }
      .m-signature-pad--body
        canvas {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 80%;
          border-radius: 4px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.02) inset;
        }
      .m-signature-pad--footer {
        position: absolute;
        left: 20px;
        right: 20px;
        bottom: 20px;
        height: 40px;
      }
      .m-signature-pad--footer
        .description {
            display: none;
        }
      .m-signature-pad--footer
        .button.clear {
            background-color: white;
            width: 50% ;
            margin-left: 25% ;
            margin-right: 25% ;
            text-decoration-line: underline;
            color: #ef7373;
            font-weight: 500;
            font-size: 16px;
        }
      .m-signature-pad--footer
        .button.save {
            display: none;
        } 
      @media screen and (max-width: 1024px) {
        .m-signature-pad {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: auto;
          height: auto;
          min-width: 250px;
          min-height: 140px;
          margin: 0;
        }
        #github {
          display: none;
        }
      }
      @media screen and (max-height: 320px) {
        .m-signature-pad--footer {
          left: 20px;
          right: 20px;
          bottom: 4px;
          height: 28px;
        }
      }
    `

    let activeRoomCalender = !_.isEmpty(roomCalendar) && roomCalendar.filter((data) => {
        // if (data?.id === activeReservationId) {
        //     return data
        // }
        if (!(data.status === 'arrival' || data.status === 'arrived') && (!(data.occupants === 0))) {
            return data
        }
    })
    let reservationId = get(activeRoomCalender[0], 'id', "")
    let breakfastForPerson = !_.isEmpty(allBreakfast) && allBreakfast.filter((data) => {
        if (data.reservationId === reservationId) {
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
    let otherProperties = get(activeRoomCalender[0], 'otherProperties', [])
    let guestOccupants
    let headerContainer

    {

        !_.isEmpty(otherProperties) ?
            !_.isEmpty(otherProperties) && otherProperties.map((product) => {
                let brekfastValue = product?.value.toUpperCase()
                if (product?.key === "product_name" && (!((brekfastValue?.includes("PDJ")) || (brekfastValue?.includes("ALLCOUNT"))))) {
                    headerContainer = true
                }
                else {
                    headerContainer = false
                }
            }) :
            headerContainer = true
           
    }

    if (children || infants) {
        guestOccupants = `${adults}+${children}+${infants}`;
    } else {
        guestOccupants = occupants
    }


    let [breakFastCount, setBreakFastCount] = activeRoomCalender == false ? useState(0) : occupants == 0 ? useState(0) : _.isEmpty(breakfastForPerson) ? useState(1) :
        breakfastForPerson.length > 1 ? useState(_.last(breakfastForPerson).numberOfGuests) :
            useState(breakfastForPerson[0].numberOfGuests);

    let addBreakFastCount = () => {
        // if (breakFastCount < occupants) {
        setBreakFastCount(Number(breakFastCount) + 1);
        // }

    };
    let minusBreakFastCount = () => {
        if (breakFastCount > 1) {
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
    const onAccept = () => {
        const data = { reservationId: reservationId, numberOfGuests: breakFastCount }
        cameTobreakfast(data)
        // getBreakFast()
        dismiss()
    }

    const clearDefaultPhoto = () => {
        setSignature(null)
        // this.props.onClearValue('note')
    }

    const handleClear = () => {
    }
    let clearText = "Clear"
    let saveText = "Save"
    // let numberOfguest = !_.isEmpty(breakfastForPerson) && breakfastForPerson.length > 1 ? _.last(breakfastForPerson).numberOfGuests : breakfastForPerson[0].numberOfGuests
    let isDisableAccept = breakFastCount > 0
    return (
        <View style={[styles.taskModalInnerContainer]}>
            <View style={[styles.headerContainer,{height: headerContainer === true ? "10%" : "13%",}]}>
                <View style={styles.horizontalContainer}>
                    <Text style={[styles.headerTitle, { flex: 1 }]}>Breakfast</Text>
                    <TouchableOpacity style={[{ alignItems: 'center', justifyContent: 'center'}]} onPress={dismiss}>
                        <Ionicons name="ios-close-outline" color="white" size={35} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView scrollEnabled={scrollEnabled} style={{ flexGrow: 1, alignContent: 'flex-start' }} showsVerticalScrollIndicator={false}>
                <View style={[styles.alertBodyContainer]}>
                    <View style={styles.roomLabelHeader}>
                        <Text style={styles.roomTitle}>{"Room " + name}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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
                        <TouchableOpacity style={styles.circleView} onPress={minusBreakFastCount} disabled={occupants > 0 ? (occupants < breakFastCount ? true : false) : false}>
                            <Entypo name='minus' size={30} color={"#1D2F58"} />
                        </TouchableOpacity>
                        {/* <Text style={styles.numberOfBreakFastText}>{breakFastCount <= 9 ? "0" + breakFastCount : breakFastCount}</Text> */}
                        <Text style={styles.numberOfBreakFastText}>{breakFastCount + " / " + occupants}</Text>

                        <TouchableOpacity style={styles.circleView} onPress={addBreakFastCount} disabled={occupants > 0 ? (occupants <= breakFastCount ? true : false) : false}>
                            <Entypo name='plus' size={30} color={"#1D2F58"} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.borderView}></View>
                    {

                        !_.isEmpty(otherProperties) ?
                            !_.isEmpty(otherProperties) && otherProperties.map((product) => {
                                let brekfastValue = product?.value.toUpperCase()
                                if (product?.key === "product_name" && (!((brekfastValue?.includes("PDJ")) || (brekfastValue?.includes("ALLCOUNT"))))) {
                                    return (
                                        <View style={styles.signatureView}>
                                            <View style={styles.signatureHeaderView}>
                                                <Text style={styles.signatureInstructionText}>By signing here, i accept the cost of the breakfast</Text>
                                            </View>
                                            <SignatureScreen
                                                onClear={handleClear}
                                                onBegin={() => setScrollEnabled(false)}
                                                onEnd={() => setScrollEnabled(true)}
                                                clearText={clearText}
                                                webStyle={style}
                                            // confirmText={saveText}
                                            />
                                        </View>
                                    )
                                }
                                else {
                                    return (<></>)
                                }
                            }) :

                            <View style={styles.signatureView}>
                                <View style={styles.signatureHeaderView}>
                                    <Text style={styles.signatureInstructionText}>By signing here, i accept the cost of the breakfast</Text>
                                </View>
                                <SignatureScreen
                                    onClear={handleClear}
                                    onBegin={() => setScrollEnabled(false)}
                                    onEnd={() => setScrollEnabled(true)}
                                    clearText={clearText}
                                    webStyle={style}
                                // confirmText={saveText}
                                />
                            </View>
                    }
                    {/* <View style={styles.bottomView}>
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
                    </View> */}

                </View>
            </ScrollView>
            <View style={[styles.buttonContainer,{height: headerContainer === true ? "15%" : "20%"}]}>
                <TouchableOpacity disabled={breakFastCount > 0 ? false : true} style={[styles.confirmBtn]} onPress={() => onAccept()}>
                    <Text style={styles.btnText}>{I18n.t('base.popup.index.accept').toUpperCase()}</Text>
                </TouchableOpacity>
            </View>
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
        // height: "13%",
        ...splashBg.bg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',

    },
    horizontalContainer: {
        flexDirection: 'row',
        // backgroundColor:"red",
        width: "100%",
    },
    headerTitle: {
        fontSize: Platform.OS === "android" ? 26 : 28,
        // lineHeight: 48,
        ...white.text,
        fontWeight: '700',
        textAlign: 'center',
        paddingLeft: 25,
    },
    closeButtonContainer: {
        height: 44,
        width: 44,
        borderRadius: 22,
        alignSelf: 'center',
        right: 22,
        position: 'absolute',
        backgroundColor: "red"
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
        paddingRight: 35,
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
        paddingRight: 4
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
        alignSelf: "center",
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
        // height: "20%",
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 20,
        paddingHorizontal: 20
        // paddingTop: 25
    },
    confirmBtn: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderRadius: 5,
        // margin: 3,
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
    adultsChildrenIconView: {
        flexDirection: "row",
        justifyContent: "center",
    },
    signatureView: {
        width: "105%",
        height: "auto",
        marginTop: 20,
        alignSelf: "center",
        borderColor: "black",
        borderWidth: 1,
        padding: 2,
    },
    signatureHeaderView: {
        flexDirection: "row",
        paddingTop: 5,
        marginBottom: 5
    },
    signatureInstructionText: {
        width: "100%",
        paddingLeft: 10,

    },
    clearSignatureView: {
        width: "20%",
        alignItems: "center",
        justifyContent: "center",
    }
});

export default ModalContent;
