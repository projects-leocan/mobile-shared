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
} from '../../styles';

import DrawerButton from './DrawerButton';
import bellhopImage from './bellhop.png';
import splashSmImage from './splash-sm.png';

class DrawerContent extends Component {
  render() {
    const logout = this.props.logout;

    try {
      const { userInfo, hotelName, links, navigation, authConfig, disabled } = this.props
      const allowedLinks = links
        .filter(link => !disabled.includes(link.transition))

      return (
        <View style={styles.container}>
          <View style={styles.userSection}>
            <Image style={styles.thumbnail} source={ userInfo.image ? { uri: userInfo.image } : bellhopImage } />
            <View style={styles.userInfo}>
              {
                authConfig.isDutyEnabled ? (
                  <TouchableOpacity
                    style={[flxRow, aic]}
                    onPress={() => navigation.navigate('OnDuty')}
                  >
                    <View style={[flxCol, circle(5), userInfo.isOnDuty ? green.bg : red.bg, margin.r5]}>
                    </View>
                    <Text>
                      {userInfo.fullName}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text>
                    {userInfo.fullName}
                  </Text>
                )
              }
              <Text style={{ overflow: "hidden", width: 160, flexWrap: "nowrap" }}>
                {hotelName}
              </Text>
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
          <Divider styleName="line" />
          <View style={styles.footerContainer}>
            <Image style={styles.footerLogo} source={splashSmImage}/>
            <Text>{ DeviceInfo.getVersion() }</Text>
          </View>
        </View>
      )
    } catch (e) {
      logout()
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
  navigationContainer: {
    flex: 1,
  },
  footerContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footerLogo: {
    // flexGrow: 1,
    height: 144,
    width: 240,
    marginLeft: 0,
    marginRight: 0
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
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
