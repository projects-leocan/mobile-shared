import React, { Component } from 'react';
import styled, { css } from 'styled-components/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  green,
  greyDk,
  red,
  orange,
  blueLt,
} from 'rc-mobile-base/lib/styles';
import moment from 'moment';
import I18n from 'react-native-i18n';

const AuditWrapper = styled.TouchableOpacity`
  flex-direction: row;
  overflow: hidden;
  background-color: #fff;
  padding: 10px;
  height: 60;
  margin-top: 5px;
  margin-bottom: 0px;
  align-items: center;

  shadow-color: #000000;
  shadow-radius: 2;
  shadow-opacity: 1.0;
  shadow-offset: 3px;

  ${props => props.card && css`
    flex-direction: column;
    height: 135;
    align-items: flex-start;
  `}
`

const Name = styled.Text`
  flex: 1;
  font-size: 16;
  color: #222222;
  font-weight: bold;
  margin-left: 20;

  ${props => props.card && css`
    margin-left: 0;
    margin-top: 10;
    font-weight: normal;
    font-size: 20;
  `}
`

const Description = styled.Text`
  font-size: 14;
  color: #222222;
  margin-left: 10;
  margin-right: 15;

  ${props => props.card && css`
    flex: 1;
    margin-left: 0;
    margin-right: 0;
  `}
`

const ConsumptionName = styled.Text`
  font-size: 18;
  color: #222222;

  ${props => props.card && css`
    font-size: 16;
    color: #ADADAD;
  `}
`

const Inspections = styled.Text`
  font-size: 14;
  color: #ADADAD;
  margin-right: 20;
`

const Section = styled.View`
  margin-top: 10px;
`

const Button = styled.TouchableOpacity`
  flex-direction: row;
  height: 50px;
  align-items: center;
  justify-content: flex-end;
`

const IconWrapper = styled.View`
`

const Tail = styled.View`
  flex-direction: row;

  ${props => props.card && css`
    align-items: center;
    margin-top: 10;
  `}
`

const Actions = styled.View`
  ${props => props.card && css`
    flex: 1;
  `}
`

const colors = {
  open: red.color,
  completed: green.color,
  paused: orange.color,
}

const getColor = (status) => colors[status] || greyDk.color

const ButtonText = styled.Text`
  color: ${props => getColor(props.status)};
  margin-right: 10px;
  font-size: 18px;

  ${props => props.card && css`
    font-size: 15px;
  `}
`

const actions = {
  open: 'start',
  completed: 'review',
  paused: 'resume',
}

const getAction = (status) => actions[status] || "View"

const icons = {
  open: 'play',
  completed: 'refresh',
  paused: 'play',
}

const getIcon = (status) => icons[status] || "play"

const Action = ({ status, ...props }) => (
  <Button {...props}>
    <ButtonText status={status} card={props.card}>
      { I18n.t(`base.ubiquitous.${getAction(status)}`).toUpperCase() }
    </ButtonText>
    <FontAwesome
      name={getIcon(status)}
      color={getColor(status)}
      size={20}
    />
  </Button>
)

const Checkmark = () => <FontAwesome name="check-square-o" size={28} color={blueLt.color} />

const Audit = ({ name, inspections, status, consumptionName, onPress, card, ...props }) => (
  <AuditWrapper onPress={onPress} {...props} card={card}>
    {
      consumptionName ? (
        <ConsumptionName card={card}>
          {consumptionName}
        </ConsumptionName>
      ) : (
        <IconWrapper card={card}>
          <FontAwesome name="building-o" size={card ? 18 : 24} color={'#1A8CFF'} />
        </IconWrapper>
      )
    }
    <Name card={card}>
      {name}
    </Name>

    <Tail card={card}>
      { props.consumption_id && status === "open" ?
        <Description card={card}>
          { `${I18n.t('base.popup.index.created-by')}: ${props.responder_name || ""}` }
        </Description>
        : props.consumption_id ?
        <Description card={card}>
          { `${props.responder_name || ""} @ ${moment(props.updated_at).format('lll')}` }
        </Description>
        : null
      }
      <Actions card={card}>
        {props.children}
      </Actions>
    </Tail>
  </AuditWrapper>
)

Audit.defaultProps = {
  source: false,
}

Audit.Action = Action
Audit.Checkmark = Checkmark

export default Audit
