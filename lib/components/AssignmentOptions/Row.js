import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { get } from 'lodash/object';

import {
  flxRow,
  eitherGrey_100_200,
  grey400,
  padding,
  blueLt,
  flx1,
  margin,
  aic,
  jcc,
  lCenterCenter,
  slate
} from 'rc-mobile-base/lib/styles';

const Row = ({ user, index, handleSelect }) => (
  <TouchableOpacity style={[flxRow, aic, padding.x20, { height: 50 }, eitherGrey_100_200(index % 2 - 1).bg]} onPress={() => handleSelect(user.value)}>
    { user.thumbnail || user.image ?
      <Image
        style={{ height: 40, width: 40, borderRadius: 20, ...margin.r10 }}
        source={{ uri: user.thumbnail || user.image || '' }}
        resizeMethod='resize'
        />
      :
      <View style={{ height: 40, width: 40, borderRadius: 20, ...margin.r10, ...grey400.bg, ...lCenterCenter }}>
        <Text style={[slate.text, { fontSize: 20 }]}>{ get(user, 'name.0', '') }</Text>
      </View>
    }
    <Text style={[slate.text, { fontSize: 17 }]}>{ user.name }</Text>
    <View style={[flx1]}></View>
    { user.isSelected ?
      <Icon name="check-square-o" size={24} color={blueLt.color} />
      : null
    }
  </TouchableOpacity>
);

export default Row;