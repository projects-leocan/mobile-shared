import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { themeTomato, lightPink, splashBg, lightBlueBorder } from 'rc-mobile-base/lib/styles'

const stepIndicatorBG = '#f4f8ff';
const buttonBorderColor = '#cfd4de';

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 8
    },
    bodySection: {
        flex: 0.85
    },
    footerSection: {
        flex: 0.15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addRoomSection: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addRoomRoundContainer: {
        height: wp('20%'),
        width: wp('20%'),
        borderRadius: wp('10%'),
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

    assetsSectionContainer: {

    },

    assetsSelectionCell: {
        height: 35,
        minWidth: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: lightBlueBorder.color,
    },

    actionBtn: {
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: stepIndicatorBG,
        borderRadius: 4,
        marginRight: 6,
        marginBottom: 6,
        height: 44,
        width: 'auto',
        borderWidth: 1,
        borderColor: buttonBorderColor
    },
    actionBtnLabel: {
        color: splashBg.color,
        fontSize: 15,
        fontWeight: "600"
    },
    selectedActionbtn: {
        backgroundColor: splashBg.color,
    },
    actionSectionContainer: {
        minHeight: 60,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 8,
        paddingVertical: 8
    },
    textAreaContainer: {
        borderWidth: 1,
        borderColor: buttonBorderColor,
        borderRadius: 5,
        marginVertical: 8,
        padding: 8
    },
    textArea: {
        minHeight: 100,
        justifyContent: "flex-start"
    }

});

export default styles;