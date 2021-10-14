import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import RNModal from 'react-native-modalbox';
import { omit } from 'lodash/object';
import { connect } from 'react-redux';

import { mergeStyles } from '../../utils/styles';

import { modalContentSelector, modalParamsSelector } from '../selectors';
import { close as closeModal } from '../actions';

const sanitizeProps = (props) => omit(props, ['isOpen', 'onClose', 'style']);
const dims = {
  height: Dimensions.get('window').height - 160,
  width: 500,
}

export const Modal = ({ children, style, ...params }) => {
  return (
    <RNModal
      coverScreen
      style={mergeStyles([dims], style)}
      {...params}
    >
      {children}
    </RNModal>
  )
}

const ModalComponent = ({ modalContent, params, handleClosed }) => {
  const style = params && params.style;
  const others = params && sanitizeProps(params);

  if (!modalContent) {
    return null;
  }

  return (
    <RNModal
      isOpen={true}
      onClosed={handleClosed}
      style={mergeStyles([dims], style)}
      {...others}
    >
      {modalContent}
    </RNModal>
  )
}

const mapPropsToState = (state) => ({
  modalContent: modalContentSelector(state),
  params: modalParamsSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  handleClosed: () => dispatch(closeModal()),
  dispatch
})

export const ModalLayout = connect(mapPropsToState, mapDispatchToProps)(ModalComponent);
export default ModalLayout;
