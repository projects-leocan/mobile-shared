import React, { Component, PureComponent } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';

class FloorRowItem extends PureComponent {

  render() {
    const { floor, rooms, stats, floorTasks, buildingName, floorName } = this.props.data;
    const { handlePress } = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={() => handlePress(floor.id)}>
        <View style={styles.primaryRow}>
          <Text style={styles.floorName}>
            { `${buildingName} • ${floorName}`.toUpperCase() }
          </Text>
          {/* <Text style={styles.tasks}>
            { floorTasks && floorTasks.length ?
              `${floorTasks.length} tasks`.toUpperCase()
              : null
            }
          </Text> */}
        </View>
        <View style={styles.secondaryRow}>
          <Text style={styles.rooms}>
            { `${rooms.length} ${I18n.t('attendant.main.index.rooms')}`.toUpperCase() }
          </Text>
        </View>
        <View style={styles.thirdRow}>
          <Text style={styles.stats}>
            { `${stats.da} D/A · ${stats.dep} DEP · ${stats.stay} ${ I18n.t('base.ubiquitous.stay').toUpperCase() } · ${stats.arr} ARR · ${stats.vac} VAC` }
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2,
    marginBottom: 4,
    marginLeft: 4,
    marginRight: 4
  },
  primaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  floorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a4a4a'
  },
  tasks: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a4a4a',
    opacity: .8
  },
  secondaryRow: {
    marginTop: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rooms: {
    fontSize: 13,
    fontWeight: '400',
    color: '#9B9B9B'
  },
  thirdRow: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stats: {
    fontSize: 12,
    fontWeight: '300',
    color: '#9B9B9B'
  }
});

export default FloorRowItem;
