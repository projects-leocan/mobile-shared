import React, { Component } from "react";
import { ScrollView, View, StyleSheet, Image } from "react-native";
import { get, last, first, flatten, map, isEmpty, compact, find } from 'lodash';
import pickActiveReservation from 'rc-mobile-base/lib/utils/pick-active-reservation';
import _ from "lodash";

class BedsSetup extends Component {
    renderBedImage = (newObj) => {
        return (
            <>
                {
                    !_.isEmpty(newObj) && newObj.map((data) => {
                        let newKey = data.key.toUpperCase()
                        if (data.key === "GL") {
                            return (
                                Array.from({ length: data.value }, () =>
                                    <View style={styles.imageView}>
                                        <Image style={{ width: "100%", height: "100%" }} resizeMode="contain" source={require("rc-mobile-base/lib/images/BedImages/Twin.png")} />
                                    </View>
                                )

                            )
                        } else if (data.key === "L") {
                            return (
                                Array.from({ length: data.value }, () =>
                                    <View style={styles.imageView}>
                                        <Image style={{ width: "100%", height: "100%" }} resizeMode="contain" source={require("rc-mobile-base/lib/images/BedImages/single.png")} />
                                    </View>
                                )
                            )
                        } else if (data.key === "B") {
                            return (
                                Array.from({ length: data.value }, () =>
                                    <View style={styles.imageView}>
                                        <Image style={{ width: "100%", height: "100%" }} resizeMode="contain" source={require("rc-mobile-base/lib/images/BedImages/Sofa.png")} />
                                    </View>
                                )
                            )

                        } else {
                            return (<></>)
                        }
                    })
                }
            </>
        )
    }
    render() {
        const { room } = this.props;
        let roomCalendar = compact(flatten(map(get(room, 'roomCalendar', []))))
        const activeReservationId = pickActiveReservation(get(room, 'guests', []), false);
        let activeRoomCalender = !_.isEmpty(roomCalendar) && roomCalendar.filter((data) => {
            if (data?.id === activeReservationId) {
                return data
            }
        })

        let bedSetUpObject = !_.isEmpty(activeRoomCalender) && activeRoomCalender[0]?.otherProperties?.filter((data) => {
            if (data?.key === "BedsSetup") {
                return data
            }
        })

        let bedSetUpValue = !_.isEmpty(bedSetUpObject) && get(bedSetUpObject, 0, false);

        if (bedSetUpValue === false) {
            return null
        }

        let bedValue = bedSetUpValue?.value
        let splitedValue = _.split(bedValue, '+');

        let characters = "";
        let integers = 0
        let newObj = !_.isEmpty(splitedValue) && splitedValue.map((data) => {
            characters = data.split(/\d+/).join('');
            integers = data.split(/\D+/).map(Number).filter(Boolean);
            return { key: characters, value: _.isEmpty(integers) ? 1 : integers[0] }
        })

        return (
            activeRoomCalender === false ? <></> :
                <View style={styles.mainView}>
                    <ScrollView style={styles.subView} horizontal={true}>
                        {this.renderBedImage(newObj)}
                    </ScrollView>

                </View>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        width: "100%", height: "15%", alignItems: "center", marginTop: 10
    },
    subView: {
        width: "90%", height: "100%"
    },
    imageView: {
        width: 100, height: "100%", marginRight: 10
    }
})

export default BedsSetup