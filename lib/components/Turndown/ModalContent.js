import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n'

import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';
import Icon from 'react-native-vector-icons/FontAwesome';

import ReservationComponent from 'rc-mobile-base/lib/components/Reservation';
// import CleaningInfo from './CleaningInfo';
import CleaningInfo from 'rc-mobile-base/lib/components/CleaningInfo';

import {
  flx1,
  lCenterCenter,
  margin,
  green,
  white,
  slate,
  red,
  orange,
  flxRow
} from 'rc-mobile-base/lib/styles';

import {
  SectionHeader,
  OptionsContainer,
  Option,
} from './styles';

const ModalContent = ({ activeRoom, dismiss, submit, config, onNavigate }) => {
  const { name, turndownService } = activeRoom || {};
  const isDone = ['finish', 'dnd', 'refuse'].includes(turndownService);

  return (
    <View style={[styles.container, flx1]}>
      <ModalHeader
        value={name}
        onPress={dismiss}
        />

      <ScrollView>
        <ReservationComponent
          room={activeRoom}
          style={{ marginRight: 0, marginLeft: 0, marginTop: 10, marginBottom: 10 }}
          />

        <CleaningInfo
          room={activeRoom}
          config={config}
          isTurndown
          />

        { isDone ?
          <View>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => submit('')}>
              <Icon name="ban" color="white" size={48} style={[margin.b10]} />
              <Text style={styles.btnText}>{ 'Cancel Turndown'.toUpperCase() }</Text>
            </TouchableOpacity>
          </View>
          :
          <View>
            <TouchableOpacity style={styles.mainBtn} onPress={() => submit('finish')}>
              <IcoMoonIcon name="check" color="white" size={48} style={[margin.b10]} />
              <Text style={styles.btnText}>{ I18n.t('runner.turndown.modalcontent.finish-turndown').toUpperCase() }</Text>
            </TouchableOpacity>
            <View style={styles.subBtns}>
              <TouchableOpacity style={[styles.subBtn, orange.bg, margin.r5]} onPress={() => submit('delay')}>
                <IcoMoonIcon name="delay" color="white" size={26} style={[margin.b5]} />
                <Text style={styles.btnText}>{ I18n.t('runner.turndown.modalcontent.delay').toUpperCase() }</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subBtn, slate.bg]} onPress={() => submit('dnd')}>
                <IcoMoonIcon name="dnd" color="white" size={30} style={[margin.b5]} />
                <Text style={styles.btnText}>{ I18n.t('runner.turndown.modalcontent.dnd').toUpperCase() }</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subBtn, red.bg, margin.l5]} onPress={() => submit('refuse')}>
                <IcoMoonIcon name="refuse" color="white" size={26} style={[margin.b5]} />
                <Text style={styles.btnText}>{ I18n.t('runner.turndown.modalcontent.refuse').toUpperCase() }</Text>
              </TouchableOpacity>
            </View>
          </View>
        }

        <SectionHeader marginBottom={10} marginTop={10}>{ `More options`.toUpperCase() }</SectionHeader>
        <OptionsContainer>
          <Option
            icon="list-ol"
            iconColor="#FFA07A"
            label={I18n.t('attendant.components.room-options.inventory').toUpperCase()}
            handler={() => onNavigate('Inventory')}
            />
          <Option
            icon="exclamation-circle"
            iconColor="#DE5454"
            label={I18n.t('attendant.components.room-options.maintenance').toUpperCase()}
            handler={() => onNavigate('CreateTask', { layout: 'maintenance', type: 'maintenance' })}
            />
        </OptionsContainer>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  mainBtn: {
    height: 150,
    ...green.bg,
    ...margin.x10,
    ...margin.t15,
    borderRadius: 2,
    ...lCenterCenter
  },
  cancelBtn: {
    height: 260,
    ...red.bg,
    ...margin.x10,
    ...margin.t15,
    borderRadius: 2,
    ...lCenterCenter
  },
  subBtns: {
    height: 100,
    ...flxRow,
    ...margin.t5,
    ...margin.x10,
    ...margin.b15
  },
  subBtn: {
    height: 100,
    ...flx1,
    borderRadius: 2,
    ...lCenterCenter
  },
  btnText: {
    ...white.text,
    fontSize: 15,
    fontWeight: 'bold'
  }
});

export default ModalContent;
