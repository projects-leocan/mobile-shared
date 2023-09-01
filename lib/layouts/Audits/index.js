import React, { Component } from 'react';

import { connect } from 'react-redux'
import { View, Dimensions, SectionList, StyleSheet, Text } from 'react-native';
import { ListView } from 'rc-mobile-base/lib/components/Audits';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { blue, splashBg } from 'rc-mobile-base/lib/styles';
import ActionButton from 'react-native-action-button';
import { get } from 'lodash';
import I18n from 'react-native-i18n';

import TableHeader from '../../components/TableHeader';
import AuditRow from '../../components/AuditRow';

import { allAudits, roomAudits } from './selectors';
import { greyDk } from "../../styles/colors"

import {
  Container
} from './styles';

import {
  padding,
  margin,
} from 'rc-mobile-base/lib/styles';
import * as auditData from './audit.json'

import {
  createAuditInsertRoute
} from "rc-mobile-base/lib/actions/outbound";

class AuditsScene extends Component {
  navigateAudit = (audit) => {
    if(this.props.navigation?.state) {
    const { createAuditInsertRoute } = this.props;
    const roomId = get(this.props, 'navigation.state.params.roomId', null);
    const floorId = get(this.props, 'navigation.state.params.floorId', null);
    const buildingId = get(this.props, 'navigation.state.params.buildingId', null);

    const validateAudit = {
      ...audit, roomId: roomId,
      floorId: floorId,
      buildingId: buildingId,
    }
    if (this.props.navigation.state.routeName === "AuditsSideBar") {
      const navigation = this.props.navigation
      return navigation.navigate('AuditAssign', {
        audit: audit
      })
    }
    else {
      // createAuditInsertRoute(validateAudit)
      const navigation = this.props.navigation
      if (audit.status === 'completed') {
        return
      }
      return navigation.navigate('AuditEdit', { audit: validateAudit })
    }
  }
  else {
    this.navigateInInspectorTabView(audit)
  }
  }

  navigateInInspectorTabView = (audit) => {

    const { createAuditInsertRoute } = this.props;

    const roomId = get(this.props, 'roomId', null);
    const floorId = get(this.props, 'floorId', null);
    const buildingId = get(this.props, 'buildingId', null);

    const validateAudit = {
      ...audit, roomId: roomId,
      floorId: floorId,
      buildingId: buildingId,
    }

    createAuditInsertRoute(validateAudit)
    const navigation = this.props.navigation
    if (audit.status === 'completed') {
      return
    }
    return navigation.navigate('AuditEdit', { audit: validateAudit })
  }
  

  componentWillMount() {
    const { width, height } = Dimensions.get('window')
    this.width = width
    this.height = height
  }

  render() {
    const validateAuditObj = [auditData]
    const { audits } = this.props
    const roomId = get(this, 'props.navigation.state.params.roomId', null);
    const narrow = this.width <= 500

    const shownAudits = narrow ? audits.filter(audit => audit.status !== "completed") : audits;

    const auditValidate = audits.map((item) => {
      return {
        title: get(item, 'status', 'open'),
        data: [item]
      }
    })
    return (
      <>
        <View style={styles.subheader}>
          <Text style = {styles.roomsCountText}>{I18n.t('runner.glitch-form.index.available-inspection')}</Text>
        </View>
        <View testID="audits" style={{
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: narrow ? 15 : 40,
          // backgroundColor: '#F2F2F2',
          // backgroundColor:'red'
        }}>
          {
            auditValidate && auditValidate.length > 0 ? (
              <SectionList
                sections={auditValidate}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <AuditRow
                    {...item}
                    card={narrow}
                    testID={item.name}
                    onPress={() => this.navigateAudit(item)}
                  >
                    <AuditRow.Action card={narrow} status={item.status} onPress={() => this.navigateAudit(item)} />
                  </AuditRow>
                )}
              // renderSectionHeader={({ section: { title } }) => (
              //   <TableHeader
              //     testID={`audit_section_${title}`}
              //     value={`${title}-audits`}
              //     style={{ ...padding.t20, ...padding.b0 }}
              //   />
              // )}
              />
            ) : null
          }
          {/* <ActionButton
          testID="auditAction"
          hideShadow
          buttonColor={splashBg.color}
          offsetY={10}
          offsetX={10}
          onPress={() => this.props.navigation.navigate('AuditAssign', { roomId })}
        /> */}
        </View>
      </>
    )
  }
}


const styles = StyleSheet.create({
  subheader: {
    height: 50,
    paddingRight: 15,
    paddingLeft: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",

  },
  roomsCountText: {
    ...greyDk.text,
    fontWeight: "500",
    fontSize: 13,
  },
})
const mapStateToProps = (state, props) => {
  // const roomId = props.navigation.state.params.roomId
  // const roomId = get(props, 'navigation.state.params.roomId', null);
  const roomId = null;
  return {
    audits: !!roomId ? roomAudits(roomId)(state) : allAudits(state),
    config: state.auth.config
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    createAuditInsertRoute: (audit) => {
      dispatch(createAuditInsertRoute({ audit }));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditsScene);
