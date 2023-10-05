import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import { get } from 'lodash';

import {
  flxRow,
  flxCol,
  white,
  grey,
  margin,
  jcsb,
  flex1,
  greyDk,
  aife
} from 'rc-mobile-base/lib/styles';

import Picture from '../Picture';

import Title from './Title';
import Guest from './Guest';
import Message from './Message';
import TimeAgo from './TimeAgo';
import Status from './Status';
import DateDifferance from 'rc-mobile-base/lib/components/DateDifferance';
import ETA from 'rc-mobile-base/lib/components/TaskRow/Eta';
import moment from 'moment';

export const TaskRow = ({ task, onPress }) => (

  <TouchableOpacity
    style={[flex1, flxRow, white.bg, grey.bc]}
    onPress={() => onPress(task)}
  >
    <View style={styles.container}>
      <View style={{ width: "25%", flexDirection: "row" }}>
        <Status
          style={[flxCol]}
          task={task}
        />
        <Picture
          size={68}
          style={[flxCol]}
          value={get(task, 'image_urls', [])}
        />
      </View>
      <View style={{ width: "45%", alignItems: "flex-start", justifyContent: "space-around" }}>
        <View style={styles.titleView}>
          <Title value={task.task} message={get(task, 'comment', '')} isGuest={get(task, 'is_guest_request', false)} isPriority={get(task, 'is_priority', false)} />
        </View>
        <Message value={task.lastMessage} />
        <Guest
          room={get(task, 'room', {})}
          roomName={task.room.name}
          isGuestIn={task.room.isGuestIn}
          roomHousekeeping={task.room.roomHousekeeping}
          guestStatus={task.room.guestStatus}
        />
      </View>
      <View style={{ width: "30%", alignItems: "flex-end", justifyContent: "space-around"}}>
        <DateDifferance
          created_at={task.created_at_string}
          start_at={task.starts_at_string}
        />
        <ETA task={task} />
        {/* <TimeAgo value={task.created_at_string} /> */}
        {
          task.created_at_string ? 
          <Text style={[greyDk.text, { fontSize: 12,paddingRight:10,width:"100%",textAlign:"right" }]}>
          {moment(task.created_at_string).fromNow()}
        </Text> : <></>
        }
      

      </View>


    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row"
  },
  titleView: {
    width: "100%",
  },
})
export default TaskRow
