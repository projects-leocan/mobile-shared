import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Svg, Circle, Text as SVGText } from 'react-native-svg';

const SpecialSelectRow = ({ onPress, special, isSelected, index, style }) => {
  const extraStyle = index === 0 ? { borderTopWidth: 1 } : null;

  return (
    <TouchableOpacity style={[styles.container, extraStyle, style]} onPress={() => onPress(special.value)}>
      <View style={styles.specialImageContainer}>
        <Svg
          height="48"
          width="48"
          >
          <Circle
            cx="24"
            cy="24"
            r="24"
            fill="lightgray"
            />
          <SVGText
            x="24"
            y="8"
            fill="#4a4a4a"
            fontSize="24"
            textAnchor="middle"
            >{ special.symbol.toUpperCase() }</SVGText>
        </Svg>
      </View>
      <View style={styles.specialInfoContainer}>
        <Text style={styles.specialName}>{ `${special.name}` }</Text>
        {/* <Text style={styles.specialPosition}>Text</Text> */}
      </View>
      <View style={styles.selectedContainer}>
        { isSelected ?
          <Icon name="check-square-o" size={24} color="royalblue" />
          : null
        }
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingBottom: 5,
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#F7F7F7',
    borderColor: 'lightgray'
  },
  specialImageContainer: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginLeft: 10
  },
  specialInfoContainer: {
    paddingLeft: 10
  },
  specialName: {
    color: '#4a4a4a'
  },
  specialPosition: {

  },
  selectedContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10
  }
});

export default SpecialSelectRow;
