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
import { get } from 'lodash/object';

const UserSelectRow = ({ onPress, group, isSelected, index, style }) => {
  const extraStyle = index === 0 ? { borderTopWidth: 1 } : null;
  const firstChar = get(group, ['name', 0], '');

  return (
    <TouchableOpacity style={[styles.container, extraStyle, style]} onPress={() => onPress(group._id)}>
      <View style={styles.groupImageContainer}>
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
            >{ firstChar.toUpperCase() }</SVGText>
        </Svg>
      </View>
      <View style={styles.groupInfoContainer}>
        <Text style={styles.groupName}>{ `${group.name}` }</Text>
        {/* <Text style={styles.groupPosition}>Text</Text> */}
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
  groupImageContainer: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginLeft: 10
  },
  groupInfoContainer: {
    paddingLeft: 10
  },
  groupName: {
    color: '#4a4a4a'
  },
  groupPosition: {

  },
  selectedContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10
  }
});

export default UserSelectRow;
