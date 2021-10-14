import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n'

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { get, has } from 'lodash/object';
import find from 'lodash/find';
import { unixPrettyTime } from '../utils/dates';
import {
  grey400,
  red
} from 'rc-mobile-base/lib/styles';

CUSTOM_CLEAN_MAP = {
  lc: "Light Clean",
  sc: "Standard Clean",
  dc: "Deep Clean"
}

const CustomStatus = ({ status }) => {
  if (!has(CUSTOM_CLEAN_MAP, status)) {
    return null;
  }

  return (
    <View style={styles.infoRow}>
      <View style={styles.iconContainer}>
        <Text style={styles.pms}>CLN</Text>
      </View>
      <Text style={styles.infoText}>{ get(CUSTOM_CLEAN_MAP, status) }</Text>
    </View>
  )
}

const ChangeSheets = () => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="bed" size={18} color='#C93C46' />
    </View>
    <Text style={styles.infoText}>{ I18n.t('attendant.clean.cleaninginfo.change-sheets') }</Text>
  </View>
)

const LongStay = () => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={[styles.pms, red.text]}>LS</Text>
    </View>
    <Text style={styles.infoText}>{ I18n.t('attendant.clean.cleaninginfo.long-stay') }</Text>
  </View>
)

const Vip = ({ vip }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="star" size={18} color='#F5A623' />
    </View>
    <Text style={styles.infoText}>{ vip || 'VIP' }</Text>
  </View>
)

const PmsNote = ({ note }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>{ I18n.t('attendant.clean.cleaninginfo.pms') }</Text>
    </View>
    <Text style={styles.infoText} numberOfLines={4}>{ note }</Text>
  </View>
)

const ETA = ({ eta }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>ETA</Text>
    </View>
    <Text style={styles.infoText}>{ eta && unixPrettyTime(eta) }</Text>
  </View>
)

const ETD = ({ etd }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>ETD</Text>
    </View>
    <Text style={styles.infoText}>{ etd && unixPrettyTime(etd) }</Text>
  </View>
)

const Features = ({ features }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="user-plus" size={18} color='#4a4a4a' />
    </View>
    <Text style={styles.infoText}>{ features }</Text>
  </View>
)

const Mice = ({ mice }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>{ `MICE` }</Text>
    </View>
    <Text style={styles.infoText} numberOfLines={4}>{ mice }</Text>
  </View>
)

const Type = ({ type, color = null }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={[styles.pms, color && { color }]}>{ `Guest` }</Text>
    </View>
    <Text style={styles.infoText} numberOfLines={4}>{ type }</Text>
  </View>
)

const RoomCategory = ({ roomCategory }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="suitcase" size={18} color='#4a4a4a' />
    </View>
    <Text style={styles.infoText}>{ roomCategory }</Text>
  </View>
)

const Description = ({ description }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="info" size={18} color='#4a4a4a' />
    </View>
    <Text style={styles.infoText} numberOfLines={4}>{ description }</Text>
  </View>
)

const Breakfast = ({ breakfast }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <MaterialIcons name="free-breakfast" size={18} color='#4a4a4a' />
    </View>
    <Text style={styles.infoText}>{ breakfast }</Text>
  </View>
)

const Message = ({ message }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="envelope" size={18} color='#4a4a4a' />
    </View>
    <Text style={styles.infoText}>{ message || '' }</Text>
  </View>
)

const Credits = ({ credits }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>{ I18n.t('attendant.clean.cleaninginfo.credits') }</Text>
    </View>
    <Text style={styles.infoText}>{ credits }</Text>
  </View>
)

const advancedMessageIcon = (type) => {
  if (type === "day") {
    return <Icon name="sun-o" size={18} color='#4a4a4a' />
  } else if (type === "night") {
    return <Icon name="moon-o" size={18} color='#4a4a4a' />
  } else if (type === "pu") {
    return <Text style={[styles.pms, { color: '#4a4a4a' }]}>PU</Text>
  } else {
    return <Icon name="envelope" size={18} color='#4a4a4a' />
  }
}

const AdvancedMessages = ({ messages }) => {
  return (
    <View>
      { messages.map(message =>
        <View style={styles.infoRow} key={message.messageId}>
          <View style={styles.iconContainer}>
            { advancedMessageIcon(message.messageType) }
          </View>
          <Text style={styles.infoText}>{ message.message || '' }</Text>
        </View>
      )}
    </View>
  )
}

