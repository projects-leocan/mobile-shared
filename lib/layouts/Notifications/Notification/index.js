import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { isEmpty } from 'lodash/lang';
import { get } from 'lodash/object';

import {
  flxRow,
  flxCol,
  white,
  red,
  grey,
  grey400,
  margin,
  padding,
  jcsb,
  flex1,
  aife,
  text,
  slate
} from 'rc-mobile-base/lib/styles';

import Picture from '../../../components/Picture';

import Info from './Info';
import TimeAgo from './TimeAgo';
import Status from './Status';
import ExtraOptions from './ExtraOptions';

class Notification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false
    }
  }

  _handleToggle = () => this.setState({ isExpanded: !this.state.isExpanded })

  render() {
    const { task, sent, reply, convert } = this.props;

    return (
      <View>
        <View style={[styles.container, flex1, flxRow, white.bg, grey.bc, { minHeight: 60 }]}>
          <Status received={task.is_completed === 1} show={sent} />
          <Picture
            size={58}
            value={task.meta.image}
          />
          <TouchableOpacity style={[flex1, margin.l10, flxCol]} onPress={this._handleToggle}>
            <Text style={[text.fw700, margin.t5, flxRow, slate.text, {fontSize: 15}]}>
              {task.task}
            </Text>
            <View style={[jcsb, aife, flxRow, margin.t15]}>
              <Info personName={sent ? task.assigned.label : `${get(task, 'creator.first_name')} ${get(task, 'creator.last_name')}`} roomName={task.meta.location} />
              <TimeAgo value={task.date_ts} />
            </View>
          </TouchableOpacity>
        </View>

        { this.state.isExpanded ?
          <ExtraOptions
            task={task}
            sent={sent}
            reply={reply}
            convert={convert}
            toggle={this._handleToggle}
            />
          : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: grey400.color,
    borderTopColor: grey400.color,
  }
});

export default Notification
