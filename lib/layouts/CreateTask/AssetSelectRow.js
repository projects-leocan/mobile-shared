import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AssetSelectRow = ({ onPress, asset, isSelected, index, isCreate, searchQuery, style }) => {
  const extraStyle = index % 2 ? { backgroundColor: '#F7F7F7' } : { backgroundColor: '#EDEDED' };

  if (isCreate) {
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: '#52C0F9' }, style]} onPress={() => onPress({ isCreate, searchQuery })}>
        <View style={styles.iconContainer}>
          <Icon name="picture-o" size={36} color="white" />
        </View>
        <View style={styles.assetInfoContainer}>
          <Text style={[styles.assetName, { color: 'white' }]}>{ `Create asset: ${searchQuery}` }</Text>
        </View>
        <View style={styles.selectedContainer}></View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={[styles.container, extraStyle, style]} onPress={() => onPress(asset)}>
      { asset.image ?
        <Image style={styles.assetImage} source={{ uri: asset.image }}/> :
        <View style={styles.iconContainer}>
          <Icon name="picture-o" size={36} color="lightgray" />
        </View>
      }

      <View style={styles.assetInfoContainer}>
        <Text style={styles.assetName}>{ asset.name }</Text>
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
    // paddingTop: 5,
    // paddingBottom: 5,
  },
  assetImage: {
    height: 48,
    width: 48,
    // marginLeft: 10
  },
  iconContainer: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  assetInfoContainer: {
    paddingLeft: 10
  },
  assetName: {

  },
  assetPosition: {

  },
  selectedContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10
  }
});

export default AssetSelectRow;
