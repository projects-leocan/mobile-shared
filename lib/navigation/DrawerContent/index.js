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
import { userInfoSelector, hotelNameSelector, authConfigSelector } from '../../selectors/auth';
import { drawerDisabledSelector } from './selectors';
import {
  green,
  flxCol,
  circle,
  margin,
  flxRow,
  aic,
  red,
  splashBgColor,
  blue500,
  isTab
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
    console.log('---- this.data ----');
    console.log(this.data)
    this.setState({ isShowHotelList: !isShowHotelList })
    // this.data._forceRunForHotelChange();
  }

  render() {
    const logout = this.props.logout;
    const { isShowHotelList } = this.state;

    if (isShowHotelList) {
      return <DrawerHotels {...this.props} handleHotelChange={() => this.handleHotelChange()} />
    } else {
      try {
        const { userInfo, hotelName, links, navigation, authConfig, disabled, screenProps } = this.props;
        const allowedLinks = links
          .filter(link => !disabled.includes(link.transition))

        return (
          <View style={[styles.container, { padding: -20 }]}>
            <View style={styles.container}>
              <View style={styles.userSection}>
                <Image style={styles.thumbnail} source={userInfo.image ? { uri: userInfo.image } : this.renderPlaceHolder()} />
                <View style={styles.userInfo}>
                  {
                    authConfig.isDutyEnabled ? (
                      <TouchableOpacity
                        style={[flxRow, aic]}
                        onPress={() => navigation.navigate('OnDuty')}
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
                      {hotelName}
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
  disabled: drawerDisabledSelector
});

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(AuthActions.logout()),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
