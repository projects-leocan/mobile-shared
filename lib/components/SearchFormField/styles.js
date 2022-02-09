import { StyleSheet } from 'react-native';
import { margin, padding, greyLt } from '../../styles';

export default StyleSheet.create({
  input: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: greyLt.color,
    paddingVertical: 0,
    fontSize: 16,
    height: 45,
    ...padding.l5
  }
});
