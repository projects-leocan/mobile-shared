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
  SafeAreaView,
} from 'react-native';
import I18n from 'react-native-i18n';
import * as Colors from 'rc-mobile-base/lib/styles';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { isAndroid } from 'rc-mobile-base/lib/utils/platform';
import Immersive from 'react-native-immersive';
import _ from 'lodash';
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
      children,
      ...otherProps
    } = this.props;

    return (
      <View>
        {children ?
          <TouchableOpacity style={[styles.optionBtn, { ...Colors.greyDk.bg }]} onPress={this._handleInputPress}>
            <Text style={styles.optionBtnText}>{children}</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={this._handleInputPress} style={styles.dropdownButton}>
            <Text style={styles.dropdownButtonText}>{value ? value : I18n.t('runner.glitch-form.glitch-category-selector.select-category')}</Text>
            <EntypoIcon name="arrow-down" />
          </TouchableOpacity>
        }
        <Modal
          visible={this.state.isModalOpen}
          animationType={"slide"}
          onShow={this._handleModalOnShow}
          onRequestClose={this._handleModalOnRequestClose}>
          {this._getModalContent()}
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
    if (isAndroid()) {
      Immersive.on();
    }
  }

  _handleModalOnRequestClose = () => {
    if (isAndroid()) {
      Immersive.on();
    }
  }

  _unsetGlitchCategory = () => {
    this.setState({ selectedCategory: null });
  }

  _setGlitchCategory = (category) => {
    // this.setState({ selectedCategory: category });
    if (!_.isEmpty(category?.options)) {
      this.setState({ selectedCategory: category });
    } else {
      this._makeSelection(category.name);
    }
  }

  _makeSelection = (value) => {
    const { input: { onChange } } = this.props;
    onChange(value);
    this._closeModal();
  }

  _getModalContent = () => {
    const { selectedCategory } = this.state;

    if (!selectedCategory) {
      return this._getCategorySelectionContent();
    } else {
      return this._getGlitchSelectionContent(selectedCategory);
    }
  }

  _getCategorySelectionContent = () => {
    const { glitchCategories, ...otherProps } = this.props;

    return (
      <View style={styles.modalContentContainer}>
        <View style={styles.titleBar}>
          <View style={styles.titleBarTitleContainer}>
            <Text style={styles.titleBarTitle}>{I18n.t('runner.glitch-form.glitch-category-selector.select-glitch-category')}</Text>
          </View>
          <View style={styles.titleBarIconRightContainer}>
            <TouchableOpacity onPress={this._closeModal}>
              <EntypoIcon name='cross' size={30} style={styles.titleBarIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          {/* {
          Object.keys(glitchCategories).map( (category, idx) => {
            let iconName = glitchCategories[category].icon;
            return <CategoryRow label={glitchCategories[category].label} category={category} iconName={iconName} onPress={this._setGlitchCategory} key={idx}/>
          })
        } */}

          {
            !_.isEmpty(glitchCategories) && glitchCategories.map((category, idx) => {
              // let iconName = glitchCategories[category].icon;
              return <CategoryRow label={category.name} category={category} onPress={this._setGlitchCategory} />
            })
          }
        </ScrollView>
      </View>
    );
  }

  _getGlitchSelectionContent = () => {
    const { glitchCategories, input: { onChange } } = this.props;
    const { selectedCategory } = this.state;

    // const label = glitchCategories[selectedCategory].label;
    // const iconName = glitchCategories[selectedCategory].icon;
    // const options = glitchCategories[selectedCategory].options;
    const label = selectedCategory.name;
    // const iconName = selectedCategory.icon;
    const options = selectedCategory.options;

    return (
      <View style={styles.modalContentContainer}>
        <View style={styles.titleBar}>
          <View style={styles.titleBarIconLeftContainer}>
            <TouchableOpacity onPress={this._unsetGlitchCategory}>
              <EntypoIcon name='chevron-left' size={30} style={styles.titleBarIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.titleBarTitleContainer}>
            <Text style={styles.titleBarTitle}>{I18n.t('runner.glitch-form.glitch-category-selector.select-glitch')}</Text>
          </View>

        </View>
        <View style={styles.categoryHeader}>
          {/* <FaIcon name={iconName} size={40} style={styles.categoryHeaderIcon} /> */}
          <Text style={styles.categoryHeaderText}>{label.toUpperCase()}</Text>
        </View>
        <ScrollView>
          {/* {
            options.map((glitch, idx) => {
              const value = `${label} - ${glitch}`;
              return <GlitchRow category={selectedCategory} glitch={glitch} key={idx} onPress={() => this._makeSelection(value)} />
            })
          } */}

        {
          options.map( (glitch, idx) => {
            const value = `${label} - ${glitch.name}`;
            return <GlitchRow category={selectedCategory} glitch={glitch.name} key={idx} onPress={() => this._makeSelection(glitch.withMainCategory)}/>
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

const CategoryRow = ({ label, category, iconName, onPress }) => {
  return (
    <View style={styles.categoryRowOuterContainer}>
      <TouchableOpacity onPress={() => onPress(category)}>
        <View style={styles.categoryRowInnerContainer}>
          {/* <FaIcon name={iconName} size={36} /> */}
          <Text>{label.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const GlitchRow = ({ category, glitch, onPress }) => {
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
    height: 100,
  },
  titleBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 100,
    paddingBottom: 15  ,
  },
  titleBarTitle: {
    color: Colors.white.color,
    fontSize: 18,
  },
  titleBarIconRightContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent:"flex-end",
    // justifyContent: 'center',
    height: 100,
    zIndex: 9999,
    backgroundColor: 'transparent',
    top: 0,
    right: 0,
    paddingRight: 15,
    paddingBottom:10
    // paddingTop: 5,
  },
  titleBarIconLeftContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: "flex-end",
    height: 100,
    zIndex: 9999,
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    paddingLeft: 15,
    paddingBottom: 12
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
  optionBtn: {
    height: 50,
    width: 120,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3
  },
  optionBtnText: {
    ...Colors.white.text,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default GlitchCategorySelector;
