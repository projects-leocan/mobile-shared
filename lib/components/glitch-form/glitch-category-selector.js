import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';

import * as Colors from 'rc-mobile-base/lib/styles';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { isAndroid } from 'rc-mobile-base/lib/utils/platform';
import Immersive from 'react-native-immersive';

const glitchCategories = {
  'Front Office': {
    glitches: [
      'Room allocation',
      'Accuracy of invoice',
      'Attitude of Staff',
      'Luggage issue',
      'Arrival Experience',
      'Departure Experience',
      'Other',
    ],
    icon: 'building-o',
  },
  'Housekeeping': {
    glitches: [
        'Spa treatments',
        'Condition of room cleanliness',
        'Attitude of Staff',
        'Condition of bathroom cleanliness',
        'Condition of pool cleanliness',
        'Laundry Dry Cleaning',
        'Noise level',
        'Other',
    ],
    icon: 'bed',
  },
  'F&B': {
    glitches: [
      'Quality of the Food',
      'Timeliness of service',
      'Attitude of Staff',
      'Accuracy of order',
      'Meeting Rooms',
      'Value for money',
      'Other',
    ],
    icon: 'cutlery',
  },
  'General': {
    glitches: [
      'Rate your Stay',
      'Social Media Responce',
      'Attitude of Staff',
      'Overall Experience',
      'Security',
      'Schadensmeldung Vorfall',
      'Other',
    ],
    icon: 'list-alt',
  },
  'Reservations': {
    glitches: [
      'Accuracy of Reservation',
      'Other',
    ],
    icon: 'bell-o'
  },
  'Technik / IT': {
    glitches: [
      'Condition of furniture ',
      'Technical defect',
      'TV',
      'Internet',
      'Other',
    ],
    icon: 'laptop',
  }
};

class GlitchCategorySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      selectedCategory: null,
    };
  }

  render() {
    const {
      input: { value, onChange },
      ...otherProps
    } = this.props;

    return (
      <View>
        <TouchableOpacity onPress={this._handleInputPress} style={styles.dropdownButton}>
          <Text style={styles.dropdownButtonText}>{ value ? value : I18n.t('base.glitch-form.glitch-category-selector.select-category') }</Text>
          <EntypoIcon name="arrow-down" />
        </TouchableOpacity>
        <Modal
          visible={this.state.isModalOpen}
          animationType={"slide"}
          onShow={this._handleModalOnShow}
          onRequestClose={this._handleModalOnRequestClose}>
            { this._getModalContent() }
        </Modal>
      </View>
    );
  }

  _closeModal = () => {
    this.setState({
      isModalOpen: false,
      selectedCategory: null,
    });
  }

  _handleModalOnShow = () => {
    if(isAndroid()) {
      Immersive.on();
    }
  }

  _handleModalOnRequestClose = () => {
    if(isAndroid()) {
      Immersive.on();
    }
  }

  _unsetGlitchCategory = () => {
    this.setState({ selectedCategory: null });
  }

  _setGlitchCategory = (category) => {
    this.setState({ selectedCategory: category });
  }

  _makeSelection = (value) => {
    const { input: { onChange } } = this.props;
    onChange(value);
    this._closeModal();
  }

  _getModalContent = () => {
    const { selectedCategory } = this.state;

    if(!selectedCategory) {
      return this._getCategorySelectionContent();
    } else {
      return this._getGlitchSelectionContent(selectedCategory);
    }
  }

  _getCategorySelectionContent = () => {
    return (
      <View style={styles.modalContentContainer}>
        <View style={styles.titleBar}>
          <View style={styles.titleBarTitleContainer}>
            <Text style={styles.titleBarTitle}>{ I18n.t('base.glitch-form.glitch-category-selector.select-glitch-category').toUpperCase() }</Text>
          </View>
          <View style={styles.titleBarIconRightContainer}>
            <TouchableOpacity onPress={this._closeModal}>
              <EntypoIcon name='cross' size={30} style={styles.titleBarIcon}/>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
        {
          Object.keys(glitchCategories).map( (category, idx) => {
            let iconName = glitchCategories[category].icon;
            return <CategoryRow category={category} iconName={iconName} onPress={this._setGlitchCategory} key={idx}/>
          })
        }
        </ScrollView>
      </View>
    );
  }

  _getGlitchSelectionContent = () => {
    const { selectedCategory } = this.state;
    const label = glitchCategories[selectedCategory].label;
    const iconName = glitchCategories[selectedCategory].icon;
    const glitches = glitchCategories[selectedCategory].glitches;
    const { input: { onChange } } = this.props;

    return (
      <View style={styles.modalContentContainer}>
        <View style={styles.titleBar}>
          <View style={styles.titleBarIconLeftContainer}>
            <TouchableOpacity onPress={this._unsetGlitchCategory}>
              <FaIcon name='angle-left' size={24} style={styles.titleBarIcon}/>
            </TouchableOpacity>
          </View>
          <View style={styles.titleBarTitleContainer}>
            <Text style={styles.titleBarTitle}>{ I18n.t('base.glitch-form.glitch-category-selector.select-glitch').toUpperCase() }</Text>
          </View>

        </View>
        <View style={styles.categoryHeader}>
          <FaIcon name={iconName} size={40} style={styles.categoryHeaderIcon}/>
          <Text style={styles.categoryHeaderText}>{ label.toUpperCase() }</Text>
        </View>
        <ScrollView>
        {
          glitches.map( (glitch, idx) => {
            const value = `${selectedCategory.toUpperCase()} - ${glitch.toUpperCase()}`;
            return <GlitchRow category={selectedCategory} glitch={glitch} key={idx} onPress={() => this._makeSelection(value)}/>
          })
        }
        </ScrollView>
      </View>
    );
  }

  _handleInputPress = () => {
    this.setState({ isModalOpen: true });
  }
}

