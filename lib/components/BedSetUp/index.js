import React, { Component } from "react";
import { ScrollView, View, StyleSheet, Image } from "react-native";
import { get, last, first, flatten, map, isEmpty, compact, find } from 'lodash';
import _ from "lodash";

class BedsSetup extends Component {
    renderBedImage = (newObj) => {
        return (
            <>
                {
                    !_.isEmpty(newObj) && newObj.map((data) => {
                        let newKey = data.key.toUpperCase()
                        if (newKey === "GL") {
                            return (
                                Array.from({ length: data.value }, () =>
                                    <View style={styles.imageView}>
                                        <Image style={{ width: "100%", height: "100%" }} resizeMode="contain" source={require("rc-mobile-base/lib/images/BedImages/Twin.png")} />
                                    </View>
                                )

                            )
                        } else if (newKey === "L") {
                            return (
                                Array.from({ length: data.value }, () =>
                                    <View style={styles.imageView}>
                                        <Image style={{ width: "100%", height: "100%" }} resizeMode="contain" source={require("rc-mobile-base/lib/images/BedImages/single.png")} />
                                    </View>
                                )
                            )
                        } else if (newKey === "B") {
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
        const { room, isInspector, activeId } = this.props;
        let roomCalendar = compact(flatten(map(get(room, 'roomCalendar', []))))
        let activeRoomCalender = !_.isEmpty(roomCalendar) && roomCalendar.filter((data) => {
            if (data?.id === activeId) {
                return data
            }
        })
        let source = !_.isEmpty(activeRoomCalender) && activeRoomCalender[0]?.otherProperties?.filter((data) => {
            if (data?.key === "source") {
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
        let filterValue = bedValue.replace(/\s/g, '')
        let splitedValue = _.split(filterValue, '+');

        let characters = "";
        let integers = 0
        let newObj = !_.isEmpty(splitedValue) && splitedValue.map((data) => {
            characters = data.split(/\d+/).join('');
            integers = data.split(/\D+/).map(Number).filter(Boolean);
            return { key: characters, value: _.isEmpty(integers) ? 1 : integers[0] }
        })
        return (
            activeRoomCalender === false ? <></> : !_.isEmpty(source) && source[0].value === "ClubMed" &&  !_.isEmpty(bedValue)? 
                <View style={[styles.mainView,{marginLeft: isInspector ? 0 : "5%"}]}>
                    <ScrollView style={styles.subView} horizontal={true}>
                        {this.renderBedImage(newObj)}
                    </ScrollView>
                </View> : <></>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        width: "100%", height:100, marginTop: 10
    },
    subView: {
        width: "95%", height: "100%"
    },
    imageView: {
        width: 100, height: "100%", marginRight: 10
    }
})

export default BedsSetup