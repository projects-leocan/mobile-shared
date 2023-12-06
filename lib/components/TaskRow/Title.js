import React, { Component } from 'react';
import {
  Text,
  View,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';
// import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  flxRow,
  red,
  orange,
  margin,
  text,
  slate,
  aic,
  flex1
} from 'rc-mobile-base/lib/styles';

export const Title = ({ value, message, isGuest = false, isPriority = false, typeKey = null }) => (
  <View style={[flxRow]}>
    <View style={[flxRow, aic, { flex: 1 }]}>
      {(isGuest || isPriority || typeKey === 'RECURRING')
        &&
        <View style={{ paddingRight: 5, paddingTop: 5, flexDirection: 'row', height: 'auto', alignItems: 'center', justifyContent: 'center' }}>
          {isGuest
            ?
            <Icon
              name="star"
              color={red.color}
              size={14}
              style={{ marginRight: 4 }}
            />
            : null
          }

          {isPriority
            ?
            <Icon
              name="star"
              color={orange.color}
              size={14}
              style={{ marginRight: 4 }}
            /> : null
          }

          {
            typeKey === 'RECURRING'
            ?
            <Image style={{marginRight: 4, height:17,width:17}} resizeMode='cover' source={require("../../images/Recurring.png")}/> : null
          }
        </View>
      }


      {value
        ?
        <View style={{ flexDirection: 'column' }}>
          {value.split(/\s*,\s*/).map((item, index) => {
            return (
              <Text key={index.toString()} style={[slate.text, text.fw400, margin.t5, flxRow]}>
                {item}
              </Text>
            )
          })}
        </View>
        : null
      }

    </View>

    {message
      ?
      <View style={[aic, { justifyContent: 'center', marginRight: 10 }]}>
        {/* <Fontisto
          name="email"
          color={red.color}
          size={25}
        /> */}
        <Octicons
          name="mail"
          color={red.color}
          size={25}
        />
      </View>
      : null
    }
  </View>

)

export default Title
