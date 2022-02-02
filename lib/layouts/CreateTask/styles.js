import { StyleSheet } from 'react-native';

const stepIndicatorBG = '#f4f8ff';

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        width: '100%'
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
    }
});

export default styles;