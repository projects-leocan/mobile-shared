import React, { PropTypes, Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  InteractionManager
} from 'react-native';
import I18n from 'react-native-i18n';
import DeviceInfo from 'react-native-device-info';
import { get } from 'lodash';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Divider from 'rc-mobile-base/lib/components/Divider';

import AuthActions from '../../actions/auth';
import { userInfoSelector, hotelNameSelector, authConfigSelector, userIsOnDutySelector } from '../../selectors/auth';
import { computedHotelName } from 'rc-mobile-base/lib/selectors/hotelsTask';
import { drawerDisabledSelector } from './selectors';
import {
  green,
  flxCol,
  circle,
  margin,
  flxRow,
  aic,
  jcc,
  red,
  splashBgColor,
  blue500,
  isTab,
  white
} from '../../styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import DrawerButton from './DrawerButton';
import bellhopImage from './bellhop.png';
import splashSmImage from '../../images/splash_logo.png';
import attendantUserPlaceholder from '../../images/attendantUserPlaceholder.png';
import maintenanceUserPlaceholder from '../../images/maintenanceUserPlaceholder.png';
import runnerUserPlaceholder from '../../images/runnerUserPlaceholder.png';
import inspectorUserPlaceholder from '../../images/inspectorUserPlaceholder.png';

import Data from 'rc-mobile-base/lib/utils/data';
import DrawerHotels from './DrawerHotels';

class DrawerContent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isShowHotelList: false
    }
    // this.data = new Data(this.props.dispatch);
    this.data = new Data(this.props.dispatch);

  }

  renderPlaceHolder = () => {
    const { screenProps } = this.props;

    if (get(screenProps, 'isAttendantApp', false)) {
      return attendantUserPlaceholder
    } else if (get(screenProps, 'isMaintenanceApp', false)) {
      return maintenanceUserPlaceholder
    } else if (get(screenProps, 'isRunnerApp', false)) {
      return runnerUserPlaceholder
    } else if (get(screenProps, 'isInspectorApp', false)) {
      return inspectorUserPlaceholder
    }
  }

  handleHotelChange() {
    const { isShowHotelList } = this.state;
    const { navigation } = this.props;
    this.setState({ isShowHotelList: !isShowHotelList })

    if (isShowHotelList) {
      navigation.closeDrawer();
    }
    // this.data._forceRunForHotelChange();
  }

  render() {
    const logout = this.props.logout;
    const { isShowHotelList } = this.state;

    if (isShowHotelList) {
      return <DrawerHotels {...this.props} handleHotelChange={() => this.handleHotelChange()} />
    } else {
      try {
        const { userInfo, hotelName, links, navigation, authConfig, disabled, screenProps, selectedHotelName, isOnDuty } = this.props;
        const allowedLinks = links
          .filter(link => !disabled.includes(link.transition))

        return (
          <View style={[styles.container, { padding: -20 }]}>
            <View style={styles.container}>
              <View style={styles.userSection}>
                <TouchableOpacity onPress={() => navigation.navigate('OnDuty')} activeOpacity={0.7}
                  style={[flxCol, aic, jcc, circle(32), isOnDuty ? green.bg : red.bg]}>
                  <Text style={[aic, jcc, { fontSize: 11, color: white.color }]}>
                    {
                      isOnDuty ? (
                        I18n.t('maintenance.on-duty.index.on-duty')
                      ) : (
                        I18n.t('maintenance.on-duty.index.off-duty')
                      )
                    }
                  </Text>
                  {/* <Image style={styles.thumbnail} source={userInfo.image ? { uri: userInfo.image } : this.renderPlaceHolder()} /> */}
                </TouchableOpacity>
                <View onPress={() => this.handleHotelChange()} style={styles.userInfo} >
                  {
                    authConfig.isDutyEnabled ? (
                      <TouchableOpacity
                        style={[flxRow, aic]}
                        onPress={() => this.handleHotelChange()}
                      // onPress={() => navigation.navigate('OnDuty')}
                      >
                        <View style={[flxCol, circle(5), userInfo.isOnDuty ? green.bg : red.bg, margin.r5]}>
                        </View>
                        <Text style={styles.userInfoText}>
                          {userInfo.fullName}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.userInfoText}>
                        {userInfo.fullName}
                      </Text>
                    )
                  }
                  <TouchableOpacity onPress={() => this.handleHotelChange()} >
                    <Text style={{ overflow: "hidden", width: 160, flexWrap: "nowrap", color: '#000' }}>
                      {selectedHotelName || hotelName}
                    </Text>
                  </TouchableOpacity>

                </View>
              </View>
              <Divider styleName="line" />
              <View style={styles.navigationContainer}>
                <ScrollView>
                  {
                    allowedLinks.map((link, index) => (
                      <DrawerButton
                        testID={link.testID}
                        key={index}
                        icon={link.icon}
                        text={I18n.t(link.translation)}
                        onPress={() => navigation.navigate(link.transition)}
                      />
                    ))
                  }
                  <DrawerButton
                    testID="logout"
                    icon="sign-out"
                    text={I18n.t('base.navigation.links.logout')}
                    onPress={logout}
                  />
                </ScrollView>
              </View>
            </View>
            {/* <Divider styleName="line" /> */}
            <View style={styles.footerContainer}>
              <Image style={styles.footerLogo} source={splashSmImage} />
              <Text style={{ color: '#808080' }}>{DeviceInfo.getVersion()}</Text>
            </View>
          </View>
        )
      } catch (e) {
        logout()
      }
    }

    return <View></View>
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#FFF'
  },
  userSection: {
    flexDirection: 'row',
    marginBottom: 20
  },
  thumbnail: {
    height: 64,
    width: 64,
    borderRadius: 32
  },
  userInfo: {
    paddingLeft: 10,
    paddingTop: 16
  },
  userInfoText: {
    color: '#000'
  },
  navigationContainer: {
    flex: 1,
  },
  footerContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  footerLogo: {
    // flexGrow: 1,
    height: isTab ? wp('15%') : wp('35%'),
    width: isTab ? wp('15%') : wp('35%'),
    marginLeft: 0,
    marginRight: 0,
    resizeMode: 'contain'
  }
});

DrawerContent.contextTypes = {
  // drawer: React.PropTypes.object
}

const mapStateToProps = createStructuredSelector({
  userInfo: userInfoSelector,
  hotelName: hotelNameSelector,
  authConfig: authConfigSelector,
  disabled: drawerDisabledSelector,
  selectedHotelName: computedHotelName,
  isOnDuty: userIsOnDutySelector,
});

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(AuthActions.logout()),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
