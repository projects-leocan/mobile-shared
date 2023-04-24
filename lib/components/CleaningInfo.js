import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import I18n from 'react-native-i18n'

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { get, has } from 'lodash/object';
import { find } from 'lodash';
import { unixPrettyTime } from '../utils/dates';
import {
  grey400,
  red
} from 'rc-mobile-base/lib/styles';
import moment from 'moment';

const skyDK = '#00bfff';

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
      <Text style={styles.infoText}>{get(CUSTOM_CLEAN_MAP, status)}</Text>
    </View>
  )
}

const ChangeSheets = () => (
  <View style={[styles.vipContainer, { backgroundColor: 'transparent', height: 'auto' }]}>
    <Icon name="bed" size={18} color='#C93C46' />
  </View>
)

const LongStay = () => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={[styles.pms, red.text]}>LS</Text>
    </View>
    <Text style={styles.infoText}>{I18n.t('attendant.clean.cleaninginfo.long-stay')}</Text>
  </View>
)

const Vip = ({ vip }) => (
  <View style={styles.vipContainer}>
    <Text style={styles.vipText}>VIP</Text>
  </View>
)

const PmsNote = ({ note }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>{I18n.t('attendant.clean.cleaninginfo.pms')}</Text>
    </View>
    <Text style={styles.infoText} numberOfLines={6}>{note}</Text>
  </View>
)

const CleaningInstruction = ({ note }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>{I18n.t('attendant.clean.cleaninginfo.cleaning-instruction')}</Text>
    </View>
    <Text style={styles.infoText} numberOfLines={6}>{note}</Text>
  </View>
)


const ETView = ({ guestStatus, eta, etd }) => {
  const GuestStatus = String(guestStatus).toUpperCase();
  if (GuestStatus === 'ARR' || GuestStatus === 'DEP') {
    return (
      <View style={[styles.infoRow, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
        <ETA guestStatus={guestStatus} eta={eta} />
        <ETD guestStatus={guestStatus} etd={etd} />
      </View>
    )
  } else {
    return <></>
  }
}

const ETA = ({ guestStatus, eta }) => {
  const GuestStatus = String(guestStatus).toUpperCase();
  if (eta) {
    if (GuestStatus === 'ARR') {
      return (
        <>
          <View style={styles.iconContainer}>
            <Text style={styles.pms}>ETA</Text>
          </View>
          <Text style={[styles.etInfoText, { marginRight: 35 }]}>{eta && moment.utc(moment(new Date(eta * 1000).toGMTString())).format("hh:mm A")}</Text>
        </>
      )
    } else {
      return <></>
    }
  } else {
    return <></>
  }
}

const ETD = ({ guestStatus, etd }) => {
  const GuestStatus = String(guestStatus).toUpperCase();
  if (etd) {
    if (GuestStatus === 'DEP') {
      return (
        <>
          <View style={styles.iconContainer}>
            <Text style={styles.pms}>ETD</Text>
          </View>
          <Text style={styles.infoText}>{etd && moment.utc(moment(new Date(etd * 1000).toGMTString())).format("hh:mm A")}</Text>
        </>
      )
    } else {
      return <></>
    }
  } else {
    return <></>
  }
}

const Features = ({ features }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="user-plus" size={18} color='#4a4a4a' />
    </View>
    <Text style={styles.infoText}>{features}</Text>
  </View>
)

const Mice = ({ mice }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>{`MICE`}</Text>
    </View>
    <Text style={styles.infoText} numberOfLines={4}>{mice}</Text>
  </View>
)

const Type = ({ type, color = null }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={[styles.pms, color && { color }]}>{`Guest`}</Text>
    </View>
    <Text style={styles.infoText} numberOfLines={4}>{type}</Text>
  </View>
)

const RoomCategory = ({ roomCategory }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="suitcase" size={18} color='#4a4a4a' />
    </View>
    <Text style={styles.infoText}>{roomCategory}</Text>
  </View>
)

const Description = ({ description }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="info" size={18} color='#4a4a4a' />
    </View>
    <Text style={styles.infoText} numberOfLines={4}>{description}</Text>
  </View>
)

const Breakfast = ({ breakfast }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <MaterialIcons name="free-breakfast" size={18} color='#4a4a4a' />
    </View>
    <Text style={styles.infoText}>{breakfast}</Text>
  </View>
)

const Message = ({ message }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="envelope" size={18} color='#4a4a4a' />
    </View>
    <Text style={styles.infoText}>{message || ''}</Text>
  </View>
)

const Occupants = ({ occupants }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Icon name="user" size={15} color="#5E5E5E" />
    </View>
    <Text style={styles.infoText}>{occupants}</Text>
  </View>
)

const Credits = ({ credits }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>{I18n.t('attendant.clean.cleaninginfo.credits')}</Text>
    </View>
    <Text style={styles.infoText}>{credits}</Text>
  </View>
)

const VipContainer = ({ roomName, vip }) => (
  <View style={styles.infoRow}>
    {/* <Text style={styles.pms}>{roomName}</Text> */}
    {vip
      ?
      <>
        <Vip vip={vip} />
        <Text style={[styles.pms, { paddingHorizontal: 5 }]}>{vip}</Text>
      </>
      : null
    }
  </View>
)

const CLEANINGNAME = ({ cleaningName, credits, isChangeSheets, hotel_group_key, isAttendantApp }) => (
  <View style={styles.infoRow}>
    <Text style={styles.pms}>{cleaningName} {isAttendantApp && hotel_group_key && (hotel_group_key === "ARPC" || hotel_group_key.toLowerCase() === "arpc") ? null : `${credits ? `(${credits})` : ''}`}</Text>
    {isChangeSheets
      ?
      <ChangeSheets />
      : null
    }
  </View>
)

const SECTIONNAME = ({ sectionName, sectionValue }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>{sectionName}</Text>
    </View>
    <Text style={[styles.etInfoText, { marginRight: 35 }]}>{sectionValue}</Text>
  </View>
)

const RoomMessages = ({ forReservation, messages }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.pms}>{!forReservation ? `Message` : `Guest Message`}</Text>
    </View>

    <View style={{ flexDirection: 'column' }}>
      {messages.map((item, index) => {
        return <Text key={index.toString()} style={styles.etInfoText} numberOfLines={6}>{item}</Text>
      })}
    </View>
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
      {messages.map(message =>
        <View style={styles.infoRow} key={message.messageId}>
          <View style={styles.iconContainer}>
            {advancedMessageIcon(message.messageType)}
          </View>
          <Text style={styles.infoText}>{message.message || ''}</Text>
        </View>
      )}
    </View>
  )
}

