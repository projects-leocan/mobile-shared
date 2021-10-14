import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class TaskCard extends Component {

  render() {
    const { uuid, task, is_completed, is_cancelled } = this.props.task;
    const { style, handleUpdate } = this.props;

    if (is_completed || is_cancelled) {
      return null;
    }

    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity style={styles.checkBtn} onPress={() => handleUpdate(uuid, 'completed')}>
          <Icon
            name="check-square-o"
            size={24}
            color="white"
            />
        </TouchableOpacity>

        <View style={styles.taskContainer}>
          <Text style={styles.taskText}>{ task }</Text>
        </View>
        <View style={styles.extrasContainer}>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center'
  },
  checkBtn: {
    backgroundColor: '#3CC86B',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    borderRadius: 4
  },
  taskContainer: {
    paddingLeft: 10,
    flex: 1
  },
  taskText: {
    color: '#4a4a4a',
    fontSize: 14
  },
  extrasContainer: {

  },
});

export default TaskCard;
