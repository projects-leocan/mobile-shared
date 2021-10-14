import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Button from 'rc-mobile-base/lib/components/Button';

import TaskCard from './TaskCard';

class RoomTasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShown: false
    }
  }

  _handleToggle() {
    this.setState({
      isShown: !this.state.isShown
    });
  }

  render() {
    const { roomTasks, style, handleUpdate } = this.props;
    const { isShown } = this.state;
    const buttonText = (isShown ? 'Hide Tasks' : `Show Tasks (${roomTasks.length})`).toUpperCase()
    let btnStyle = { height: 44, backgroundColor: '#C93C46', margin: 4, borderRadius: 4 };

    if (isShown) {
      btnStyle.marginBottom = 10;
    }

    const tasks = roomTasks.map(task => {
      return (
        <TaskCard
          key={task.uuid}
          style={{ marginBottom: 4 }}
          task={task}
          handleUpdate={handleUpdate}
          />
      )
    })

    return (
      <View style={[styles.container, style]}>
        <Button style={btnStyle} onPress={this._handleToggle.bind(this)}>
          <Text style={styles.btnText}>{ buttonText }</Text>
        </Button>
        { isShown ? tasks : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
  toggleButton: {
    height: 50
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  }
});

export default RoomTasks;
