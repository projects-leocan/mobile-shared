import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Colors from 'rc-mobile-base/lib/styles/colors';
import {
    lCenterCenter,
    red,
  } from 'rc-mobile-base/lib/styles';

const styles = StyleSheet.create({
    rootContainer: {
        height: '100%',
        width: '100%'
    },
    assetTypeContainer: {
        height: 50,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    imageListContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    imgItemCellContainer: {
        height: wp('45%%'),
        width: wp('45%'),
        backgroundColor: Colors.grey400.color,
        alignItems: 'center',
        justifyContent: 'center',
        margin: wp('2.3%')
    },
    addAssetsCircle: {
        height: wp('16%'),
        width: wp('16%'),
        borderRadius: wp('8%'),
        backgroundColor: Colors.white.color,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        marginBottom: 10,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addAssetsText: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 8
    },
    recordButtonOuterContainer: {
        height: 70,
        width: 70,
        borderRadius: 35,
        borderWidth: 4,
        borderColor: Colors.white.color,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    //
    itemImage: {
        height: '100%',
        width: '100%',
    },
    cancelItemContainer: {
        height: 30,
        width: 30,
        top: 8,
        right: 8,
        position: 'absolute',
        zIndex: 2
    },
    centerContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center'
    },
    videoContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: hp('100%') - 40,
        width: wp('100%')
    },
    passBtn: {
        height: 60,
        ...lCenterCenter,
        backgroundColor: 'white'
      },
      passBtnText: {
        ...red.text
      },
});

export default styles;