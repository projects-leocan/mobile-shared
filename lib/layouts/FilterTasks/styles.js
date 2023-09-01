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
  padding-horizontal: 10px;
  margin-vertical: 3px;
  flex-wrap: wrap;
`

export const SubheaderFilteredItemButton = styled.TouchableOpacity`
  height: 40px;
  padding-horizontal: 12px;
  border-radius: 20px;
  background-color: ${blueLt.color};
  flex-direction: row;
  align-items: center;
  margin-right: 5px;
  margin-vertical: 2px;
`

export const SubheaderFilteredItemText = styled.Text`
  color: white;
  margin-right: 6px;
`

export const SubheaderFilterButton = styled.TouchableOpacity`
  height: 50px;
  width: 50px;
  align-items: center;
  justify-content: center;
`

export const ModalContainer = styled.View`
  flex: 1;
  background-color: #F0F0F0;
`

export const ModalOptionItem = styled.TouchableOpacity`
  flex-direction: row;  
  height: 50px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-color: ${grey400.color};
  background-color: white;
`

export const ModalOptionText = styled.Text`
  font-size: 17px;
  color: ${slate.color};
  padding-left: 12px;
`

export const ModalSectionHeaderContainer = styled.View`
  padding-horizontal: 12px;
  padding-top: 15px;
  padding-bottom: 5px;
  border-bottom-width: 1px;
  border-color: ${grey400.color};
  background-color: #F0F0F0;
`

export const ModalSectionHeaderText = styled.Text`
  font-size: 17px;
  color: ${slate.color}; 
`

export const ModalSectionHeader = ({ children }) => (
  <ModalSectionHeaderContainer>
    <ModalSectionHeaderText>
      { children }
    </ModalSectionHeaderText>   
  </ModalSectionHeaderContainer> 
)