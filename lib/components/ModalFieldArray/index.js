import React, { Component } from 'react';
import {
  View,
  Modal
} from 'react-native';

export class ModalFieldArray extends Component {
  state = {
    isVisible: false
  }

  handleValue = () => this.setState({ isVisible: !this.state.isVisible })

  render() {
    const { fields, renderValue, renderModal, ...props } = this.props;
    const modalProps = { ...props, fields }

    return (
      <View>
        {renderValue(this.handleValue, fields)}
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.isVisible}
          onRequestClose={() => this.setState({ isVisible: false })}
        >
          {renderModal(this.handleValue, modalProps)}
        </Modal>
      </View>
    )
  }
}

export default ModalFieldArray
