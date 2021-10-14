import React, { Component } from 'react';
import { Dimensions } from 'react-native';

const defaultSplit = '50:50';

const buildColumns = (split, width, shift = 0) => {
  let _width = width;
  if (!_width) {
    _width = Dimensions.get('window').width - Number(shift);
  }
  let _split = split;
  if (!_split) {
    _split = defaultSplit;
  }
  const columns = _split.split(':').map(column => _width * Number(column) / 100);
  const styles = columns.map(column => ({ width: column }));

  return [styles, columns, _width];
}

export const Layouter = ({ children, split, width, shift }) => {
  return children(...buildColumns(split, width, shift));
}

Layouter.propTypes = {
  // children: React.PropTypes.func.isRequired,
};

export default Layouter
