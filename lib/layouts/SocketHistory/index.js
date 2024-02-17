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
                        <Text style={styles.label}>{socketDate + " at " + socketTime}</Text>
                        : <></>
                }
                <Text style={styles.label}>{socketData.socket}</Text>
                <Text style={styles.label}>{socketData.description}</Text>
                <Text style={styles.label}>{socketData.api}</Text>
            </View>
        )
    }
    HeaderComponent = () => {
        return (
            <View style={[styles.headerContainer, { backgroundColor: "white" }]}>
                <Text style={styles.HeaderLabel}>Date & Time</Text>
                <Text style={styles.HeaderLabel}>Socket</Text>
                <Text style={styles.HeaderLabel}>Description</Text>
                <Text style={styles.HeaderLabel}>Api endpoint</Text>
            </View>


        )
    }
    render() {
        const { socketData } = this.props
        const reversedSocketData = socketData.slice().reverse();
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
        width: windowWidth / 4,
        textAlign: "center"
    },
    HeaderLabel: {
        fontSize: 20,
        color: "black",
        fontWeight: "700",
        width: windowWidth / 4,
        textAlign: "center"
    }
});

const mapStateToProps = (state) => {
    return {
        socketData: state.rooms.socketData,
    }
};

export default connect(mapStateToProps, null)(SocketHistory);