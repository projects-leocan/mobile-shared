import { get } from 'lodash/object';
import { isEqual, isNull } from 'lodash/lang';
import { every } from 'lodash/collection';

export default function checkEqual(c, n, path) {
  if (!path) {
    return isEqual(c, n);
  }
  return isEqual(get(c, path), get(n, path));
}
