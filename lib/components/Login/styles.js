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
  opacityWhite,
  black,
  splashBg,
  isTab
} from '../../styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    ...splashBg.bg,
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
    ...splashBg.bg,

  },
  logoContainer: {
    ...lEndCenter,
    ...white.bg,
    ...padding.b15,
    ...blue500.bg,
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
    ...padding.a20,
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
  },

  // new Login
  loginRootcontainer: {
    ...white.bg,
    ...flex1
  },
  headerContainer: {
    height: hp('30%'),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bodyContainer: {
    height: hp('40%'),
    width: '100%'
  },
  bottomContainer: {
    height: hp('30%'),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    height: hp('20%'),
    width: hp('20%'),
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  screenTitle: {
    fontSize: 30,
    color: "#000",
    fontWeight: 'bold',
    marginBottom: 15
  },
  loginActionContainer: {
    flexGrow: 1,
    paddingVertical: 40
  },
  fieldText: {
    marginVertical: 10
  },
  loginInputContainer: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
  },
  loginInputField: {
    ...padding.x15,
    ...black.text,
    flex: 1
  },
  loginButtonContainer: {
    marginVertical: 25
  },
  absoluteTriangle: {
    right: 0,
    zIndex: -99,
    bottom: isTab ? wp('10%') : hp('12%'),
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  trangleImage: {
    height: isTab ? hp('25%') : wp('45%'),
    width: isTab ? hp('15%') : wp('25%'),
    resizeMode: 'stretch',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  }
});
