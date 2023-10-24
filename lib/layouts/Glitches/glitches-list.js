import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import GlitchesListItem from './glitches-list-item';

const GlitchesList = ({title, glitches, onGlitchPress, style}) => {
  return (
    <View style={mergeStyles(styles.container, style.container)}>
      {/* <Text style={mergeStyles(styles.title, style.title)}>{title.toUpperCase()}</Text>
      {
        glitches.map((glitch, idx) => {
          return ( <GlitchesListItem glitch={glitch} key={glitch.id} onPress={onGlitchPress}/> );
        })
      } */}
      <FlatList
        data={glitches}
        renderItem={({ item, index }) => <GlitchesListItem glitch={item} key={item.id} onPress={onGlitchPress}/>}
        ListHeaderComponent={<Text style={mergeStyles(styles.title, style.title)}>{title.toUpperCase()}</Text>}  
      />

    </View>
  );
}

GlitchesList.defaultProps = {
  style: {},
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    marginLeft: 12,
    marginBottom: 5,
    fontWeight: '500',
    color: 'black',
  }
});

function mergeStyles(defaultStyles, overrides) {
  let merged = overrides ?
    [ defaultStyles, overrides ] :
    [ defaultStyles ];

  return merged;
}

export default GlitchesList;
