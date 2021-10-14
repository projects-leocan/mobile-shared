import React, { Component } from 'react';
import { LayoutAnimation, InteractionManager, FlatList } from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';
import get from 'lodash/get';

import Message from './Message';
import Button from './Button';
import RadioGroup from './RadioGroup';
import Dates from './Dates';

import { 
  Container,
  Title,
  Subtitle,
  OptionsRow,
  Spacer,
  NewMessageInput
} from './styles';

import {
  blue,
  red,
  orange,
  grey,
  greyDk,
  margin
} from 'rc-mobile-base/lib/styles';

const TYPE_OPTIONS = [
  { label: 'inspector.room-messages.index.day-night', value: 'dn' },
  { label: 'inspector.room-messages.index.day', value: 'day' },
  { label: 'inspector.room-messages.index.night', value: 'night' },
  { label: 'inspector.room-messages.index.pickup', value: 'pu' }
]
const SCHEDULE_OPTIONS = [
  { label: 'inspector.room-messages.index.end-of-day', value: 'eod' },
  { label: 'inspector.room-messages.index.end-of-stay', value: 'eos' },
  { label: 'inspector.room-messages.index.custom', value: 'custom' },
  { label: 'inspector.room-messages.index.indefinitely', value: 'indef' },
]

class RoomMessages extends Component {
  
  state = {
    checkedMessages: [],
    
    isAddMessage: false,
    isChangeRoom: false,
    activeMessage: null,
    activeMessageText: "",

    newMessageMessage: '',
    newMessageType: 'dn',
    newMessageSchedule: 'eod',

    dateRange: [],
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  }

  componentDidMount() {
    const range = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    const dateRange = range.map(i => moment().add(i, 'days').format('YYYY-MM-DD'));
    
    this.setState({ dateRange });
  }

