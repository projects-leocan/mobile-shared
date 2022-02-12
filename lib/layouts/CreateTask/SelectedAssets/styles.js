import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { themeTomato, isTab } from 'rc-mobile-base/lib/styles'

const placeHolderColor = '#f8f8f8';

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 8
    },

    topContainer: {
        flex: 1
    },

    bottomContainer: {
        flex: 0.4
    },

    imagePlaceHolder: {
        height: isTab ? hp('50%') : wp('100%') - 56,
        width: isTab ? wp('100%') - 56 : wp('100%') - 56,
        backgroundColor: placeHolderColor,
        alignItems: 'center',
        justifyContent: 'center'
    },

    placeHolderImage: {
        height: isTab ? wp('10%') : wp('20%'),
        width: isTab ? wp('10%') : wp('20%'),
        resizeMode: 'contain'
    },

    buttonHolderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonContainer: {
        width: '100%',
        marginBottom: 18
    },

    assetsListStyle: {
        flexGrow: 1,
        backgroundColor: '#f0f'
    },

    assetsListContainer: {
        flexGrow: 1,
    },

    assetsCell: {
        height: (wp('100%') - 56) / 3.5,
        width: (wp('100%') - 56) / 3.5,
        backgroundColor: placeHolderColor,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: ((wp('100%') - 56) - ((wp('100%') - 56) / 3.5) * 3) / 6,
        borderRadius: 5,
    },

    closeCellContainer: {
        height: 26,
        width: 26,
        borderRadius: 13,
        backgroundColor: themeTomato.color,
        position: 'absolute',
        top: -5,
        right: -5,
        zIndex: 99
    },

    closeCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    cellImage: {
        flex: 1,
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 5,
    }

});

export default styles;