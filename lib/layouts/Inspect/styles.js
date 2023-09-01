import React from 'react';
import styled, { css } from 'styled-components/native';

import {
  
} from 'rc-mobile-base/lib/styles';

export const Margin = styled.View`
margin-top: ${props => props.top || 0}px;
margin-bottom: ${props => props.bottom || 0}px;
margin-left: ${props => props.left || 0}px;
margin-right: ${props => props.right || 0}px;
`