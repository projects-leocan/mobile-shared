import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { get } from 'lodash';
import moment from 'moment';
import I18n from 'react-native-i18n';

import {
  flxRow,
  flxCol,
  white,
  grey,
  margin,
  jcsb,
  flex1,
  aife
} from 'rc-mobile-base/lib/styles';
import { Status as statusUtil } from 'rc-mobile-base/lib/utils/tasks';

import Picture from '../Picture';

import Title from './Title';
import Guest from './Guest';
import Message from './Message';
import TimeAgo from './TimeAgo';
import Status from './Status';

import {
  Row,
  RowInner,
  ItemImageContainer,
  ItemImage,
  PlaceHolderItemImage,
  ItemBodyContainer,
  TaskNameLabel,
  FromNowText,
  StatusContainer,
  StatusLeftContainer,
  StatusRightContainer,
  ChatIcon,
  HorizontalContainer,
  StatusText,
  StatusPending
} from './styles';

import PlaceholderImage from 'rc-mobile-base/lib/images/placeholder_image.png';
import IconChat from 'rc-mobile-base/lib/images/icon_chat.png';

export const TaskRow = ({ task, onPress }) => {
  const ImageUrls = get(task, 'image_urls', []);
  const status = statusUtil.get(task);

  return (
    <Row onPress={() => onPress(task)}>
      <RowInner>
        <ItemImageContainer>
          {get(ImageUrls, 'length') > 0
            ?
            <ItemImage source={{ uri: first(ImageUrls) }} />
            :
            <PlaceHolderItemImage source={PlaceholderImage} />
          }
        </ItemImageContainer>

        <ItemBodyContainer>
          <TaskNameLabel>{task.task}</TaskNameLabel>
          <FromNowText>{moment.unix(task.date_ts).fromNow()}</FromNowText>

          <StatusContainer>
            <StatusLeftContainer>
              <Status
                task={task}
              />
              {/* <StatusPending style={styles[status]}></StatusPending> */}
              <StatusText>{I18n.t(`base.tasktable.status.${status}`)}</StatusText>
            </StatusLeftContainer>

            <StatusRightContainer>
              <StatusText>{task.messages.length || 0}</StatusText>

              <HorizontalContainer style={{ marginLeft: 12 }} >
                <ChatIcon source={IconChat} />
                <StatusText>{task.messages.length || 0}</StatusText>
              </HorizontalContainer>
            </StatusRightContainer>
          </StatusContainer>
        </ItemBodyContainer>
      </RowInner>
    </Row>
  )
}

export default TaskRow