const CleaningInfo = ({ room, activeId = null, config = {}, isTurndown = false, isRunner = false, style }) => {
  if (!room) {
    return null;
  }

  const isChangeSheets = get(room, 'isChangeSheets', false);
  const isLongStay = get(room, 'isLongStay', false);
  let vip = get(room, ['roomCalendar', 0, 'vip'], null);
  let pmsNote = get(room, ['roomCalendar', 0, 'pms_note'], null);
  let mice = get(room, ['guests', 0, 'guest', 'mice', 'label'], null);
  let guestType = get(room, ['guests', 0, 'guest', 'guest_type'], null);
  let guestColor = get(room, ['guests', 0, 'guest', 'guest_color'], null);
  let breakfast = get(room, ['guests', 0, 'guest', 'breakfast'], null);
  let features = get(room, ['guests', 0, 'guest', 'room_features'], null);
  let eta = get(room, ['guests', 0, 'eta'], null);
  let etd = get(room, ['guests', 0, 'etd'], null);
  if (activeId) {
    const foundActivePms = find(get(room, 'roomCalendar', []), { pms_id: activeId });
    const foundActiveGuest = find(get(room, 'guests', []), { pmsId: activeId });
    pmsNote = foundActivePms ? get(foundActivePms, 'pms_note') : pmsNote;
    vip = foundActivePms ? get(foundActivePms, 'vip') : vip;
    mice = foundActiveGuest ?  get(foundActiveGuest, ['guest', 'mice', 'label']) : mice;
    guestType = foundActiveGuest ?  get(foundActiveGuest, ['guest', 'guest_type']) : guestType;
    guestColor = foundActiveGuest ?  get(foundActiveGuest, ['guest', 'guest_color']) : guestColor;
    breakfast = foundActiveGuest ? get(foundActiveGuest, ['guest', 'breakfast']) : breakfast;
    features = foundActiveGuest ? get(foundActiveGuest, ['guest', 'room_features']) : features;
    eta = foundActiveGuest ? ['arrived', 'arrival'].includes(get(foundActiveGuest, 'status')) && get(foundActiveGuest, ['eta']) : eta;
    etd = foundActiveGuest ? ['departed', 'departure'].includes(get(foundActiveGuest, 'status')) && get(foundActiveGuest, ['etd']) : etd;
  }
  const message = get(room, 'comment');
  const messages = get(room, 'messages', [])
    .filter(message => {
      if (isTurndown && message.messageType === "day") {
        return false;
      } else if (!isTurndown && message.messageType === "night") {
        return false;
      }
      return true;
    });
  const credits = !config.isHideAttendantCredits && get(room, 'roomCredits');
  const roomCategory = get(room, 'roomCategory.label', '');
  const description = get(room, 'description');
  const customStatus = get(room, 'roomPlanning.guest_status');

  if (!isChangeSheets && !vip && !pmsNote && !message && !roomCategory && !credits) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={{ marginTop: 15 }}>
        <Text style={styles.infoHeader}>{ I18n.t('attendant.clean.cleaninginfo.cleaning-info').toUpperCase() }</Text>
        <View style={styles.infoContainer}>

          { customStatus ?
            <CustomStatus status={customStatus} />
            : null
          }

          { isChangeSheets ?
            <ChangeSheets />
            : null
          }

          { isLongStay ?
            <LongStay />
            : null
          }

          { vip ?
            <Vip vip={vip} />
            : null
          }

          { mice ?
            <Mice mice={mice} />
            : null
          }

          { guestType ?
            <Type type={guestType} color={guestColor} />
            : null
          }

          { pmsNote ?
            <PmsNote note={pmsNote} />
            : null
          }

          { eta ?
            <ETA eta={eta} />
            : null
          }

          { etd ?
            <ETD etd={etd} />
            : null
          }

          { features ?
            <Features features={features} />
            : null
          }

          { message && !config.isEnableAdvancedMessages ?
            <Message message={message} />
            : null
          }

          { messages && config.isEnableAdvancedMessages ?
            <AdvancedMessages messages={messages} isTurndown={isTurndown} />
            : null
          }

          {
            roomCategory ?
            <RoomCategory roomCategory={roomCategory} />
            : null
          }
          
          {
            credits ?
            <Credits credits={credits} />
            : null
          }

          {
            description ?
            <Description description={description} />
            : null
          }

          {
            isRunner && breakfast ?
            <Breakfast breakfast={breakfast} />
            : null
          }

        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  infoHeader: {
    marginLeft: 15,
    marginBottom: 2,
    color: '#373737',
    fontWeight: '500',
    opacity: .8
  },
  infoContainer: {
    backgroundColor: 'white',
    marginLeft: 4,
    marginRight: 4,
  },
  infoRow: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 54
  },
  infoText: {
    color: '#4a4a4a',
    fontWeight: '300',
    fontSize: 14,
    flex: 1,
    flexDirection: 'column'
  },
  pms: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a4a4a'
  },
});

export default CleaningInfo;
