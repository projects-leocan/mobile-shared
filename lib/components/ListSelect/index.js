import React, { Component } from 'react';
import { View } from 'react-native';
import ListView from 'rc-mobile-base/lib/components/ListView';

import ModalField from '../ModalField';
import ModalHeader from '../ModalHeader';

export const ListSelect = ({ label, options, renderOption, renderValue, ...props }) => (
  <ModalField
    {...props}
    renderValue={renderValue}
    renderModal={(onChange) => (
      <View>
        <ModalHeader value={label} />
        <ListView
          data={options}
          renderRow={(option) => renderOption(onChange, option)}
        />
      </View>
    )}
  />
)

export default ListSelect