  _toggleAdd = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ isAddMessage: !this.state.isAddMessage });
  }
  _toggleChange = () => this.setState({ isChangeRoom: !this.state.isChangeRoom })
  _toggleEdit = (message) => {
    const { activeMessage } = this.state;
    const isAlreadyActive = activeMessage && message && activeMessage.messageId === message.messageId;

    if (!message || isAlreadyActive) {
      return this.setState({ activeMessage: null, activeMessageText: "" });
    }
    
    this.setState({ activeMessage: message, activeMessageText: message.message });
  }

  _handleCheckMessage = (messageId) => this.state.checkedMessages.includes(messageId) ? 
    this.setState({ checkedMessages: this.state.checkedMessages.filter(i => i !== messageId) }) :
    this.setState({ checkedMessages: [...this.state.checkedMessages, messageId] })
  
  _handleChangeSchedule = (newMessageSchedule) => {
    const startDate = moment().format('YYYY-MM-DD');
    let endDate = moment().add(1, 'days').format('YYYY-MM-DD');
    
    if (newMessageSchedule === "eod") {
      endDate = moment().format('YYYY-MM-DD');
    } else if (newMessageSchedule === "eos") {
      endDate = moment().add(3, 'days').format('YYYY-MM-DD');
    }
    
    this.setState({ newMessageSchedule, startDate, endDate });
  }
  _handleChangeDate = (day, type) => this.setState({ [type]: day, newMessageSchedule: 'custom' })
  _handleAdd = () => {
    const { roomId } = this.props;
    const { newMessageMessage, newMessageSchedule, newMessageType, startDate, endDate } = this.state;
    const message = {
      message: newMessageMessage,
      messageType: newMessageType,
      schedule: newMessageSchedule,
      startDate,
      endDate
    }

    this.props.addMessage(roomId, message);
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        isAddMessage: false,
        newMessageMessage: '',
        newMessageType: 'dn',
        newMessageSchedule: 'eod',
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
      }, () => {
        if (this.props.onAdd) {
          this.props.onAdd();
        }
      });
    })
  }

  _handleRemove = () => {
    const { roomId } = this.props;
    const { checkedMessages } = this.state;
    
    this.props.removeMessage(roomId, checkedMessages);
    this.setState({ checkedMessages: [] });

    if (this.props.onRemove) {
      this.props.onRemove();
    }
  }

  _handleUpdateMessage = () => {
    const { roomId } = this.props;
    const { activeMessage, activeMessageText } = this.state;

    const updatedMessage = {
      ...activeMessage,
      message: activeMessageText
    }

    this._toggleEdit(null);
    
    InteractionManager.runAfterInteractions(() => {
      this.props.updateMessage(roomId, [activeMessage.messageId,], updatedMessage);
    });
  }
  
  _defaultRender() {
    const { roomId, messages, indexedUsers, removeMessage, updateMessage, style } = this.props;
    const { checkedMessages, activeMessage } = this.state;

    return (
      <Container style={style}>
        { (messages || []).map((message, index) =>
          <Message
            message={message}
            indexedUsers={indexedUsers}
            index={index}
            checkedMessages={this.state.checkedMessages}
            toggleMessage={this._handleCheckMessage}
            toggleEdit={this._toggleEdit}
            isEditedMessage={activeMessage && activeMessage.messageId === message.messageId}
            editText={this.state.activeMessageText}
            onChangeEdit={(v) => this.setState({ activeMessageText: v })}
            updateEdit={this._handleUpdateMessage}
            key={index}
            />
        )}
        <OptionsRow>
          <Spacer />
    
          <Button icon="plus" color={blue.color} onPress={this._toggleAdd}>{ I18n.t('inspector.room-messages.index.add-message') }</Button>
          <Button
            icon="trash"
            color={!checkedMessages || !checkedMessages.length ? greyDk.color : red.color}
            isDisabled={!checkedMessages || !checkedMessages.length}
            onPress={this._handleRemove}
          >{ I18n.t('inspector.room-messages.index.delete-messages') }</Button>
        </OptionsRow>
      </Container>
    )
  }

  _addRender() {
    const { style } = this.props;

    return (
      <Container style={style}>
        {/* <Title style={[margin.b15]} >{ `Add Room Message`.toUpperCase() }</Title> */}

        <Subtitle style={[margin.b10]} >{ I18n.t('inspector.room-messages.index.message').toUpperCase() }</Subtitle>
        <NewMessageInput
          value={this.state.newMessageMessage}
          onChangeText={(t) => this.setState({ newMessageMessage: t })}
          style={[margin.b15]}
          />
        
        <Subtitle style={[margin.b10, margin.t10]} >{ I18n.t('inspector.room-messages.index.message-type').toUpperCase() }</Subtitle>
        <RadioGroup
          isTranslations
          options={TYPE_OPTIONS}
          value={this.state.newMessageType}
          onChange={(v) => this.setState({ newMessageType: v })}
          />

        <Subtitle style={[margin.b10, margin.t25]} >{ I18n.t('inspector.room-messages.index.schedule').toUpperCase() }</Subtitle>
        <RadioGroup
          isTranslations
          options={SCHEDULE_OPTIONS}
          value={this.state.newMessageSchedule}
          onChange={this._handleChangeSchedule}
          />

        { this.state.newMessageSchedule !== "indef" &&
          <Subtitle style={[margin.b10, margin.t25]} >{ I18n.t('inspector.room-messages.index.calendar').toUpperCase() }</Subtitle>
        }

        { this.state.newMessageSchedule !== "indef" &&
          <Dates
            dateRange={this.state.dateRange}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            handleUpdate={this._handleChangeDate}
            /> 
        }
        
        <OptionsRow style={[margin.t30]}>
          <Spacer />
    
          <Button icon="ban" color={greyDk.color} onPress={this._toggleAdd}>{ I18n.t('inspector.room-messages.index.cancel').toUpperCase() }</Button>
          <Button icon="paper-plane" color={blue.color} onPress={this._handleAdd}>{ I18n.t('inspector.room-messages.index.submit-message') }</Button>
        </OptionsRow>
      </Container>
    )  
  }
  
  render() {
    const { isAddMessage } = this.state;

    if (isAddMessage) {
      return this._addRender();      
    }

    return this._defaultRender();
  }
}

export default RoomMessages;