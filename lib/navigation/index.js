import React from 'react';
import {
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import I18n from 'react-native-i18n';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import Icon from 'react-native-vector-icons/FontAwesome';
import { get } from 'lodash/object';

import NotificationsLayout from 'rc-mobile-base/lib/layouts/Notifications';
import CreateNotificationLayout from 'rc-mobile-base/lib/layouts/CreateNotification';
import TasksLayout from 'rc-mobile-base/lib/layouts/Tasks';
import ConvertTaskLayout from 'rc-mobile-base/lib/layouts/ConvertTask';
import TaskDetail from 'rc-mobile-base/lib/layouts/TaskDetail';

import { Back, Hamburger, TaskButton, RunnerTaskButton } from './helpers';
import DrawerCreator from './drawer';
import {
  padding, white,
} from 'rc-mobile-base/lib/styles';
import { splashBg } from '../styles';

TasksLayout.navigationOptions = ({ navigation, screenProps }) => ({
  title: I18n.t('base.navigation.index.tasks'),
});

NotificationsLayout.navigationOptions = ({ navigation, screenProps }) => ({
  title: I18n.t('base.navigation.index.notifications'),
});

CreateNotificationLayout.navigationOptions = ({ navigation, screenProps }) => ({
  title: I18n.t('base.navigation.index.create-notification'),
});

ConvertTaskLayout.navigationOptions = ({ navigation, screenProps }) => ({
  title: I18n.t('base.navigation.index.convert-task'),
});

const navigationCreate = (scenes, links, params) => {
  const MainLayout = scenes.Main && scenes.Main.screen
  const drawer = DrawerCreator(links)

  const additionals = params || {}

  if (MainLayout) {
    MainLayout.navigationOptions = ({ navigation, screenProps }) => ({
      // title: I18n.t('base.navigation.index.home'),
      title: screenProps?.selectedHotel,
      // headerLeft: <Hamburger onPress={() => navigation.navigate('DrawerOpen')} />
      headerLeft: () => <Hamburger onPress={() => navigation.openDrawer()} />,
      headerRight: () => (screenProps.isAttendantApp && screenProps.tasksLength > 0) 
      ? 
        <TaskButton tasksLength={screenProps.tasksLength || 0} onPress={() => navigation.navigate("Tasks")} /> 
      :
      (screenProps.isRunnerApp && screenProps.tasksLength > 0) ? 
             <RunnerTaskButton tasksLength={screenProps.tasksLength || 0} onPress={() => navigation.navigate("Tasks")} onRefresh={screenProps.onRefresh}/>
            
      : 
        null

      // headerRight: () => ((screenProps.isAttendantApp || screenProps.isRunnerApp) && screenProps.tasksLength > 0) ? <TaskButton tasksLength={screenProps.tasksLength || 0} onPress={() => navigation.navigate("Tasks")} /> : null
    });
  }

  const mainStack = createStackNavigator({
    Tasks: { screen: TasksLayout },
    ExpandedTaskDetail: { screen: TaskDetail },
    Notifications: { screen: NotificationsLayout },
    CreateNotification: { screen: CreateNotificationLayout },
    ConvertTask: { screen: ConvertTaskLayout },
    ...scenes,
    Main: { screen: MainLayout },
  }, {
    initialRouteName: 'Main',
    transitionConfig: () => ({
      duration: 100
    }),
    defaultNavigationOptions: ({ navigation }) => ({
      headerTintColor: '#FFF',
      headerStyle: splashBg.bg,
      // headerTitleStyle: {
      //   textAlign: 'center',
      //   color: 'white',
      //   fontWeight: 'normal',
      // },
      headerLeft:() => <Back onPress={() => navigation.goBack()} />,
    }),
    onNavigationStateChange: () => null
  })

  const router = mainStack.router
  mainStack.router = {
    ...router,
    getStateForAction(action, state) {
      if (!state) {
        return router.getStateForAction(action, state);
      }
      const { type, routeName } = action
      const lastRoute = state.routes[state.routes.length - 1]

      if (params && params.logger) {
        const logger = params.logger
        logger.group((log) => {
          log('info', { reduxAction: type })
          log('info', { routeName, params: get(action, 'params') })
        })
      }

      if (type == lastRoute.type && routeName == lastRoute.routeName) {
        return null
      }
      if (routeName === lastRoute.routeName && get(action, 'params.roomId', 1) == get(lastRoute, 'params.roomId', 0)) {
        return null;
      }
      return router.getStateForAction(action, state);
    },
  };

  const baseNavigator = createDrawerNavigator({
    Main: { screen: mainStack },
  }, {
    initialRouteName: 'Main',
    contentComponent: drawer,
    ...additionals,
  });

  return createAppContainer(baseNavigator)
}

export const Navigation = { create: navigationCreate }
export * from './helpers'

export default Navigation
