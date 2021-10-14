import React, { Component } from 'react';
// import JSONTree from 'react-native-json-tree'

import { ScrollView, Dimensions, View } from 'react-native';
import { getFormValues } from 'redux-form';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux'
import { ListView } from 'rc-mobile-base/lib/components/Audits';
import { get, find } from 'lodash';

import SelectLocationModal from './SelectLocationModal';
import AssignmentSelect from '../../components/SelectAssignment';
import SectionHeader from '../../components/SectionHeader';

import { AuditSources, Audits } from 'rc-mobile-base/lib/models';

import AuditRow from '../../components/AuditRow';

import { locationsSelector, assignmentSelector} from '../CreateTask/selectors';
import { selectedLocation } from './selectors';

import {
  Container,
  Content,
  Label,
  Bottom,
  Start,
  Assign,
  BtnText,
  SetLocationContainer,
  SetLocationText,
} from './styles';

class AuditAssignScene extends Component {
  state = {
    selectedAudit: null,
    selectedAssignments: null,
    setLocation: null
  }

  componentDidMount() {
    const roomId = get(this, 'props.navigation.state.params.roomId', null);
    if (!roomId) return;

    const { locations } = this.props;
    const room = find(locations, { _id: roomId })
    if (!room) return;
    
    this.setState({ setLocation: room });
  }

  handleSelect = (audit) => {
    this.setState({ selectedAudit: audit })
  }

  handleUpdateAssignment = (selectedAssignments) => this.setState({ selectedAssignments })
  handleRemoveAssignment = (id) => {
    this.setState({ selectedAssignments: this.state.selectedAssignments.filter(a => a !== id) })
  }

  navigateAudit = () => {
    const { selectedLocation, navigation } = this.props;
    const { setLocation } = this.state;
    const selectedAudit = this.state.selectedAudit
    const disabled = !selectedAudit
    
    if (disabled) {
      return
    }

    const consumption_id = setLocation
      ? setLocation._id
      : selectedLocation && selectedLocation._id;
    const consumption_type = consumption_id ? 'Room' : null;

    navigation.navigate('Audit', {
      audit: selectedAudit,
      consumption_id,
      consumption_type
    })
  }

  auditAssign = () => {
    const { selectedLocation, assignAudit, navigation, assignmentOptions } = this.props
    const { setLocation } = this.state;
    const selectedAudit = this.state.selectedAudit
    const selectedAssignments = this.state.selectedAssignments
    const disabled = !selectedAudit

    const assigned = assignmentOptions.filter(o => selectedAssignments.includes(o.value))

    if (disabled) {
      return
    }

    assignAudit({
      audit_source_id: selectedAudit.id,
      consumption_id: selectedLocation && selectedLocation._id,
      consumption_type: "Room",
      name: selectedAudit.name,
      assigned: assigned,
    })
    navigation.goBack()
  }

  componentWillMount() {
    const { width, height } = Dimensions.get('window')
    this.width = width
    this.height = height
  }

  render() {
    const { audits, locations, selectedLocation, assignAudit, assignmentOptions } = this.props
    const { setLocation } = this.state
    const selectedAudit = this.state.selectedAudit
    const narrow = this.width <= 500

    const mappedAudits = audits.map(audit => ({
      ...audit,
      isSelected: selectedAudit && selectedAudit.id === audit.id
    }))

    const disabled = !selectedAudit

    return (
      <Container testID="assignAudit" narrow={narrow}>
        {/* <JSONTree
          data={this.props}
          /> */}
        <Content>
          <SectionHeader value={ I18n.t('inspector.audits.select-audit') } style={{ marginTop: 40 }} />
          { mappedAudits.map(audit => 
            <AuditRow
              key={audit.id}
              {...audit}
              source
              onPress={() => this.handleSelect(audit)}
            >
              {
                audit.isSelected ? (
                  <AuditRow.Checkmark />
                ) : null
              }
            </AuditRow>
          )}
          
          { setLocation ?
            <View>
              <SectionHeader value={ I18n.t('base.ubiquitous.location') } />
              <SetLocationContainer>
                <SetLocationText>{ setLocation.name }</SetLocationText>
              </SetLocationContainer>
            </View>
            :
            <SelectLocationModal
              locations={locations} />
          }

          <AssignmentSelect
            assignmentOptions={assignmentOptions}
            selectedAssignments={this.state.selectedAssignments || []}
            updateAssignments={this.handleUpdateAssignment}
            removeAssignment={this.handleRemoveAssignment}
            headerLabel={ I18n.t('inspector.audits.assign-to-others') }
            isShowHeader
            isOptional
          />

          <View style={{ marginTop: 25, marginBottom: 20 }}>
            { this.state.selectedAssignments && this.state.selectedAssignments.length ?
              <Assign
                narrow={narrow}
                testID="assignAuditAction"
                disabled={disabled}
                onPress={this.auditAssign}
              >
                <BtnText>
                  ASSIGN AUDIT
                </BtnText>
              </Assign>
              :
              <Start
                narrow={narrow}
                disabled={disabled}
                onPress={this.navigateAudit}
              >
                <BtnText>
                  START AUDIT
                </BtnText>
              </Start>
            }
          </View>
        </Content>

        {/* <Bottom>
          { this.state.selectedAssignments && this.state.selectedAssignments.length ?
            <Assign
              narrow={narrow}
              testID="assignAuditAction"
              disabled={disabled}
              onPress={this.auditAssign}
            >
              <BtnText>
                ASSIGN AUDIT
              </BtnText>
            </Assign>
            :
            <Start
              narrow={narrow}
              disabled={disabled}
              onPress={this.navigateAudit}
            >
              <BtnText>
                START AUDIT
              </BtnText>
            </Start>
          }
        </Bottom> */}
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  audits: AuditSources.all()(state),
  locations: locationsSelector(state),
  selectedLocation: selectedLocation(state),
  assignmentOptions: assignmentSelector('all')(state),
})

const mapDispatchToProps = (dispatch) => ({
  assignAudit: (data) => dispatch(Audits.insert.tap(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuditAssignScene);
