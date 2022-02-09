import { StyleSheet, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { splashBg } from 'rc-mobile-base/lib/styles'

const styles = StyleSheet.create({
    headerContainer: {
        height: getStatusBarHeight(),
        width: '100%',
        justifyContent: 'center',
        overflow: 'visible',
        backgroundColor: splashBg.color
    },
})

export default styles;
