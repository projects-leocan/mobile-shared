import React, { Component, PureComponent } from 'react';
import {
  View,
  Text,
  InteractionManager,
  TouchableOpacity
} from 'react-native';
import Swipeable from 'react-native-swipeable';
import I18n from 'react-native-i18n';

import ModalToggler from '../ModalToggler';
import SwipeoutOptions from './SwipeoutOptions';
import Row from './Row';

import {
  flex1,
  lCenterCenter,
  white
} from 'rc-mobile-base/lib/styles';
import checkEqual from 'rc-mobile-base/lib/utils/check-equal';
import compare from 'rc-mobile-base/lib/utils/compare';

class SwipeRow extends Component {

  _handlePress = (activity, toggle) => {
    const { task, onSwipeoutPress } = this.props;

    if (this.swipeable && this.swipeable.recenter) {
      this.swipeable.recenter();
    }

    InteractionManager.runAfterInteractions(() => {
      activity.children ? toggle() : onSwipeoutPress(task, activity);
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !checkEqual(this.props, nextProps, 'task.activities')
        || !checkEqual(this.props, nextProps, 'task.last_ts')
        || !checkEqual(this.props, nextProps, 'task.room.name')
        || !checkEqual(this.props, nextProps, 'task.room.guestStatus')
        || !checkEqual(this.props, nextProps, 'task.room.roomHousekeeping.code');
  }

  // componentDidUpdate() {
  //   console.log('did update', this.props.task.uuid);
  // }

  render() {
    const { onSwipeoutPress, onScroll, task } = this.props;

    const createSwipeOption = (activity, toggle) => {
      return (
        <TouchableOpacity style={[{ backgroundColor: activity.backgroundColor, height: 70 }, flex1, { justifyContent: 'center'}]} onPress={() => this._handlePress(activity)}>
          <Text style={[white.text, { width: 75, textAlign: 'center'}]}>{ I18n.t(`base.ubiquitous.${activity.text.toLowerCase()}`) }</Text>
        </TouchableOpacity>
      )
    }

    return (
      <ModalToggler
        modalProps={{
          transparent: true
        }}
        renderValue={(toggle) => (
           <Swipeable
             onSwipeStart={() => onScroll && onScroll(false)}
             onSwipeRelease={() => onScroll && onScroll(true)}
             onRef={ref => this.swipeable = ref}
             style={[flex1]}
             rightButtons={task.activities.map(activity => createSwipeOption(activity, toggle))}
           >
             <Row {...this.props} task={task} />
           </Swipeable>
        )}
        renderModal={(toggle) => {
          const withChildren = task.activities.find(activity => activity.children)
          if (!withChildren) {
            return null
          }
          return (
            <SwipeoutOptions
              value={withChildren.children}
              task={task}
              onPress={onSwipeoutPress}
              close={toggle}
            />
          )
        }}
      />
    )
  }
}


export default SwipeRow;
