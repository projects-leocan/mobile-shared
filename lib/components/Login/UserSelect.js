import React from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';

import styles from './styles';

export const missingImage = 'https://www.filepicker.io/api/file/Ptnbq1eDRfeQ3m4LTFnJ';

export const UserSelect = ({ user, focusPassword, input: { onChange }, ...props }) => (
  <TouchableOpacity
    key={user.username}
    onPress={() => {
      onChange(user.username);
      focusPassword()
    }}
    {...props}
  >
    <Image source={{ uri: user.image || missingImage }} style={styles.userImage} resizeMethod='resize' />
  </TouchableOpacity>
)

export default UserSelect
