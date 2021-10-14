import React from 'react';
import { FlatList, InteractionManager } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ActionButton from 'react-native-action-button';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import moment from 'moment';
import { get, find, findIndex } from 'lodash';

import Item from './Item';

import {
  cheklistsExpanded
} from './selectors';

import ChecklistActions from '../../actions/checklists';

import {
  Container,
  Content,
  ChecklistsHeaderContainer,
  ChecklistsHeaderText,
  ChecklistItemContainer,
  ChecklistItemName,
  ChecklistItemItems,
  FinishButtonContainer,
  FinishButtonText,
  ScanExitContainer
} from './styles';

import {
  blue
} from 'rc-mobile-base/lib/styles';

class Checklist extends React.Component {
  
  state = {
    activeChecklist: null,
    isScan: false
  }

  componentWillMount() {
    const activeChecklist = get(this.props, 'navigation.state.params.activeChecklist', null);

    if (activeChecklist) {
      this.setState({ activeChecklist });
    }
  }

  _setActive = (item) => this.setState({ activeChecklist: item })
  _updateActive = (index) => {
    const { activeChecklist } = this.state;
    
    if (!activeChecklist) {
      return;
    }

    let updatedItems = [ ...activeChecklist.items ];
    updatedItems[index].finishTs = updatedItems[index].finishTs ? null : moment().unix();
    
    const updatedChecklist = { ...activeChecklist, items: updatedItems };
    this.setState({ activeChecklist: updatedChecklist });

    InteractionManager.runAfterInteractions(() => {
      this.props.update(updatedChecklist);
    })
  }

  _finishActive = () => {
    const { activeChecklist } = this.state;
    
    if (!activeChecklist) {
      return;
    }
    
    const updatedChecklist = { ...activeChecklist, is_completed: true };
    this.setState({ activeChecklist: null });
    
    InteractionManager.runAfterInteractions(() => {
      this.props.update(updatedChecklist);
    })
  }

  _toggleCamera = () => this.setState({ isScan: !this.state.isScan })
  _handleScan = (scan) => {
    this.setState({ isScan: false });
    
    const { activeChecklist } = this.state;
    const { data } = scan;
    try {
      const [ type, value ] = data.split(':');
      if (type !== "checklist") {
        return;
      }

      const item = find(activeChecklist.items, { uuid: value });
      if (!item) {
        return;
      }

      if (moment().hour() >= item.minHour) {
        const index = findIndex(activeChecklist.items, { uuid: value });
        this._updateActive(index);
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  
  render() {
    const { availableChecklists } = this.props;
    const { activeChecklist, isScan } = this.state;

    if (isScan) {
      return (
        <Container>
          <RNCamera
            style={{
              flex: 1
            }}
            type={RNCamera.Constants.Type.back}
            onBarCodeRead={(data) => console.log('read', data)}
            />
          <ScanExitContainer onPress={this._toggleCamera}>
            <Entypo name="cross" size={24} color={'white'} />
          </ScanExitContainer>
        </Container>
      )
    }
    
    if (!activeChecklist) {
      return (
        <Container>
          <FlatList
            data={availableChecklists}
            renderItem={({ item }) => (
              <ChecklistItemContainer onPress={() => this._setActive(item)}>
                <ChecklistItemName>{ item.name }</ChecklistItemName>
                <ChecklistItemItems>{ `${item.items.length} items` }</ChecklistItemItems>
              </ChecklistItemContainer>
            )}
            keyExtractor={(item, index) => item.checklist_id}
            ListHeaderComponent={(
              <ChecklistsHeaderContainer>
                <ChecklistsHeaderText>Available Checklists</ChecklistsHeaderText>
              </ChecklistsHeaderContainer>
            )}
            />
        </Container>
      )
    }
    
    return (
      <Container>
        <Content>
          <FlatList
            data={activeChecklist.items}
            renderItem={({ item, index }) => <Item { ...item } index={index} handler={this._updateActive} />}
            keyExtractor={(item, index) => String(index)}
            ListHeaderComponent={(
              <ChecklistsHeaderContainer>
                <ChecklistsHeaderText>{ `${activeChecklist.name} (${activeChecklist.items.filter(item => item.finishTs).length}/${activeChecklist.items.length})` }</ChecklistsHeaderText>
              </ChecklistsHeaderContainer>
            )}
            />
        </Content>

        <FinishButtonContainer onPress={this._finishActive}>
          <FinishButtonText>Finish Checklist</FinishButtonText>
        </FinishButtonContainer>

        <ActionButton
          hideShadow
          buttonColor={blue.color}
          offsetY={20}
          offsetX={20}
          onPress={this._toggleCamera}
          renderIcon={() => <Entypo name="camera" size={24} color="white" />}
          />
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    availableChecklists: cheklistsExpanded(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    update: (checklist) => dispatch(ChecklistActions.checklistUpdate(checklist)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checklist);