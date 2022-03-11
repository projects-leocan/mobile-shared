import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { themeTomato, lightPink, splashBg, white, isTab } from 'rc-mobile-base/lib/styles'

const stepIndicatorBG = '#f4f8ff';
const buttonBorderColor = '#cfd4de';

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        width: '100%'
    },
    addRoomSection: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addRoomRoundContainer: {
        height: isTab ? wp('10%') : wp('20%'),
        width: isTab ? wp('10%') : wp('20%'),
        borderRadius: isTab ? wp('5%') : wp('10%'),
        backgroundColor: lightPink.color,
        borderWidth: 1,
        borderColor: themeTomato.color,
        alignItems: 'center',
        justifyContent: 'center'
    },
    smallAddRoomRoundContainer: {
        height: isTab ? wp('6%') : wp('15%'),
        width: isTab ? wp('6%') : wp('15%'),
        borderRadius: isTab ? wp('3%') : wp('7.5%'),
        backgroundColor: lightPink.color,
        borderWidth: 1,
        borderColor: themeTomato.color,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addRoomLabel: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '500',
        color: splashBg.color,
        marginVertical: 8
    },
    selctedPreviewContainer: {
        height: 'auto',
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginBottom: 12,
        marginHorizontal: 14,
    },
    sectionLabel: {
        alignSelf: 'flex-start',
        width: '100%',
        fontSize: 24,
        fontWeight: '600',
        color: splashBg.color,
        marginBottom: 8
    },

    //

    sectionContainer: {
        width: '100%',
        marginVertical: hp('1%')
    },
    sectionLabel: {
        alignSelf: 'flex-start',
        width: '100%',
        fontSize: 24,
        fontWeight: '600',
        color: splashBg.color
    },
    sectionButton: {
        minHeight: 60,
        width: '100%',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: buttonBorderColor,
        borderRadius: 5,
        marginVertical: 8,
        padding: 8
    },
    selectionPlaceholderContainer: {
        justifyContent: 'center',
        flex: 0.8
    },
    selectionPlaceholder: {
        textAlign: 'left',
        color: '#808080',
        fontSize: 18,
        paddingHorizontal: 18
    },
    sectionButtonRightContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.2,
    },
});

export default styles;