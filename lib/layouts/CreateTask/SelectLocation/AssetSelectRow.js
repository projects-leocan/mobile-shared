import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { splashBg } from 'rc-mobile-base/lib/styles';
import { get, filter, includes } from 'lodash';

const stepIndicatorBG = '#f4f8ff';
const buttonBorderColor = '#cfd4de';

const AssetSelectRow = ({ onPress, asset, customActions, selectedAction, handleSelectAction, index, isCreate, searchQuery, style }) => {
  const extraStyle = index % 2 ? { backgroundColor: '#F7F7F7' } : { backgroundColor: '#EDEDED' };

  let validateFilterAction = [];
  validateFilterAction = filter(customActions, function (obj) {
    return obj.assetGroupId === get(asset, 'assetGroupId', null)
  })

  if (isCreate) {
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: '#52C0F9' }, style]} onPress={() => onPress({ isCreate, searchQuery })}>
        <View style={styles.iconContainer}>
          <Icon name="picture-o" size={36} color="white" />
        </View>
        <View style={styles.assetInfoContainer}>
          <Text style={[styles.assetName, { color: 'white' }]}>{`Create asset: ${searchQuery}`}</Text>
        </View>
        <View style={styles.selectedContainer}></View>
      </TouchableOpacity>
    )
  }

  return (
    <View>
      <TouchableOpacity style={[styles.container, extraStyle, style]} onPress={() => onPress(asset)}>
        <View style={styles.checkBoxContainer}>
          <Ionicons
            name={get(asset, 'isSelected', false) ? 'ios-checkbox' : 'ios-square-outline'}
            size={30}
            color={splashBg.color}
          />
        </View>

        <View style={styles.assetInfoContainer}>
          <Text style={styles.assetName}>{asset.name}</Text>
        </View>
      </TouchableOpacity>

      {get(asset, 'isSelected', false)
        ?
        <View style={[styles.selectedContainer]}>
          {validateFilterAction.map(action => {
            return (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.actionBtn,
                  includes(selectedAction, get(action, 'id', null)) ? styles.selectedActionbtn : null,
                ]}
                onPress={() => handleSelectAction(action.id)}
              >
                <Text style={[styles.actionBtnLabel, {
                  color: includes(selectedAction, get(action, 'id', null)) ? 'white' : splashBg.color
                }]}>
                  {`${action.name}`}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
        // </View>
        : null
      }
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  assetImage: {
    height: 48,
    width: 48,
  },
  iconContainer: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  assetInfoContainer: {
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600'
  },
  assetPosition: {

  },
  selectedContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 15,
    width: '100%',
    flexWrap: 'wrap',
    paddingTop: 15,
    paddingBottom: 9
  },
  checkBoxContainer: {
    height: 60,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },

  actionBtn: {
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stepIndicatorBG,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
    height: 44,
    width: 'auto',
    borderWidth: 1,
    borderColor: buttonBorderColor
  },
  actionBtnLabel: {
    color: splashBg.color,
    fontSize: 15,
    fontWeight: "600"
  },
  selectedActionbtn: {
    backgroundColor: splashBg.color,
  },
});

export default AssetSelectRow;
