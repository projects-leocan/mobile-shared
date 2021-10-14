import React from 'react';
import {
  padding,
  white,
  greyDk,
  blue500,
} from '../../styles';
import DefaultTabBar from 'react-native-scrollable-tab-view/DefaultTabBar';

export const Tabs = (props) => (
  <DefaultTabBar
    style={[padding.t10, {height: 45}]}
    backgroundColor={white.color}
    activeTextColor={blue500.color}
    inactiveTextColor={greyDk.color}
    underlineStyle={[blue500.bg]}
    {...props}
  />
)
export default Tabs
