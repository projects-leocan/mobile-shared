import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    lightBlue,
    splashBg,
    themeTomato,
    activeGreen,
    white
} from '../../styles';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { connect } from 'react-redux';
import { availableHotelsSelector, hotelIdSelector } from 'rc-mobile-base/lib/selectors/auth';
import { computedHotelsTask, selectedHotel } from 'rc-mobile-base/lib/selectors/hotelsTask';
import { activeAvailHotel } from 'rc-mobile-base/lib/actions/hotelsTask';
import { get } from 'lodash';

class DrawerHotels extends React.Component {
    constructor(props) {
        super(props);
    }

    onNavigateToTask = (hotelId) => {
        const { activeAvailHotel, navigation, screenProps, selectedHotel } = this.props;
        if(selectedHotel !== hotelId) {
            activeAvailHotel(hotelId);
        }

        if (get(screenProps, 'isAttendantApp', false)) {
            return navigation.navigate('Tasks', { hotelId: hotelId })
        } else if (get(screenProps, 'isMaintenanceApp', false)) {
            return navigation.navigate('Main', { hotelId: hotelId })
        } else if (get(screenProps, 'isRunnerApp', false)) {
            return navigation.navigate('Tasks', { hotelId: hotelId })
        } else if (get(screenProps, 'isInspectorApp', false)) {
            return navigation.navigate('Tasks', { hotelId: hotelId })
        }
    }

    renderHotelRow = (item, index) => {
        const { selectedHotel } = this.props;
        const availableTaskForItem = get(item, 'hotelsTask', []);
        const hotelId = get(item, 'hotelId', null);

        return (
            <TouchableOpacity style={styles.itemCellContainer} activeOpacity={0.7} onPress={() => this.onNavigateToTask(hotelId)} >
                <View style={[styles.hotelImageContainer, { backgroundColor: selectedHotel === hotelId ? splashBg.color : themeTomato.color }]}>
                    <Icon name="bed-outline" size={30} color={white.color} />
                </View>
                <View style={styles.hotelNameContainer}>
                    <Text style={styles.hotelNameLabel}>{item.hotelName}</Text>
                </View>
                <View style={styles.taskCountOuterContainer}>
                    <View style={styles.taskCountContainer}>
                        <Text style={styles.taskCountLabel}>{get(availableTaskForItem, 'length')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { handleHotelChange, hotelsTask } = this.props;

        return (
            <View style={[styles.container, { padding: -20 }]}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text onPress={handleHotelChange} style={styles.headerLabel}>Hotels</Text>
                    </View>

                    <View style={styles.listContainer}>
                        <FlatList
                            data={hotelsTask}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => this.renderHotelRow(item, index)}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    headerContainer: {
        height: hp('12%'),
        width: '100%',
        backgroundColor: lightBlue.color,
        justifyContent: 'center'
    },
    headerLabel: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingLeft: 20
    },
    listContainer: {
        flex: 1,
        width: '100%',
        paddingTop: 20
    },
    itemCellContainer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row'
    },
    hotelImageContainer: {
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: themeTomato.color
    },
    hotelNameContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 10,
        justifyContent: 'center'
    },
    hotelNameLabel: {
        fontSize: 18,
        fontWeight: '700'
    },
    taskCountOuterContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    taskCountContainer: {
        height: 36,
        width: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: activeGreen.color
    },
    taskCountLabel: {
        fontSize: 16,
        fontWeight: '600'
    }
})

const mapStateToProps = state => {
    return {
        availableHotels: availableHotelsSelector(state),
        hotelsTask: computedHotelsTask(state),
        selectedHotel: selectedHotel(state) || hotelIdSelector(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        activeAvailHotel: hotelId => dispatch(activeAvailHotel(hotelId)),
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerHotels);