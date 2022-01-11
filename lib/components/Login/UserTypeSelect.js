import React from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';

import styles from './styles';

export const missingImage = 'https://www.filepicker.io/api/file/Ptnbq1eDRfeQ3m4LTFnJ';

export const UserTypeSelect = ({ item, focusHotel, input: { onChange }, ...props }) => (
  <TouchableOpacity
    key={item.type}
    onPress={() => {
      onChange(item.type);
      focusHotel()
    }}
    {...props}
  >
        <Image source={item.img} style={styles.userImage} resizeMethod='resize' />
  </TouchableOpacity>
)

export default UserTypeSelect
