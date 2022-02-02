import React, { createRef } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import styles from './styles';

import StepIndicator from 'react-native-step-indicator';
import PagerView from 'react-native-pager-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { splashBg } from 'rc-mobile-base/lib/styles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import SelectedAssets from './SelectedAssets';

const PAGES = ['Page 1', 'Page 2', 'Page 3', 'Page 4'];

const diableStrokeColor = '#b8c4e1'

const stepIndicatorStyles = {
    stepIndicatorSize: 60,
    currentStepIndicatorSize: 60,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 1,
    stepStrokeCurrentColor: diableStrokeColor,
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: splashBg.color,
    stepStrokeUnFinishedColor: diableStrokeColor,
    separatorFinishedColor: splashBg.color,
    separatorUnFinishedColor: diableStrokeColor,
    stepIndicatorFinishedColor: splashBg.color,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 0,
    stepIndicatorLabelCurrentColor: 'transparent',
    stepIndicatorLabelFinishedColor: 'transparent',
    stepIndicatorLabelUnFinishedColor: 'transparent',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: splashBg.color,
};


export default class CreateTask extends React.Component {
    constructor(props) {
        super(props);

        this.pagerRef = createRef()

        this.state = {
            currentPage: 0
        }
    }

    onStepPress = (position) => {
        this.setState({ currentPage: position });
        this.pagerRef.current.setPage(position)
    }

    renderViewPagerPage = (data, index) => {
        return (
            <View key={data} style={styles.pageContainer}>
                {/* <Text>{data}</Text> */}
                <SelectedAssets />
            </View>
        );
    };

    getStepIndicatorIconConfig = ({
        position,
        stepStatus,
      }) => {
        const iconConfig = {
          name: 'feed',
          color: stepStatus === 'finished' ? '#ffffff' : '#000',
          size: 25,
        };
        switch (position) {
          case 0: {
            iconConfig.name = 'shopping-cart';
            break;
          }
          case 1: {
            iconConfig.name = 'location-on';
            break;
          }
          case 2: {
            iconConfig.name = 'assessment';
            break;
          }
          case 3: {
            iconConfig.name = 'payment';
            break;
          }
          case 4: {
            iconConfig.name = 'track-changes';
            break;
          }
          default: {
            break;
          }
        }
        return iconConfig;
      };

    renderStepIndicator = (params) => (
        <MaterialIcons {...this.getStepIndicatorIconConfig(params)} />
      );

    render() {
        const { currentPage } = this.state;
        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <View style={styles.rootContainer}>
                    <View style={styles.stepIndicator}>
                        <StepIndicator
                            stepCount={4}
                            customStyles={stepIndicatorStyles}
                            currentPosition={currentPage+1}
                            renderStepIndicator={this.renderStepIndicator}
                            onPress={(position) => this.onStepPress(position)}
                        />
                    </View>

                    <PagerView
                        style={{ flexGrow: 1 }}
                        initialPage={0}
                        ref={this.pagerRef}
                        onPageSelected={(e) => this.onStepPress(e.nativeEvent.position)}>
                        {PAGES.map((page, index) => this.renderViewPagerPage(page, index))}
                    </PagerView>
                </View>
            </SafeAreaView>
        )
    }
}