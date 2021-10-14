import React, { Component } from 'react';

import { connect } from 'react-redux'
import { View, Dimensions } from 'react-native';
import { ListView } from 'rc-mobile-base/lib/components/Audits';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { blue } from 'rc-mobile-base/lib/styles';
import ActionButton from 'react-native-action-button';
import { get } from 'lodash';

import TableHeader from '../../components/TableHeader';
import AuditRow from '../../components/AuditRow';

import { allAudits, roomAudits } from './selectors';

import {
  Container
} from './styles';

import {
  padding,
  margin,
} from 'rc-mobile-base/lib/styles';

class AuditsScene extends Component {
  navigateAudit = (audit) => {
    const navigation = this.props.navigation
    if (audit.status === 'completed') {
      return
    }
    return navigation.navigate('AuditEdit', { audit })
  }

  componentWillMount() {
    const { width, height } = Dimensions.get('window')
    this.width = width
    this.height = height
  }

  render() {
    const { audits } = this.props
    const roomId = get(this, 'props.navigation.state.params.roomId', null);
    const narrow = this.width <= 500

    const shownAudits = narrow ? audits.filter(audit => audit.status !== "completed") : audits;

    return (
      <View testID="audits" style={{
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: narrow ? 15 : 40,
        backgroundColor: '#F2F2F2',
      }}>
        {
          audits && audits.length > 0 ? (
            <ListView
              data={shownAudits}
              renderRow={(audit) => (
                <AuditRow
                  {...audit}
                  card={narrow}
                  testID={audit.name}
                  onPress={() => this.navigateAudit(audit)}
                >
                  <AuditRow.Action card={narrow} status={audit.status} onPress={() => this.navigateAudit(audit)} />
                </AuditRow>
              )}
              getSectionId={(audit) => {
                return audit && audit.status || 'open'
              }}
              renderSectionHeader={(section) => {
                return (
                  <TableHeader
                    testID={`audit_section_${section}`}
                    value={`${section}-audits`}
                    style={{ ...padding.t20, ...padding.b0 }}
                    />
                )
              }}
            />
          ) : null
        }
        <ActionButton
          testID="auditAction"
          hideShadow
          buttonColor={blue.color}
          offsetY={10}
          offsetX={10}
          onPress={() => this.props.navigation.navigate('AuditAssign', { roomId })}
          />
      </View>
    )
  }
}

const mapStateToProps = (state, props) => {
  // const roomId = props.navigation.state.params.roomId
  const roomId = get(props, 'navigation.state.params.roomId', null);

  return {
    audits: !!roomId ? roomAudits(roomId)(state) : allAudits(state),
    config: state.auth.config
  }
}

export default connect(mapStateToProps)(AuditsScene);
