import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
    flxRow,
    flxCol,
    padding,
    margin,
    blue500,
    flex1,
    flx1,
    jcc,
    jcsb,
    jcsa,
    lCenterCenter,
    aic,
    white,
    asfe,
} from 'rc-mobile-base/lib/styles';

export const ModalHeader = ({ value, onLeftAction, onRightAction, rightIconName = 'ios-checkmark', onPress }) => (
    <View style={[flxRow, blue500.bg, jcsa, aic, { height: 55 }]}>
        <TouchableOpacity style={styles.headerLeft} onPress={onLeftAction}>
            <Ionicons
                name="ios-close-outline"
                size={30}
                color={white.color}
            />
        </TouchableOpacity>

        <View style={styles.headerBody}>
            <Text style={[white.text, { fontSize: 17, textAlign: 'center' }]}>
                {value}
            </Text>
        </View>

        <TouchableOpacity style={styles.headerLeft} onPress={onRightAction}>
            <Ionicons
                name={rightIconName}
                size={rightIconName === 'ios-checkmark' ? 30 : 25}
                color={white.color}
            />
        </TouchableOpacity>
    </View>
)

export default ModalHeader

const styles = StyleSheet.create({
    headerLeft: {
        width: 60,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerBody: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})