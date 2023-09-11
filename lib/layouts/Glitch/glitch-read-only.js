import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import I18n from 'react-native-i18n';
import SectionHeading from 'rc-mobile-base/lib/components/section-heading';
import { margin, padding } from 'rc-mobile-base/lib/styles/positioning';
import { greyDk, blue, white, slate, blueLt } from 'rc-mobile-base/lib/styles/colors';

import GlitchCategorySelector from './glitch-form/glitch-category-selector';
import Section from './glitch-form/section';

class GlitchReadOnly extends Component {

  render() {
    const { initialValues, handleStart, handleChangeCategory, glitchCategories, userId } = this.props;
    console.log("initialValues +++",initialValues);
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ ...padding.t10 }}>
            <Section title={ I18n.t('runner.glitch-form.index.room') }>
              <Text style={[slate.text, { fontSize: 16 }]}>{ initialValues.roomName }</Text>
            </Section>
            <Section title={ I18n.t('runner.glitch-form.index.name') }>
              <Text style={[slate.text, { fontSize: 16 }]}>{ initialValues.guestName }</Text>
            </Section>
            <Section title={ I18n.t('runner.glitch-form.index.vip') }>
              <Text style={[slate.text, { fontSize: 16 }]}>{ initialValues.vip }</Text>
            </Section>
            <Section title={ I18n.t('runner.glitch-form.index.email') }>
              <Text style={[slate.text, { fontSize: 16 }]}>{ initialValues.email }</Text>
            </Section>

            <Section title={ I18n.t('runner.glitch.glitch-read-only.glitch-category') }>
              <Text style={[slate.text, { fontSize: 16 }]}>{ initialValues.experienceCategoryName }</Text>
            </Section>

            <Section title={ I18n.t('runner.glitch.glitch-read-only.glitch-description') }>
              <Text style={[slate.text, { fontSize: 16 }]}>{ initialValues.description }</Text>
            </Section>

            <Section title={ I18n.t('runner.glitch.glitch-read-only.glitch-action') }>
              <Text style={[slate.text, { fontSize: 16 }]}>{ initialValues.actions }</Text>
            </Section>

            <Section title={ I18n.t('runner.glitch.glitch-read-only.glitch-followup') }>
              <Text style={[slate.text, { fontSize: 16 }]}>{ initialValues.internalFollowUp }</Text>
            </Section>

            <Section title={ I18n.t('runner.glitch.glitch-read-only.glitch-cost') }>
              <Text style={[slate.text, { fontSize: 16 }]}>{ initialValues.cost }</Text>
            </Section>

            <Section title={ I18n.t('runner.glitch.glitch-read-only.current-responsibility') }>
              { initialValues.responsible_id ?
                <Text style={[slate.text, { fontSize: 16 }]}>{ initialValues.responsible_first_name } { initialValues.responsible_last_name }</Text>
                :
                <Text style={[slate.text, { fontSize: 16 }]}>{ I18n.t('runner.glitch.glitch-read-only.none') }</Text>
              }
            </Section>
          </ScrollView>
        </View>
        { initialValues.is_completed ?
          <View style={styles.optionsRow}>
            <TouchableOpacity style={[styles.optionBtn, { ...blue.bg }]} onPress={null}>
              <Text style={styles.optionBtnText}>{ I18n.t('runner.glitch.glitch-read-only.send-email') }</Text>
            </TouchableOpacity>
          </View>
          : initialValues.is_started ?
          <View style={styles.readOnlyContainer}>
            <Text style={styles.readOnlyText}>
              
              { `${I18n.t('runner.glitch.glitch-read-only.assigned-to')} ${initialValues.responsible_first_name} ${initialValues.responsible_last_name}`}
            </Text>
          </View>
          :
          <View style={styles.optionsRow}>
            <GlitchCategorySelector
              input={{ ...initialValues.value, onChange: handleChangeCategory }}
              glitchCategories={glitchCategories}
              >{ I18n.t('runner.glitch.glitch-read-only.change-category') }</GlitchCategorySelector>
            <TouchableOpacity style={[styles.optionBtn, { ...blue.bg }]} onPress={handleStart}>
              <Text style={styles.optionBtnText}>{ I18n.t('runner.glitch.glitch-read-only.start') }</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionHeading: {
    ...margin.t15
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...margin.t20
  },
  optionBtn: {
    height: 50,
    width: 120,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3
  },
  optionBtnText: {
    ...white.text,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center'
  },
  readOnlyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...padding.y10,
    ...blueLt.bg
  },
  readOnlyText: {
    ...white.text
  }
});

export default GlitchReadOnly;
