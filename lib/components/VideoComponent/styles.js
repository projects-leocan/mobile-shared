import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: 'black'
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    centerContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center'
    },
    actionHeaderContainer: {
        top: 12,
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        zIndex: 99
    },
    actionItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12
    }
})

export default styles;