import { StyleSheet } from 'react-native';

const stepIndicatorBG = '#f4f8ff';
import { splashBg } from 'rc-mobile-base/lib/styles';

const styles = StyleSheet.create({
   buttonContainer: {
       height: 60,
       width: '100%',
       backgroundColor: 'transparent',
       borderWidth: 1,
       borderColor: splashBg.color,
       borderRadius: 8,
       alignItems: 'center',
       justifyContent: 'center'
   },

   labelText: {
       fontSize: 18,
       fontWeight: 'bold',
       color: splashBg.color
   }
});

export default styles;