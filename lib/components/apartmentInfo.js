import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {
    white
} from 'rc-mobile-base/lib/styles';
import I18n from 'react-native-i18n'
import { get } from 'lodash';

const labelColor = '#a7acb2';

const validateIsEmptyInfo = (info) => {
    if (info != null && info != 'NA') {
        return info
    } else {
        return null
    }
}

class ApartmentInfo extends Component {

    render() {
        const {
            room,
            style
        } = this.props;

        const infoAccess = validateIsEmptyInfo(get(room, 'infoAccess', null));
        const infoWifi = validateIsEmptyInfo(get(room, 'infoWifi', null));
        const infoGarbage = validateIsEmptyInfo(get(room, 'infoGarbage', null));
        const infoParking = validateIsEmptyInfo(get(room, 'infoParking', null));
        const infoImportant = validateIsEmptyInfo(get(room, 'infoImportant', null));
        const infoOther = validateIsEmptyInfo(get(room, 'infoOther', null));
        const address = validateIsEmptyInfo(get(room, 'address', null));

        return (
            <View style={styles.infoContainer}>
                {infoAccess ? (
                    <View style={styles.cardContainer}>
                        <Text style={styles.cardLabel}>Access</Text>
                        <Text style={styles.cardDescription}>{infoAccess}</Text>
                    </View>
                ): null}
                {infoGarbage ? (
                    <View style={styles.cardContainer}>
                        <Text style={styles.cardLabel}>Garbage</Text>
                        <Text style={styles.cardDescription}>{infoGarbage}</Text>
                    </View>
                ): null}
                {infoParking ? (
                    <View style={styles.cardContainer}>
                        <Text style={styles.cardLabel}>Parking</Text>
                        <Text style={styles.cardDescription}>{infoParking}</Text>
                    </View>
                ) : null}
                {address && (
                    <View style={styles.cardContainer}>
                        <Text style={styles.cardLabel}>address</Text>
                        <Text style={styles.cardDescription}>{address}</Text>
                    </View>
                )}
                {infoWifi ? (
                    <View style={styles.cardContainer}>
                        <Text style={styles.cardLabel}>Wifi</Text>
                        <Text style={styles.cardDescription}>{infoWifi}</Text>
                    </View>
                ) : null}
                {infoImportant ? (
                    <View style={styles.cardContainer}>
                        <Text style={styles.cardLabel}>Important</Text>
                        <Text style={styles.cardDescription}>{infoImportant}</Text>
                    </View>
                ) : null}
                {infoOther ? (
                    <View style={styles.cardContainer}>
                        <Text style={styles.cardLabel}>Other</Text>
                        <Text style={styles.cardDescription}>{infoOther}</Text>
                    </View>
                ) : null}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    infoContainer: {
        flexGrow: 1,
        margin: 2
    },
    cardContainer: {
        width: '100%',
        borderRadius: 8,
        padding: 16,
        backgroundColor: white.color,
        marginVertical: 5
    },
    cardLabel: {
        fontSize: 14,
        color: labelColor
    },
    cardDescription: {
        fontSize: 16,
        padding: 5
    }

});

export default ApartmentInfo;
