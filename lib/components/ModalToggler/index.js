import React, { Component } from 'react';
import { View, Modal } from 'react-native';

export class ModalToggler extends Component {
  state = {
    isVisible: false
  }

  toggle = () => this.setState({ isVisible: !this.state.isVisible })

  render() {
    const { renderValue, renderModal, modalStyle, modalProps, ...props } = this.props;

    return (
      <View>
        {renderValue(this.toggle)}
        <Modal
          style={modalStyle}
          animationType={"slide"}
          transparent={false}
          visible={this.state.isVisible}
          onRequestClose={() => null}
          {...modalProps}
        >
          {renderModal(this.toggle)}
        </Modal>
      </View>
    )
  }
}

export default ModalToggler
