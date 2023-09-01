import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {
  white,
  grey100,
  grey400,
  blueLt,
  green,
  red,
  slate,
  lightBlue,
  splashBg,
  black
} from 'rc-mobile-base/lib/styles';

export const Container = styled.View`
  display: flex;
  flex: 1;
`

export const BodyContainer = styled.View`
  flex: 0.85;
`;

export const FooterContainer = styled.View`
  flex: 0.15;
  padding-horizontal: 25px;
  align-items: center;
  justify-content: center;
`;

export const Search = styled.View`
  padding: 14px 12px;
  margin-bottom: 5px;
`

export const SearchInput = styled.TextInput`
  height: 40px;
  border-radius: 20px;
  background-color: #fff;
  text-align: center;
  font-size: 15px;
  font-weight: 300;
  color: #9B9B9B;
`

export const ListContainer = styled.View`
  background-color: white;
  flex: 1;
`

export const ListHeader = styled.View`
  padding: 10px;
  height: 60px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${lightBlue.color};
`

export const ListGroupHeader = styled.View`
  padding: 10px;
  height: 60px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${splashBg.color};
`

export const ListFooter = styled.View`
  margin-bottom: 10px;
`

export const ListHeaderLabel = styled.Text`
  color: ${splashBg.color};
  font-weight: bold;
  font-size: 18px;
`

export const ListGroupHeaderLabel = styled.Text`
  color: ${white.color};
  font-weight: bold;
  font-size: 18px;
  flex: 1;
`

export const ListItem = styled.View`
  padding: 5px 10px;
  background-color: ${(props) => props.index % 2 - 1 ? white.color : grey100.color};
  minHeight: 60px;
  align-items: center;
`

export const Name = styled.Text`
  color: ${black.color};
  flex: 1;
  font-size: 16px;
`

export const BackupContainer = styled.View`
  background-color: ${grey400.color};
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 36px;
  border-radius: 18px;
  margin-right: 8px;
`

export const BackupLabel = styled.Text`
  color: ${white.color};
  font-weight: bold;
  font-size: 18px;
`
export const SubmitButton = styled.TouchableOpacity`
  background-color: ${blueLt.color};
  height: 50px;
  justify-content: center;
  align-items: center;
`

export const SubmitButtonDisabled = styled.TouchableOpacity`
  background-color: ${red.color};
  height: 50px;
  justify-content: center;
  align-items: center;
`

export const SubmitLabel = styled.Text`
  color: ${white.color};
  font-weight: bold;
`

export const CheckBoxContainer = styled.View`
  height: 60px;
  width: 70px;
  align-items: center;
  justify-content: center;
`;
