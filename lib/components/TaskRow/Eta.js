import React, { Component } from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import {
  greyDk,
  margin,
  text
} from 'rc-mobile-base/lib/styles';
import { get } from 'lodash/object';
import styled from 'styled-components/native';
import _ from 'lodash';

export const EtaEtdTitle = styled.Text`
  font-size: 10px;
  color: #4A4A4A;
  align-self:flex-start
`
export const EtaEtd = styled.Text`
  font-size: 10px;
  color: #4A4A4A;
  padding-left: 2px;
`


export const ETA = ({ task, isDisplay }) =>  {
    const room = get(task, 'room', null)
    const status = get(task, 'room.guestStatus', '')
    const guestStatus = String(status).toUpperCase();
    let etaTime = get(room, ['guests', 0, 'etaTime'], null);
    let etdTime = get(room, ['guests', 0, 'etdTime'], null);
    const guests = get(task, 'room.guests', [])

    if (guestStatus === "DEP") {
        return (
            <View style={{flexDirection:"row",paddingRight:10}}>
                <EtaEtdTitle>ETD:</EtaEtdTitle>
                <EtaEtd>{etdTime}</EtaEtd>
            </View>
        )
    }else if(guestStatus === "ARR"){
        return (
            <View style={{flexDirection:"row",paddingRight:10}}>
                <EtaEtdTitle>ETA:</EtaEtdTitle>
                <EtaEtd>{etaTime}</EtaEtd>
            </View>
        )
    }else if (guestStatus === 'DA') {
        let sortGuestData = !_.isEmpty(guests) ? [...guests].sort((a, b) => b?.status.localeCompare(a?.status)) : []
        return (
          <>
            {
              !_.isEmpty(sortGuestData) && (
                sortGuestData.map((gue) => {
                  return (
                    gue?.status === "departed" || gue?.status === "departure" ?
                          <View style={{flexDirection:"row",paddingRight:10}}>
                              <EtaEtdTitle>ETD:</EtaEtdTitle>
                              <EtaEtd>{gue?.etdTime}</EtaEtd>
                          </View>
                      :
                      gue?.status === "arrival" || gue?.status === "arrived" ?
                          <View style={{flexDirection:"row",paddingRight:10}}>
                              <EtaEtdTitle>ETA:</EtaEtdTitle>
                              <EtaEtd>{gue?.etaTime}</EtaEtd>
                          </View>
                      : null
                  )
                })
              )
            }
          </>
        )
      }else{
        return(
            <></>
        )
    }
}

export default ETA