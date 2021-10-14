import React from 'react';
import moment from 'moment';

import TakePhoto from './TakePhoto';
import TakenPhoto from './TakenPhoto';

export const PhotoField = ({ input, onFocus, ...others }) => input.value ? (
  <TakenPhoto
    path={input.value.path}
    handlePress={() => input.onChange(null)}
    {...others}
  />
) : (
  <TakePhoto
    handlePress={(data) => input.onChange({ id: moment().format('X'), path: data.uri })}
    {...others}
  />
)

export default PhotoField
