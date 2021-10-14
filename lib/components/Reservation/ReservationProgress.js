import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import {
    Svg,
    Circle,
    Rect
} from 'react-native-svg';

class ReservationProgress extends Component {

  _renderDetailed() {
    const { step, total } = this.props;
    const width = 140;
    const completedWidth = width * (step / total);
    const isDeparture = (step === total);

    let midSteps = [];
    for (let i=0; i < total+1; i++) {
      let interval = ((width - 10) / total) * (i) + 5;
      midSteps.push(<Circle key={i} cx={interval} cy="8" r="5" fill="#D8D8D8" />)
    }

    let completedSteps = [];
    for (let i=0; i < step+1; i++) {
      let interval = ((width - 10) / total) * (i) + 5;
      completedSteps.push(<Circle key={i} cx={interval} cy="8" r="5" fill={isDeparture ? "#3CC86B" : "#1A8CFF"} />)
    }

    return (
      <View style={styles.container}>
        <Svg width={width} height='20'>
          <Rect
            x="5"
            y="5"
            width={width-10}
            height="6"
            fill="#D8D8D8"
            />
          <Rect
            x="5"
            y="6"
            width={completedWidth-10}
            height="4"
            fill={isDeparture ? "#3CC86B" : "#1A8CFF"}
            />
          { midSteps }
          { completedSteps }
        </Svg>
      </View>
    )
  }

  render() {
    return this._renderDetailed();
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 3
  },
});

export default ReservationProgress;
