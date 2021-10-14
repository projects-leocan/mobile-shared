import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { has, get } from 'lodash/object';

import {
  slate,
  white,
  blueLt,
  red,
  grey400
} from 'rc-mobile-base/lib/styles';


export default OutboundItem = ({ data, retry, remove }) => (
  <View style={styles.container}>
    <View style={styles.content}>
      
      <Text>{ data.meta.outboundLabel && data.meta.outboundLabel.toString() }</Text>
      
      <View style={[styles.metaRow]}>
        <Entypo name="location" color={slate.color} size={16} style={styles.metaIcon} />
        <Text style={styles.metaText}>{ data.room && data.room.name }</Text>
        <Entypo name="clock" color={slate.color} size={16} style={styles.metaIcon} />
        <Text style={styles.metaText}>{ data.lt }</Text>
      </View>
      
      { data.errorMessage ?
        <View style={[styles.infoRow]}>
          <Entypo name="info-with-circle" size={16} color={red.color} style={styles.infoIcon} />
          <Text style={styles.infoText}>{ data.errorMessage && data.errorMessage.toString() }</Text>
        </View>
        : null
      }
      
    </View>

    <View style={styles.side}>
      
      { data.isPending ?
        null :
        <TouchableOpacity style={[styles.buttonContainer, blueLt.bg, { marginBottom: 4 }]} onPress={() => retry(data)}>
          <Entypo name="paper-plane" size={16} color={white.color} />
          <Text style={styles.buttonText}>RESEND</Text>
        </TouchableOpacity>
      }
      
      { data.isPending ?
        null :
        <TouchableOpacity style={[styles.buttonContainer, red.bg]} onPress={() => remove(data)}>
          <Entypo name="trash" size={16} color={white.color} />
          <Text style={styles.buttonText}>CANCEL</Text>
        </TouchableOpacity>
      }

    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomColor: grey400.color,
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  content: {
    flex: 1
  },
  mainText: {
    ...slate.text
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row'
  },
  metaIcon: {
    marginRight: 6
  },
  metaText: {
    marginRight: 14,
    ...slate.text
  },
  infoRow: {
    marginTop: 10,
    flexDirection: 'row'
  },
  infoIcon: {
    marginRight: 6
  },
  infoText: {
    ...slate.text
  },
  side: {
    width: 44
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    height: 44,
    width: 44
  },
  buttonText: {
    fontSize: 9,
    marginTop: 2,
    ...white.text
  },
});