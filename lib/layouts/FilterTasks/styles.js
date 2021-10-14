import styled from 'styled-components/native';
import React from 'react';

import {
  slate,
  grey400,
  blueLt,
  red,
  green
} from 'rc-mobile-base/lib/styles';

export const Container = styled.View`
  flex: 1;
  background-color: #F2F2F2;
`

export const SubheaderFilterContainer = styled.View`
  flex-direction: row;
  background-color: white;
`

export const SubheaderActiveFiltersContainer = styled.View`
  flex: 1;
  flex-direction: row;
  padding-horizontal: 10;
  margin-vertical: 3;
  flex-wrap: wrap;
`

export const SubheaderFilteredItemButton = styled.TouchableOpacity`
  height: 40;
  padding-horizontal: 12;
  border-radius: 20;
  background-color: ${blueLt.color};
  flex-direction: row;
  align-items: center;
  margin-right: 5;
  margin-vertical: 2;
`

export const SubheaderFilteredItemText = styled.Text`
  color: white;
  margin-right: 6;
`

export const SubheaderFilterButton = styled.TouchableOpacity`
  height: 50;
  width: 50;
  align-items: center;
  justify-content: center;
`

export const ModalContainer = styled.View`
  flex: 1;
  background-color: #F0F0F0;
`

export const ModalOptionItem = styled.TouchableOpacity`
  flex-direction: row;  
  height: 50;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1;
  border-color: ${grey400.color};
  background-color: white;
`

export const ModalOptionText = styled.Text`
  font-size: 17;
  color: ${slate.color};
  padding-left: 12;
`

export const ModalSectionHeaderContainer = styled.View`
  padding-horizontal: 12;
  padding-top: 15;
  padding-bottom: 5;
  border-bottom-width: 1;
  border-color: ${grey400.color};
  background-color: #F0F0F0;
`

export const ModalSectionHeaderText = styled.Text`
  font-size: 17;
  color: ${slate.color}; 
`

export const ModalSectionHeader = ({ children }) => (
  <ModalSectionHeaderContainer>
    <ModalSectionHeaderText>
      { children }
    </ModalSectionHeaderText>   
  </ModalSectionHeaderContainer> 
)