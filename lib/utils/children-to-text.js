import { isArray } from 'lodash/lang';

export const childrenToText = (children) => {
  let text = children; 
  try {
    if (isArray(children)) {
      text = children.join(' ');
    }
  }
  catch(err) {
    console.log(`Unable to convert children to text`, err);
    console.debug(children)
    text = '';
  }
  finally {
    return text.toUpperCase();
  }
}