const CleaningInfo = ({ room, activeId = null, config = {}, isTurndown = false, isRunner = false, style, inline = false, isAttendantApp, hotel_group_key }) => {
  if (!room) {
    return null;
  }

  const roomName = get(room, 'name', '');
  const sectionName = get(room, 'section', '');
  const subSectionName = get(room, 'subSection', '');
  const guestStatus = get(room, 'guestStatus', '');
  const cleaningName = get(room, 'roomPlanning.name', '');
  const roomMessage = get(room, 'roomMessage', null);
  const isChangeSheets = get(room, 'isChangeSheets', false);
  const isLongStay = get(room, 'isLongStay', false);
  let vip = get(room, ['roomCalendar', 0, 'vip'], null);
  let pmsNote = get(room, ['roomCalendar', 0, 'pms_note'], null);
  let guestMessage = get(room, ['guests', 0, 'reservationMessage'], null);
  let mice = get(room, ['guests', 0, 'guest', 'mice', 'label'], null);
  let guestType = get(room, ['guests', 0, 'guest', 'guest_type'], null);
  let guestColor = get(room, ['guests', 0, 'guest', 'guest_color'], null);
  let breakfast = get(room, ['guests', 0, 'guest', 'breakfast'], null);
  let features = get(room, ['guests', 0, 'guest', 'room_features'], null);
  let eta = get(room, ['guests', 0, 'eta'], null);
  let etd = get(room, ['guests', 0, 'etd'], null);

  let selectedGuest = get(room, ['roomCalendar', 0], null);
  let guestOccupants = get(selectedGuest, ['occupants'], null);
  let adults = get(selectedGuest, 'adults', 0);
  let children = get(selectedGuest, 'children', 0);
  let infants = get(selectedGuest, 'infants', 0);

  let cleaningInstructions = get(room, 'roomPlanning.cleaningInstruction', null);

  if (activeId) {
    const foundActivePms = find(get(room, 'roomCalendar', []), { id: activeId });
    const foundActiveGuest = find(get(room, 'guests', []), { guest_id: activeId });
    pmsNote = foundActivePms ? get(foundActivePms, 'pms_note') : pmsNote;
    guestMessage = foundActiveGuest ? get(foundActiveGuest, 'reservationMessage', []) : guestMessage;
    vip = foundActivePms ? get(foundActivePms, 'vip') : vip;
    mice = foundActiveGuest ? get(foundActiveGuest, ['guest', 'mice', 'label']) : mice;
    guestType = foundActiveGuest ? get(foundActiveGuest, ['guest', 'guest_type']) : guestType;
    guestColor = foundActiveGuest ? get(foundActiveGuest, ['guest', 'guest_color']) : guestColor;
    breakfast = foundActiveGuest ? get(foundActiveGuest, ['guest', 'breakfast']) : breakfast;
    features = foundActiveGuest ? get(foundActiveGuest, ['guest', 'room_features']) : features;
    eta = foundActiveGuest ? ['arrived', 'arrival'].includes(get(foundActiveGuest, 'status')) && get(foundActiveGuest, ['eta']) : eta;
    etd = foundActiveGuest ? ['departed', 'departure'].includes(get(foundActiveGuest, 'status')) && get(foundActiveGuest, ['etd']) : etd;

    guestOccupants = get(foundActiveGuest, ['occupants'], null);
    adults = get(foundActiveGuest, 'adults', 0);
    children = get(foundActiveGuest, 'children', 0);
    infants = get(foundActiveGuest, 'infants', 0);
  }

  if (children || infants) {
    guestOccupants = `${adults}+${children}+${infants}`;
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
        <Text style={[styles.infoHeader, inline && { marginLeft: 15, marginBottom: 5 }]}>{I18n.t('attendant.clean.cleaninginfo.cleaning-info').toUpperCase()}</Text>
        <View style={[styles.infoContainer, inline && { marginLeft: 0, marginRight: 0, paddingHorizontal: 5, backgroundColor: 'white' }]}>

          {/* {roomName.length > 0
            ?
            <ROOMNAME roomName={roomName} vip={vip} />
            : null
          } */}

          {guestOccupants
            ?
            <Occupants occupants={guestOccupants} />
            : null
          }

          {cleaningName.length > 0
            ?
            <CLEANINGNAME cleaningName={cleaningName} credits={credits} isChangeSheets={isChangeSheets} hotel_group_key={hotel_group_key} isAttendantApp={isAttendantApp} />
            : null
          }

          {!isAttendantApp &&
            sectionName
            ? <SECTIONNAME sectionName={'Section'} sectionValue={sectionName} />
            : null
          }

          {!isAttendantApp &&
            subSectionName
            ? <SECTIONNAME sectionName={'Subsection'} sectionValue={subSectionName} />
            : null
          }


          {customStatus ?
            <CustomStatus status={customStatus} />
            : null
          }

          {/* {isChangeSheets ?
            <ChangeSheets />
            : null
          } */}

          {isLongStay ?
            <LongStay />
            : null
          }

          {roomMessage ?
            <RoomMessages forReservation={false} messages={roomMessage} />
            : null}

          {guestMessage ?
            <RoomMessages forReservation={true} messages={guestMessage} />
            : null}

          {vip ?
            <VipContainer vip={vip} />
            : null
          }

          {mice ?
            <Mice mice={mice} />
            : null
          }

          {guestType ?
            <Type type={guestType} color={guestColor} />
            : null
          }

          {pmsNote ?
            <PmsNote note={pmsNote} />
            : null
          }

          {cleaningInstructions ?
            <CleaningInstruction note={cleaningInstructions} /> : null
          }

          {(eta || etd) ?
            <ETView guestStatus={guestStatus} eta={eta} etd={etd}></ETView>
            : null
          }

          {/* {eta ?
            <ETA eta={eta} />
            : null
          }

          {etd ?
            <ETD etd={etd} />
            : null
          } */}

          {features ?
            <Features features={features} />
            : null
          }

          {message && !config.isEnableAdvancedMessages ?
            <Message message={message} />
            : null
          }

          {messages && config.isEnableAdvancedMessages ?
            <AdvancedMessages messages={messages} isTurndown={isTurndown} />
            : null
          }

          {
            roomCategory ?
              <RoomCategory roomCategory={roomCategory} />
              : null
          }

          {/* {
            credits ?
              <Credits credits={credits} />
              : null
          } */}

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
    // width: 54
    width: 75
  },
  infoText: {
    color: '#4a4a4a',
    fontWeight: '300',
    fontSize: 14,
    flex: 1,
    flexDirection: 'column'
  },
  etInfoText: {
    color: '#4a4a4a',
    fontWeight: '300',
    fontSize: 14,
    flexDirection: 'column'
  },
  pms: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a4a4a'
  },
  vipContainer: {
    height: 20,
    width: 'auto',
    backgroundColor: skyDK,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  vipText: {
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#fff'
  }
});

export default CleaningInfo;