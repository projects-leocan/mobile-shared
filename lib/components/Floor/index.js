import React, { Component, PureComponent } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';
import checkEqual from 'rc-mobile-base/lib/utils/check-equal';

import {
  Container,
  PrimaryRow,
  FloorText,
  TasksText,
  SecondaryRow,
  RoomsText,
  ThirdRow,
  StatsText,
} from './styles';

export default class Floor extends Component {

  shouldComponentUpdate(nextProps) {
    return !checkEqual(nextProps, this.props, 'data')
  }

  render() {
    const { floor, rooms, stats, floorTasks, buildingName, floorName } = this.props.data;
    // const { handlePress, isAparthotelSettings } = this.props;
    const { handlePress } = this.props;
    const isSpecial = floor.id === 'priority' || floor.id === 'paused';
    const isAparthotelSettings = false;

    return (
      <Container onPress={() => handlePress(floor.id)}>
        
        <PrimaryRow>
          <FloorText isSpecial={isSpecial}>
            { isSpecial ? `${floorName} ${isAparthotelSettings ? I18n.t('base.ubiquitous.properties') : I18n.t('attendant.main.index.rooms')}`.toUpperCase() 
            : `${buildingName} - ${floorName}`.toUpperCase() }
          </FloorText>
          <TasksText>
            { floorTasks && floorTasks.length ?
              `${floorTasks.length} ${I18n.t('attendant.main.index.tasks')}`
              : null
            }
          </TasksText>
        </PrimaryRow>
        
        <SecondaryRow>
          <RoomsText>
            { `${rooms.length} ${isAparthotelSettings ? I18n.t('base.ubiquitous.properties') : I18n.t('attendant.main.index.rooms')}`.toUpperCase() }
          </RoomsText>
        </SecondaryRow>
        
        <ThirdRow>
          <StatsText>
            { `${stats.da} D/A · ${stats.dep} DEP · ${stats.stay} ${ I18n.t('base.ubiquitous.stay').toUpperCase() } · ${stats.arr} ARR · ${stats.vac} VAC` }
          </StatsText>
        </ThirdRow>

      </Container>
    )
  }
}