const CategoryRow = ({ category, iconName, onPress }) => {
  return (
    <View style={styles.categoryRowOuterContainer}>
      <TouchableOpacity onPress={() => onPress(category)}>
        <View style={styles.categoryRowInnerContainer}>
          <FaIcon name={iconName} size={36} />
          <Text>{category.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const GlitchRow = ({ category, glitch , onPress }) => {
  return (
    <View style={styles.glitchRowOuterContainer}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.categoryRowInnerContainer}>
          <Text>{glitch.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  modalContentContainer: {
    flex: 1,
  },
  dropdownButton: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownButtonText: {
    marginRight: 5,
    fontWeight: 'bold',
  },
  titleBar: {
    backgroundColor: Colors.blue.color,
    height: 54,
  },
  titleBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
  },
  titleBarTitle: {
    color: Colors.white.color,
    fontSize: 18,
  },
  titleBarIconRightContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    zIndex: 9999,
    backgroundColor: 'transparent',
    top: 0,
    right: 0,
    paddingRight: 15,
    paddingTop: 5,
  },
  titleBarIconLeftContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    zIndex: 9999,
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    paddingLeft: 15
  },
  titleBarIcon: {
    color: Colors.white.color,
  },
  categoryRowOuterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLt.color
  },
  categoryRowInnerContainer: {
    paddingTop: 25,
    paddingBottom: 25,
    alignItems: 'center',
  },
  categoryHeader: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: Colors.blueLt.color,
  },
  categoryHeaderIcon: {
    color: Colors.white.color,
    marginBottom: 10
  },
  categoryHeaderText: {
    color: Colors.white.color,
    fontWeight: 'bold',
    fontSize: 20,
  },
  glitchRowOuterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLt.color,
  },
  glitchRowInnerContainer: {
    paddingTop: 25,
    paddingBottom: 25,
    alignItems: 'center',
  },
});

export default GlitchCategorySelector;
