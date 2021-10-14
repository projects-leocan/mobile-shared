import React, { Component } from 'react';
import {
  View
} from 'react-native';
import ListView from 'rc-mobile-base/lib/components/ListView';

import { connect } from 'react-redux'
import { toggle as toggleModal } from 'rc-mobile-base/lib/modal';

const _renderRow = (row, toggleModal) => (data, sectionId, rowId) => row({ ...data, index: rowId, toggleModal })

export const TaskTableBase = ({ tasks, renderHeader, renderRow, toggleModal, sectionId }) => {
  return (
    <ListView
      data={tasks}
      renderSectionHeader={renderHeader}
      getSectionId={(task) => task[sectionId]}
      renderRow={_renderRow(renderRow, toggleModal)}
    />
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: (modalContent, params) => dispatch(toggleModal(modalContent, params)),
    dispatch
  }
};

export default connect(null, mapDispatchToProps)(TaskTableBase);
