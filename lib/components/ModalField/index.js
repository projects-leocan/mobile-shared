import React, { Component } from 'react';
import {
  View,
  Modal,
} from 'react-native';

export class ModalField extends Component {
  state = {
    isVisible: false
  }

  handleValue = () => this.setState({ isVisible: !this.state.isVisible })

  handleChange = (value) => {
    this.props.input.onChange(value);
    this.handleValue();
  }

  render() {
    const { input, renderValue, renderModal, ...props } = this.props;
    const selected = input.value;
    const modalProps = { ...props, selected }

    return (
      <View>
        {renderValue(this.handleValue, selected)}
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.isVisible}
          onRequestClose={() => this.setState({ isVisible: false })}
        >
          {renderModal(this.handleChange, modalProps)}
        </Modal>
      </View>
    )
  }
}

export default ModalField
