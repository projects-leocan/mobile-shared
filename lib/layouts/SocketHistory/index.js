import React, { Component } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { connect } from 'react-redux'
import {
    eitherGrey_100_200,
    padding
} from 'rc-mobile-base/lib/styles';
import { Dimensions } from 'react-native';
import _ from "lodash";

const windowWidth = Dimensions.get('window').width;

class SocketHistory extends Component {

    renderData = ({ item, index }) => {
        const socketData = item?.socketData
        let formatSocketDateTime = socketData.dateTime.split(" ");
        let socketDate = !_.isEmpty(formatSocketDateTime) && formatSocketDateTime[0]
        let socketTime = !_.isEmpty(formatSocketDateTime) && formatSocketDateTime[1]
        return (
            <View style={[styles.container, eitherGrey_100_200(index % 2).bg]}>
                
                {
                    !_.isEmpty(socketDate) && !_.isEmpty(socketTime) ?
                        <Text style={[styles.label, {width:"10%"}]}>{socketData.dateTime}</Text>
                        : <></>
                }
                <Text style={[styles.label, {width:"10%"}]}>{socketData.roomName}</Text>
                <Text style={[styles.label, {width:"10%"}]}>{socketData.code}</Text>
                <Text style={[styles.label, {width:"20%"}]}>{socketData.socket}</Text>
                <Text style={[styles.label, {width:"25%"}]}>{socketData.description}</Text>
                <Text style={[styles.label, {width:"25%"}]}>{socketData.api}</Text>
            </View>
        )
    }
    HeaderComponent = () => {
        return (
            <View style={[styles.headerContainer, { backgroundColor: "white" }]}>
                <Text style={[styles.HeaderLabel, {width:"10%"}]}>Date & Time</Text>
                <Text style={[styles.HeaderLabel, {width:"10%"}]}>Room</Text>
                <Text style={[styles.HeaderLabel, {width:"10%"}]}>Inspection Code</Text>
                <Text style={[styles.HeaderLabel, {width:"20%"}]}>Socket/Status</Text>
                <Text style={[styles.HeaderLabel, {width:"25%"}]}>Description</Text>
                <Text style={[styles.HeaderLabel, {width:"25%"}]}>Api endpoint</Text>
            </View>


        )
    }
    render() {
        const { socketData } = this.props
        const reversedSocketData = _.isEmpty(socketData) ? [] : socketData;
        return (
            <View style={styles.mainContainer}>
                <FlatList
                    data={reversedSocketData}
                    renderItem={this.renderData}
                    ListHeaderComponent={this.HeaderComponent}
                    stickyHeaderIndices={[0]}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        height: "100%",

    },
    container: {
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        ...padding.x10
    },
    headerContainer: {
        minHeight: 60,
        width:"100%",
        flexDirection: 'row',
        alignItems: 'center',
        // borderBottomColor:"black",
        // borderBottomWidth:1,
        ...padding.x10
    },
    label: {
        fontSize: 16,
        color: "black",
        // fontWeight:"700",
        // width: windowWidth / 6,
        textAlign: "center"
    },
    HeaderLabel: {
        fontSize: 20,
        color: "black",
        fontWeight: "700",
        // width: windowWidth / 6,
        textAlign: "center"
    }
});

const mapStateToProps = (state) => {
    return {
        socketData: state.rooms.socketData,
    }
};

export default connect(mapStateToProps, null)(SocketHistory);