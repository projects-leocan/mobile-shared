import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n'
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import secsToTime from 'rc-mobile-base/lib/utils/secs-to-time';

class RoomTimer extends Component {
  constructor(props) {
    super(props);

    if (props.lastPauseTs && props.initialTs) {
      const diff = props.lastPauseTs - props.initialTs - (props.pauseTime || 0);
      this.state = secsToTime(diff);
    } else {
      this.state = {
        n: false,
        h: '00',
        m: '00',
        s: '00'
      };
    }
  }

  componentWillMount() {
    this.timer = setInterval(() => {
      const { initialTs, isPaused, pauseTime } = this.props;
      if (isPaused) {
        return;
      }

      const diff = moment().unix() - initialTs - pauseTime;
      this.setState(secsToTime(diff));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { isPaused, disableTimer, handlePause, handleResume, allowDone, handleCancel, handleDone } = this.props;
    const { n, h, m, s } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.timerContainer}>
          { disableTimer ?
            null :
            <Text style={styles.timerText}>{ `${n >= 0 ? '' : '-'}${h}:${m}:${s}` }</Text>
          }
        </View>
        <View style={styles.pauseContainer}>
          { isPaused ?
            <Icon.Button name="play-circle" size={44} color='#4a4a4a' backgroundColor='transparent' onPress={handleResume} /> :
            <Icon.Button name="pause-circle" size={44} color='#4a4a4a' backgroundColor='transparent' onPress={handlePause} />
          }
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={[styles.optionBtn, allowDone ? { backgroundColor: '#3CC86B' } : { backgroundColor: '#C93C46'} ]} onPress={allowDone ? handleDone : handleCancel}>
            { allowDone ?
              <Text style={styles.optionText}>{ I18n.t('attendant.components.room-timer.done') }</Text>
              : <Text style={styles.optionText}>{ I18n.t('attendant.components.room-timer.cancel') }</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingLeft: 15,
    marginBottom: 15
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  timerText: {
    fontWeight: 'bold',
    color: '#4a4a4a',
    fontSize: 18
  },
  pauseContainer: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15
  },
  optionBtn: {
    // width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    // height: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  optionText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default RoomTimer;
