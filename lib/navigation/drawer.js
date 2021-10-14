import React from 'react'

import DrawerContent from './DrawerContent';

export const DrawerCreator = (links, params) => (props) => {
  return (
    <DrawerContent links={links} {...props} />
  )
}

export default DrawerCreator;
