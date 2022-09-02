import React from 'react';
import StarRating from 'react-native-star-rating';

import {
  Container
} from './styles';

export default Rating = ({ options, value, onChange, ...props }) => (
  <Container {...props}>
    <StarRating
      maxStars={5}
      rating={Number(value)}
      selectedStar={(value) => onChange({ value, label: value })}
      starColor={'#8a6d3b'}
      starSize={props.card ? 44 : 40}
    />
  </Container>
)