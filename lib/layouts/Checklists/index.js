import React from 'react';
import { SectionList } from 'react-native';
import ActionButton from 'react-native-action-button';
import { connect } from 'react-redux';

import {
  sectionedUserChecklistsSelector
} from './selectors'

import {
  Container,
  ChecklistsSectionContainer,
  ChecklistsSectionText,
  ChecklistItemContainer,
  ChecklistItemName
} from './styles';

import {
  blue
} from 'rc-mobile-base/lib/styles';

class Checklists extends React.Component {
  
  render() {
    const { activeChecklists } = this.props;
    
    return (
      <Container>
        
        <SectionList
          sections={activeChecklists}
          keyExtractor={(item, index) => item.uuid}
          renderItem={({item, index, section}) => (
            <ChecklistItemContainer onPress={() => this.props.navigation.navigate('Checklist', { activeChecklist: item })}>
              <ChecklistItemName>{ item.name }</ChecklistItemName>
            </ChecklistItemContainer>
          )}
          renderSectionHeader={({section: { title }}) => (
            <ChecklistsSectionContainer>
              <ChecklistsSectionText>{ title }</ChecklistsSectionText>
            </ChecklistsSectionContainer>
          )}
          />
        
        <ActionButton
          hideShadow
          buttonColor={blue.color}
          offsetY={20}
          offsetX={20}
          onPress={() => this.props.navigation.navigate('Checklist')}
          />
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    activeChecklists: sectionedUserChecklistsSelector(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checklists);