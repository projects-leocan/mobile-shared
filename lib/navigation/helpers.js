import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet, View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from 'react-native-i18n';

import {
  white,
  padding,
  red,
} from 'rc-mobile-base/lib/styles';
import FIcon from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  alertTasksBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    ...padding.x20,
    ...padding.y10
  },
  alertTasksText: {
    ...red.text,
    marginLeft: 2,
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: red.color,
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2
  },
  runnerAlertTasksBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    ...padding.x20,
    ...padding.y10
  },
  runnerRefreshBtn:{
    height: 48, ...padding.y10, marginRight:10 
  }
})

const LeftButton = ({ onPress, icon, ...props }) => (
  <TouchableOpacity
    style={[padding.x20, padding.y10]}
    onPress={onPress}
    {...props}
  >
    <Icon name={icon} size={24} color={white.color} />
  </TouchableOpacity>
)

export const Hamburger = ({ onPress }) => (
  <LeftButton testID="openDrawer" icon="bars" onPress={onPress} />
)

export const Back = ({ onPress }) => (
  <LeftButton icon="chevron-left" onPress={onPress} />
)

export const TaskButton = ({ tasksLength, onPress }) => (
  <TouchableOpacity
    style={styles.alertTasksBtn}
    onPress={onPress}
  >
    <Text style={styles.alertTasksText}>{tasksLength} {tasksLength <= 1 ? I18n.t("base.ubiquitous.task").toUpperCase() : I18n.t("base.ubiquitous.tasks").toUpperCase()}</Text>
  </TouchableOpacity>
)

export const RunnerTaskButton = ({ tasksLength, onPress, onRefresh }) => (
  <View style={{ flexDirection: "row" }}>
  {
    tasksLength > 0 ?
    <TouchableOpacity
      style={styles.runnerAlertTasksBtn}
      onPress={onPress}
    >
      <Text style={styles.alertTasksText}>{tasksLength} {tasksLength <= 1 ? I18n.t("base.ubiquitous.task").toUpperCase() : I18n.t("base.ubiquitous.tasks").toUpperCase()}</Text>
    </TouchableOpacity> : <></>
  }
    <TouchableOpacity style={styles.runnerRefreshBtn} onPress={onRefresh}>
      <FIcon name='refresh-ccw' size={25} color={"white"} />
    </TouchableOpacity>
  </View>

)


