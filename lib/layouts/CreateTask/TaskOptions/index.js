import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';

import ListView from 'rc-mobile-base/lib/components/ListView';
import Button from 'rc-mobile-base/lib/components/Button';

import SectionHeading from 'rc-mobile-base/lib/components/section-heading';
// import { blueLt } from '../../styles'
import { blueLt, splashBg, white, themeTomato, isTab } from 'rc-mobile-base/lib/styles';
import TaskButton from '../TaskButton';

const stepIndicatorBG = '#f4f8ff';
const activeGreen = '#9afdaa';

class TaskOptions extends Component {

  _renderPriority() {
    const { isShowPriority, isPriority, handleUpdatePriority } = this.props;

    if (!isShowPriority) {
      return null;
    }

    return (
      <View style={styles.itemContainer}>
        <SectionHeading style={{ paddingLeft: 15, marginTop: 15, flex: isTab ? 3 : 1, }}>{I18n.t('base.ubiquitous.priority')}</SectionHeading>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={[styles.optionBtn, isPriority == null ? null : isPriority ? { backgroundColor: activeGreen } : null]} onPress={() => handleUpdatePriority(true)}>
            <Text style={styles.bigBtnText}>{I18n.t(`base.ubiquitous.yes`)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionBtn, isPriority == null ? null : isPriority ? null : { backgroundColor: activeGreen }]} onPress={() => handleUpdatePriority(false)}>
            <Text style={styles.bigBtnText}>{I18n.t(`base.ubiquitous.no`)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderMandatory() {
    const { isMandatory, handleUpdateMandatory } = this.props;

    return (
      <View style={styles.itemContainer}>
        <SectionHeading style={{ paddingLeft: 15, marginTop: 15, flex: isTab ? 3 : 1 }}>{I18n.t('base.ubiquitous.mandatory-task')}</SectionHeading>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={[styles.optionBtn, isMandatory == null ? null : isMandatory ? { backgroundColor: activeGreen } : null]} onPress={() => handleUpdateMandatory(true)}>
            <Text style={styles.bigBtnText}>{I18n.t(`base.ubiquitous.yes`)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionBtn, isMandatory == null ? null : isMandatory ? null : { backgroundColor: activeGreen }]} onPress={() => handleUpdateMandatory(false)}>
            <Text style={styles.bigBtnText}>{I18n.t(`base.ubiquitous.no`)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderBlocking() {
    const { isBlocking, handleUpdateBlocking } = this.props;

    return (
      <View style={styles.itemContainer}>
        <SectionHeading style={{ paddingLeft: 15, marginTop: 15, flex: isTab ? 3 : 1 }}>{I18n.t('base.ubiquitous.blocking-task')}</SectionHeading>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={[styles.optionBtn, isBlocking == null ? null : isBlocking ? { backgroundColor: activeGreen } : null]} onPress={() => handleUpdateBlocking(true)}>
            <Text style={styles.bigBtnText}>{I18n.t(`base.ubiquitous.yes`)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionBtn, isBlocking == null ? null : isBlocking ? null : { backgroundColor: activeGreen }]} onPress={() => handleUpdateBlocking(false)}>
            <Text style={styles.bigBtnText}>{I18n.t(`base.ubiquitous.no`)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.bodyContainer} >
        {this._renderPriority()}
        {this._renderMandatory()}
        {this._renderBlocking()}

        </View>
       
       <View style={styles.footerContainer}>

       </View>
        {/* <View style={styles.spacer}></View>
        <Button style={{ height: 50, backgroundColor: blueLt.color, borderRadius: 0, margin: 0 }} onPress={handleSubmit}>
          <Text style={styles.bigBtnText}>{I18n.t('base.ubiquitous.submit').toUpperCase()}</Text>
        </Button> */}
        <TaskButton
            label="Submit"
            buttonStyle={{ backgroundColor: themeTomato.color, borderWidth: 0 }}
            labelStyle={{ color: '#FFF' }}
            onPress={() => handleSubmit()}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    backgroundColor: white.color
  },
  bodyContainer: {
    flex: 0.85
  },
  footerContainer: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12
  },
  spacer: {
    flex: 1
  },
  bigBtnText: {
    color: splashBg.color,
    fontSize: 17,
    fontWeight: '500'
  },
  optionContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4
  },
  optionBtn: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: stepIndicatorBG,
  },
});

export default TaskOptions;
