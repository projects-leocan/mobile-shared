import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding-vertical: 20px;
  padding-horizontal: 40px;
  background-color: #F2F2F2;

  ${props => props.narrow && css`
    padding-horizontal: 15px;
  `}
`