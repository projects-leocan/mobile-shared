import { StyleSheet } from 'react-native';

const stepIndicatorBG = '#f4f8ff';

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFF'
    },

    rootContainer: {
        flex: 1
    },

    stepIndicator: {
        paddingVertical: 25,
        backgroundColor: stepIndicatorBG
    },

    pageContainer: {
        flex: 1,
        width: '100%',
        padding: 20,
        backgroundColor: '#FFFFFF'
    },

    stepIndicatorIcon: {
        height: 25,
        width: 25,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default styles;