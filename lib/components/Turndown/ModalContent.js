import React, { Component, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';
import I18n from 'react-native-i18n'
import moment from 'moment';
import ModalHeader from 'rc-mobile-base/lib/components/ModalHeader';
import IcoMoonIcon from 'rc-mobile-base/lib/components/IcoMoonIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconCross from 'react-native-vector-icons/Entypo';


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
  flxRow,
  blue500,
  jcsa,
  aic
} from 'rc-mobile-base/lib/styles';
import { get } from "lodash/object";
import {
  SectionHeader,
  OptionsContainer,
  Option,
} from './styles';

const ModalContent = ({ activeRoom, dismiss, submit, config, onNavigate, specificRoomUpdate, isAllowDoneTurnDown,auth, isAttendantApp }) => {
  const { name } = activeRoom || {};
  const turndownService = get(activeRoom, 'roomHousekeeping.turndownService') || '';

  // const [allowDone, isAllowDone] = useState(false);
  const useAdvancedHKModeForTurndown = get(config, "useAdvancedHKModeForTurndown", false);

  const isDone = ['finish', 'dnd', 'refuse', 'cleaning'].includes(turndownService);
  // let timer 

  //get attendantMinimumMinutes from config
  // const  attendantMinimumMinutes = config ? config.attendantMinimumMinutes : 2;

  // change status for finish and cancel cleaning
  // const runAttendantClock = () => {
  //   const currentTime = moment().unix() - (specificRoomUpdate && specificRoomUpdate.startTime);
  //   const isAllowed = (attendantMinimumMinutes * 60) - currentTime;
  //   timer = setTimeout(() => {
  //     isAllowDone(true);
  //   }, (isAllowed * 1000))
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }

  //Condition to start timeout or set isAllowDone true
  // if (turndownService === "cleaning" && attendantMinimumMinutes &&  specificRoomUpdate && !timer) {
  //  runAttendantClock()
  // } else if (turndownService === "cleaning" && !attendantMinimumMinutes) {
  //   isAllowDone(true);
  // }

  return (
    <View style={[styles.container]}>
      <View style={[flxRow, blue500.bg, jcsa, aic, { height: Platform.OS === "android" ? 55 : 95}]}>
        {dismiss ? <View style={{ width: 50 }}></View> : null}
        <Text style={[white.text, flx1, { fontSize: 17, textAlign: 'center',marginTop: Platform.OS === "android" ? 10 : 40}]}>
          {name}
        </Text>
        {
          dismiss ?
            <TouchableOpacity onPress={dismiss} style={[lCenterCenter, margin.r10, { width: 50, height: 55, marginTop: Platform.OS === "android" ? 10 : 40 }]}>
              <IconCross
                name="cross"
                size={24}
                color={white.color}
              />
            </TouchableOpacity>
            : null
        }
      </View>
      {/* <ModalHeader
        value={name}
        onPress={dismiss}
      /> */}
      <ScrollView>
        <ReservationComponent
          room={activeRoom}
          style={{ marginRight: 0, marginLeft: 0, marginTop: 10, marginBottom: 10 }}
          auth={auth}
          isAttendantApp={isAttendantApp}
        />

        <CleaningInfo
          room={activeRoom}
          config={config}
          isTurndown
        />
        {useAdvancedHKModeForTurndown === false ? isDone ?
          <View>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => submit(turndownService && turndownService === "cleaning" ? 'cancel-finish' : turndownService === "finish" ? 'cancel-finish' : turndownService === "dnd" ? 'cancel-dnd' : turndownService === "refuse" ? 'cancel-refuse' : null)}>
              <Icon name="ban" color="white" size={48} style={[margin.b10]} />
              <Text style={styles.btnText}>{`Cancel ${turndownService}`.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
          :
          <View>
            <View>
              <TouchableOpacity style={styles.mainBtn} onPress={() => submit('finish')}>
                <IcoMoonIcon name="check" color="white" size={48} style={[margin.b10]} />
                <Text style={styles.btnText}>{I18n.t('runner.turndown.modalcontent.finish-turndown').toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.subBtns}>
              <TouchableOpacity style={[styles.subBtn, orange.bg, margin.r5]} onPress={() => submit('delay')}>
                <IcoMoonIcon name="delay" color="white" size={26} style={[margin.b5]} />
                <Text style={styles.btnText}>{I18n.t('runner.turndown.modalcontent.delay').toUpperCase()}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subBtn, slate.bg]} onPress={() => submit('dnd')}>
                <IcoMoonIcon name="dnd" color="white" size={30} style={[margin.b5]} />
                <Text style={styles.btnText}>{I18n.t('runner.turndown.modalcontent.dnd').toUpperCase()}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subBtn, red.bg, margin.l5]} onPress={() => submit('refuse')}>
                <IcoMoonIcon name="refuse" color="white" size={26} style={[margin.b5]} />
                <Text style={styles.btnText}>{I18n.t('runner.turndown.modalcontent.refuse').toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View> : <></>
        }

        {useAdvancedHKModeForTurndown === true ? isDone ? turndownService === "cleaning" ?
          <View>
            <TouchableOpacity style={styles.mainBtn} onPress={() => submit('finish')}>
              <IcoMoonIcon name="check" color="white" size={48} style={[margin.b10]} />
              <Text style={styles.btnText}>{I18n.t('runner.turndown.modalcontent.finish-turndown').toUpperCase()}</Text>
            </TouchableOpacity>
          </View> :
          <View>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => submit(turndownService && turndownService === "cleaning" ? 'cancel-finish' : turndownService === "finish" ? 'cancel-finish' : turndownService === "dnd" ? 'cancel-dnd' : turndownService === "refuse" ? 'cancel-refuse' : null)}>
              <Icon name="ban" color="white" size={48} style={[margin.b10]} />
              <Text style={styles.btnText}>{`Cancel ${turndownService}`.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
          :
          <View>
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: "#65E5D8" }]} onPress={() => submit('cleaning')}>
              <IcoMoonIcon name="bed" color="white" size={48} style={[margin.b10]} />
              <Text style={styles.btnText}>{I18n.t('attendant.clean.menu.start-cleaning').toUpperCase()}</Text>
            </TouchableOpacity>
            <View style={styles.subBtns}>
              <TouchableOpacity style={[styles.subBtn, orange.bg, margin.r5]} onPress={() => submit('delay')}>
                <IcoMoonIcon name="delay" color="white" size={26} style={[margin.b5]} />
                <Text style={styles.btnText}>{I18n.t('runner.turndown.modalcontent.delay').toUpperCase()}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subBtn, slate.bg]} onPress={() => submit('dnd')}>
                <IcoMoonIcon name="dnd" color="white" size={30} style={[margin.b5]} />
                <Text style={styles.btnText}>{I18n.t('runner.turndown.modalcontent.dnd').toUpperCase()}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.subBtn, red.bg, margin.l5]} onPress={() => submit('refuse')}>
                <IcoMoonIcon name="refuse" color="white" size={26} style={[margin.b5]} />
                <Text style={styles.btnText}>{I18n.t('runner.turndown.modalcontent.refuse').toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View> : <></>
        }

        <SectionHeader marginBottom={10} marginTop={10}>{I18n.t('runner.turndown.modalcontent.more-options').toUpperCase()}</SectionHeader>
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
    height:"100%",
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
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: "center"
  }
});

export default ModalContent;
