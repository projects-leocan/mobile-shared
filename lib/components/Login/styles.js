import { StyleSheet } from 'react-native';
import {
  flex1,
  lCenterCenter,
  lStartCenter,
  lEndCenter,
  padding,
  margin,
  positioning,
  blue500,
  blue300,
  blue200,
  blue100,
  white,
  opacityWhite
} from '../../styles';

export default StyleSheet.create({
  container: {
    ...blue500.bg,
    ...flex1
  },
  hotelNameContainer: {
    ...lCenterCenter,
    ...white.bg,
    ...padding.b15,
    height: 240
  },
  logoImage: {
    height: 120,
    width: 250
  },
  infoContainer: {
    ...lCenterCenter,
    ...padding.t15,
    ...opacityWhite.p30.bg
  },
  text: {
    ...white.text,
    ...margin.b10,
    fontSize: 18,
    fontWeight: "500"
  },
  header: {
    ...margin.b10,
    fontSize: 20,
    fontWeight: '500'
  },
  subheader: {
    fontSize: 17,
    fontWeight: '400'
  },
  inputContainer: {
    ...opacityWhite.p30.bg,
    borderRadius: 5
  },
  inputField: {
    ...padding.x15,
    ...white.text,
    height: 44
  },
  btnContainer: {
    ...flex1,
    ...lStartCenter,
    ...padding.t20,
    flexDirection: 'column',
  },
  usersContainer: {
    ...padding.a10,
    ...margin.b10,
    flexDirection: 'row'
  },
  userImage: {
    ...margin.x5,
    height: 48,
    width: 48,
    borderRadius: 24
  },
  backButtonContainer: {
    ...opacityWhite.p20.bg,
    ...positioning.t10,
    ...positioning.l10,
    position: 'absolute',
    zIndex: 10,
  },
  inputs: {
    ...padding.a20,
    ...blue300.bg,
  },
  logoContainer: {
    ...lEndCenter,
    ...white.bg,
    ...padding.b15,
    height: 180
  },
  hotelInput: {
    ...padding.x15,
    ...white.text,
    height: 44,
    fontFamily: 'Courier'
  },
  hotelContainer: {
    ...flex1,
    alignItems: 'stretch'
  },
  hotelInfoContainer: {
    ...lStartCenter,
    ...padding.t30,
    ...padding.b20
  },
  hotelInputContainer: {
    ...lCenterCenter,
    ...margin.a20,
    ...opacityWhite.p30.bg,
    borderRadius: 5
  },
  hotelBtnContainer: {
    ...flex1,
    ...lStartCenter,
  },
  continueBtn: {
    ...opacityWhite.p30.bg,
    height: 80,
    width: 80,
    borderRadius: 40,
    ...lCenterCenter
  }
});
