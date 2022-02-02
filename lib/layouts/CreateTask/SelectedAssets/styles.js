import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const placeHolderColor = '#f8f8f8';

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 8,
    },

    imagePlaceHolder: {
        height: wp('100%') - 56,
        width: wp('100%') - 56,
        backgroundColor: placeHolderColor,
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonHolderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonContainer: {
        width: '100%',
        marginBottom: 18
    }

});

export default styles;