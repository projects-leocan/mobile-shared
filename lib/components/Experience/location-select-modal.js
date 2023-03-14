import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Dimensions,
  Modal,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import Button from 'rc-mobile-base/lib/components/Button';
import ListView from 'rc-mobile-base/lib/components/ListView';
import GridRow from 'rc-mobile-base/lib/components/GridRow';

import Margin from './margin';
import ModalHeader from './modal-header';

import { filter, find, includes } from 'lodash/collection';
import { get, extend } from 'lodash/object';
import moment from 'moment';

import {
  margin,
  padding,
  eitherGrey_100_200,
  eitherGreyRed,
  greyDk,
  greyLt,
  blueLt,
  slate,
  lCenterCenter,
  white
} from 'rc-mobile-base/lib/styles';

const normalizeDate = date => moment(date.slice(0, 10)).format('DD/MM');

const SelectableLocation = ({ onPress, data,  index, style }) => {
  const { room, entry } = data;
  const status = entry && entry.status;
  const { isSelected } = room;
  const today = moment().format('YYYY-MM-DD');

  return (
    <TouchableOpacity style={[styles.rowStyle, eitherGrey_100_200(index % 2 -1).bg]} onPress={() => onPress(data)}>
      <Text style={[styles.rowText, slate.text]}>{ room.name }</Text>
      <View style={{ alignItems: 'flex-end'}}>
        { entry && entry.name ?
          <Text style={[styles.rowSubText, slate.text]}>{ `${entry.name}` }</Text>
          : null
        }
        { status ?
          <Text style={[styles.rowStatusText, slate.text]}>{ `${ status.toUpperCase() }` }</Text>
          : null
        }
      </View>
    </TouchableOpacity>
  )
}

class LocationSelectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: ''
    }
  }

  render() {
    const {
      isVisible,
      toggleModal,
      rooms,
      selectedLocations,
      handleSelectLocation
    } = this.props;

    const { searchQuery } = this.state;
    const cleanQuery = searchQuery && searchQuery.toLowerCase() || null;
    let filteredRooms = cleanQuery ?
      filter(rooms, o => {
        const matchesGuests = get(o, 'roomCalendar', []).reduce((pv, entry) => {
          if (includes(get(entry, 'guest_name', '').toLowerCase(), cleanQuery)) {
            pv = true;
          }
          return pv;
        }, false);

        return matchesGuests || includes(get(o, 'name', '').toLowerCase(), cleanQuery);
      })
      : rooms;

    filteredRooms = filteredRooms.map(room => {
      const roomId = get(room, '_id');
      if (selectedLocations.has(roomId)) {
        return extend({}, room, { isSelected: true })
      }
      return room;
    });

    const totalsRooms = filteredRooms.reduce((pv, room) => {
      if (get(room, 'guests.length', 0)) {
        get(room, 'guests').forEach(entry => {
          pv.push({ room, entry });
        });
        return pv;
      }

      pv.push({ room });
      return pv;
    }, []);


    return (
      <Modal
        animationType={"slide"}
        onRequestClose={() => null}
        transparent={false}
        visible={isVisible}
      >
        <View style={styles.container}>
          <ModalHeader>Select Location</ModalHeader>

          <View>
            <TextInput
              style={styles.textField}
              onChangeText={(t) => { this.setState({ searchQuery: t }) }}
              value={searchQuery}
              multiline={false}
              placeholder={"Search rooms"} />
          </View>

          <View style={styles.listView}>
            <ListView
              data={totalsRooms}
              renderRow={(rowData, secId, index) => <SelectableLocation data={rowData} index={index} onPress={handleSelectLocation} />}
              renderFooter={() => <Margin top={10} />}
            />
          </View>

          <TouchableOpacity style={styles.btnStyles} onPress={toggleModal}>
            <Text style={styles.btnText}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  fieldLabel: {
    fontWeight: '600',
    color: '#4A4A4A',
    fontSize: 14,
    marginTop: 5,
    marginRight: 20,
    marginLeft: 20
  },
  textField: {
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 14,
    margin: 10,
    borderRadius: 20,
    ...greyLt.bg,
    textAlign: 'center'
  },
  listView: {
    flex: 1
  },
  btnStyles: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...blueLt.bg
  },
  btnText: {
    ...white.text,
    fontSize: 17,
    fontWeight: '500'
  },
  rowStyle: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    ...padding.x10
  },
  rowText: {
    fontSize: 17,
    ...slate.text,
  },
  rowSubText: {
    ...slate.text,
    fontSize: 14
  },
  rowStatusText: {
    ...slate.text,
    opacity: .8,
    fontSize: 12
  }
});

LocationSelectModal.defaultProps = {
  isVisible: false
};

export default LocationSelectModal;
