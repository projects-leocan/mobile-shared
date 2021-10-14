import React, { Component } from 'react';
import { SectionList } from 'react-native';
import I18n from 'react-native-i18n';
import ListView from 'rc-mobile-base/lib/components/ListView';
import { isEmpty } from 'lodash/lang';

import TaskRow from '../TaskRow';

import SectionHeader from './SectionHeader';

const headerI18n = (title) => ['priority', 'normal', 'unassigned'].includes(title) ? I18n.t(`base.ubiquitous.${title}`) : title;

export class TaskList extends Component {
  state = {
    scrollEnabled: true,
  }

  handleScroll = (scrollEnabled) => this.setState({ scrollEnabled })

  handleSwipeout = (task, activity) => {
    
    this.props.onSwipeoutPress(task, activity);
  }

  render() {
    const { tasks, Row = TaskRow, sectionId, onPress, onSwipeoutPress, renderTask, renderHeader, isVirtualized, ...props } = this.props;

    if (isVirtualized) {
      return (
        <SectionList
          sections={tasks}
          scrollEnabled={this.state.scrollEnabled}
          renderItem={({ item }) => (
            <Row
              task={item}
              onPress={onPress}
              onSwipeoutPress={onSwipeoutPress && this.handleSwipeout}
              onScroll={!!this.handleScroll && this.handleScroll}
            />
          )}
          renderSectionHeader={renderHeader ? renderHeader : ({ section }) => <SectionHeader key={section.title} value={headerI18n(section.title)} />}
          keyExtractor={(item, index) => item.uuid}
          />
      )
    }

    return (
      <ListView
        data={tasks}
        scrollEnabled={this.state.scrollEnabled}
        renderRow={renderTask ? renderTask : (task) => (
          <Row
            task={task}
            key={task.uuid}
            onPress={onPress}
            onSwipeoutPress={onSwipeoutPress && this.handleSwipeout}
            onScroll={this.handleScroll}
          />
        )}
        renderSectionHeader={renderHeader ? renderHeader : (section) => <SectionHeader value={headerI18n(section)} />}
        getSectionId={(task) => task[sectionId]}
        {...props}
      />
    )
  }
}

export default TaskList
