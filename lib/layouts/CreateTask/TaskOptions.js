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

class TaskOptions extends Component {

  _renderPriority() {
    const { isShowPriority, isPriority, handleUpdatePriority} = this.props;

    if (!isShowPriority) {
      return null;
    }

    return (
      <View>
        <SectionHeading style={{paddingLeft: 15, marginTop: 15}}>{ I18n.t('base.ubiquitous.priority') }</SectionHeading>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={[styles.optionBtn, isPriority ? { backgroundColor: '#3CC86B' } : null]} onPress={() => handleUpdatePriority(true)}>
            <Text style={styles.bigBtnText}>{ I18n.t(`base.ubiquitous.yes`) }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionBtn, isPriority ? null : { backgroundColor: '#C93C46' }]} onPress={() => handleUpdatePriority(false)}>
            <Text style={styles.bigBtnText}>{ I18n.t(`base.ubiquitous.no`) }</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderMandatory() {
    const { isMandatory, handleUpdateMandatory} = this.props;

    return (
      <View>
        <SectionHeading style={{paddingLeft: 15, marginTop: 15}}>{ I18n.t('base.ubiquitous.mandatory-task') }</SectionHeading>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={[styles.optionBtn, isMandatory ? { backgroundColor: '#3CC86B' } : null]} onPress={() => handleUpdateMandatory(true)}>
            <Text style={styles.bigBtnText}>{ I18n.t(`base.ubiquitous.yes`) }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionBtn, isMandatory ? null : { backgroundColor: '#C93C46' }]} onPress={() => handleUpdateMandatory(false)}>
            <Text style={styles.bigBtnText}>{ I18n.t(`base.ubiquitous.no`) }</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderBlocking() {
    const { isBlocking, handleUpdateBlocking} = this.props;

    return (
      <View>
        <SectionHeading style={{paddingLeft: 15, marginTop: 15}}>{ I18n.t('base.ubiquitous.blocking-task') }</SectionHeading>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={[styles.optionBtn, isBlocking ? { backgroundColor: '#3CC86B' } : null]} onPress={() => handleUpdateBlocking(true)}>
            <Text style={styles.bigBtnText}>{ I18n.t(`base.ubiquitous.yes`) }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionBtn, isBlocking ? null : { backgroundColor: '#C93C46' }]} onPress={() => handleUpdateBlocking(false)}>
            <Text style={styles.bigBtnText}>{ I18n.t(`base.ubiquitous.no`) }</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <View style={styles.container}>

        { this._renderPriority() }
        { this._renderMandatory() }
        { this._renderBlocking() }

        <View style={styles.spacer}></View>
        <Button style={{ height: 50, backgroundColor: '#3CC86B', borderRadius: 0, margin: 0 }} onPress={handleSubmit}>
          <Text style={styles.bigBtnText}>{ I18n.t('base.ubiquitous.submit').toUpperCase() }</Text>
        </Button>
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
    backgroundColor: '#F7F7F7'
  },
  spacer: {
    flex: 1
  },
  bigBtnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '500'
  },
  optionContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4
  },
  optionBtn: {
    width: 80,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#AFAFAF',
    marginRight: 5
  },
});

export default TaskOptions;
