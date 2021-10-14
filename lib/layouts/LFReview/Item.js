import React from 'react';
import I18n from 'react-native-i18n'
import Picture from 'rc-mobile-base/lib/components/Picture';

import ItemType from './ItemType';

import {
  ItemContainer,
  ItemImage,
  ItemImagePlaceholder,
  ItemDescription,
  ItemTypeContainer,
  ItemReference,
  ItemGuest,
  ItemLocation,
  ItemUser,
  ItemStatusContainer,
  ItemStatusButton,
  ItemStatusText,
} from './styles';

import { updateOptionsLookup } from './utils';

export default Item = ({ item, handleActive }) => (
  <ItemContainer>
    <Picture
      size={60}
      value={item.image}
      enableLightbox
      />
    <ItemDescription>{ item.name_or_description }</ItemDescription>
    <ItemTypeContainer>
      <ItemType label={I18n.t('base.lost-found-review.index.found')} isFound={true} />
    </ItemTypeContainer>
    <ItemReference>{ item.reference }</ItemReference>
    <ItemGuest>{ item.guest_name }</ItemGuest>
    <ItemLocation>{ item.location || item.room_name }</ItemLocation>
    <ItemUser>{ `${item.user_first_name} ${item.user_last_name}` }</ItemUser>
    <ItemStatusContainer>
      <ItemStatusButton onPress={() => handleActive(item)}>
      <ItemStatusText>{ item.status ? I18n.t(updateOptionsLookup(item.status)) : "" }</ItemStatusText>
      </ItemStatusButton>     
    </ItemStatusContainer>
  </ItemContainer>
)