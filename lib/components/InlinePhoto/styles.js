import styled from 'styled-components/native';

import {
  grey100,
  blueLt,
  slate
} from 'rc-mobile-base/lib/styles';

const getContainerSize = (sz) => {
  let size = 96;
  
  switch(sz) {
    case "lg":
      size = 240; break;
    case "md":
      size = 160; break;
    case "sm":
      size = 96; break; 
  }

  return size;
}

export const getIconSize = (sz) => {
  let size = 32;
  
  switch(sz) {
    case "lg":
      size = 96; break;
    case "md":
      size = 64; break;
    case "sm":
      size = 32; break; 
  }

  return size;
}

export const Button = styled.TouchableOpacity`
  height: ${props => getContainerSize(props.sz)};
  width: ${props => getContainerSize(props.sz)};
  border-radius: 4px;
  border-width: 1px;
  border-color: ${grey100.color};
  justify-content: center;
  align-items: center;
`

export const ButtonLabel = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${blueLt.color};
  margin-top: 4px;
`

export const Picture = styled.ImageBackground`
  height: ${props => getContainerSize(props.sz)};
  width: ${props => getContainerSize(props.sz)};
  border-radius: 4px;
  border-width: 1px;
  border-color: ${grey100.color};
`