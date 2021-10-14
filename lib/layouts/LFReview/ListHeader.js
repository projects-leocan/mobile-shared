import React from 'react';
import moment from 'moment';

import {
  ListHeaderContainer,
  ListHeaderDate
} from './styles';

export default ListHeader = ({ date }) => (
  <ListHeaderContainer>
    <ListHeaderDate>{ moment(date).format('ll').toUpperCase() }</ListHeaderDate>
  </ListHeaderContainer> 
)